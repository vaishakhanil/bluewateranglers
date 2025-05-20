import { db } from '../initializeDatabase'

// Helper to format current date (used for checking same-day insert)
const getDateOnly = () => new Date().toISOString().split('T')[0]

export const editRecords = (readingData) => {
  const { plant_reading, tanks } = readingData

  const {
    id, // Expecting 'id' to be part of plant_reading object
    header_pressure_in,
    pump_1_active,
    pump_2_active,
    pump_3_active,
    pump_4_active,
    east_pump_active,
    east_blower_north_active,
    west_blower_active,
    east_blower_south_active,
    east_well_pressure,
    water_temperature,
    east_blower_header_pressure,
    west_blower_header_pressure,
    aeration_tank_overflow,
    diesel_room_temperature,
    battery_voltage,
    block_heater_active,
    generator_autostart,
    generator_hours,
    generator_minutes,
    fuel_tank_level,
    transfer_switch_active,
    generator_at_rest,
    plc_active,
    alarm_activated,
    operator_name
  } = plant_reading

  const currentDate = getDateOnly()

  db.prepare('BEGIN TRANSACTION').run()

  try {
    // 1. Ensure the record exists based on provided 'id' (we're updating here)
    const existingReadingStmt = db.prepare(`
      SELECT id FROM plant_readings
      WHERE id = ?
    `)
    const existingReading = existingReadingStmt.get(id)

    if (!existingReading) {
      throw new Error('Record not found for the provided ID')
    }

    // 2. Update existing reading with provided data
    const updateStmt = db.prepare(`
      UPDATE plant_readings SET
        header_pressure_in = ?, pump_1_active = ?, pump_2_active = ?, pump_3_active = ?, pump_4_active = ?,
        east_pump_active = ?, east_blower_north_active = ?, west_blower_active = ?, east_blower_south_active = ?,
        east_well_pressure = ?, water_temperature = ?, east_blower_header_pressure = ?, west_blower_header_pressure = ?,
        aeration_tank_overflow = ?, diesel_room_temperature = ?, battery_voltage = ?, block_heater_active = ?,
        generator_autostart = ?, generator_hours = ?, generator_minutes = ?, fuel_tank_level = ?,
        transfer_switch_active = ?, generator_at_rest = ?, plc_active = ?, alarm_activated = ?, operator_name = ?
      WHERE id = ?
    `)

    updateStmt.run(
      header_pressure_in,
      pump_1_active,
      pump_2_active,
      pump_3_active,
      pump_4_active,
      east_pump_active,
      east_blower_north_active,
      west_blower_active,
      east_blower_south_active,
      east_well_pressure,
      water_temperature,
      east_blower_header_pressure,
      west_blower_header_pressure,
      aeration_tank_overflow,
      diesel_room_temperature,
      battery_voltage,
      block_heater_active,
      generator_autostart,
      generator_hours,
      generator_minutes,
      fuel_tank_level,
      transfer_switch_active,
      generator_at_rest,
      plc_active,
      alarm_activated,
      operator_name,
      id // ID to match the record
    )

    // 3. Handle tanks and snapshots
    // Get the current snapshots for the reading (before deleting any)
    const currentSnapshotsStmt = db.prepare(`
      SELECT tank_id FROM tank_snapshots WHERE reading_id = ?
    `)
    const currentSnapshots = currentSnapshotsStmt.all(id)

    const currentTankIds = currentSnapshots.map((snapshot) => snapshot.tank_id)
    const updatedTankIds = tanks.map((tank) => {
      // Insert tank if it doesn't exist
      const existingTankStmt = db.prepare(`SELECT tank_id FROM tanks WHERE tank_name = ?`)
      const existingTank = existingTankStmt.get(tank.tank_name)

      let tankId

      if (existingTank) {
        tankId = existingTank.tank_id
      } else {
        const insertTankStmt = db.prepare(
          `INSERT INTO tanks (tank_name) VALUES (?) RETURNING tank_id`
        )
        const insertTank = insertTankStmt.get(tank.tank_name)
        tankId = insertTank.tank_id
      }

      return tankId
    })

    // 4. Delete snapshots for tanks no longer associated with the current reading
    const tanksToDelete = currentTankIds.filter((tankId) => !updatedTankIds.includes(tankId))

    if (tanksToDelete.length > 0) {
      const deleteSnapshotStmt = db.prepare(`
        DELETE FROM tank_snapshots
        WHERE reading_id = ? AND tank_id IN (${tanksToDelete.map(() => '?').join(',')})
      `)
      deleteSnapshotStmt.run([id, ...tanksToDelete])
    }

    // 5. Insert or update the tank snapshots
    for (let tank of tanks) {
      const tankId = updatedTankIds.find((tid) => tid === tank.tank_id) // Find the correct tank_id

      // UPSERT tank snapshot (based on reading_id + tank_id)
      const upsertSnapshotStmt = db.prepare(`
        INSERT INTO tank_snapshots (
          reading_id, tank_id, flow, clean, do_level, food_size, fish_size, diet, diet_type, mort
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(reading_id, tank_id) DO UPDATE SET
          flow = excluded.flow,
          clean = excluded.clean,
          do_level = excluded.do_level,
          food_size = excluded.food_size,
          fish_size = excluded.fish_size,
          diet = excluded.diet,
          diet_type = excluded.diet_type,
          mort = excluded.mort
      `)

      upsertSnapshotStmt.run(
        id, // Use the provided reading ID here for the update
        tankId,
        tank.flow || 0,
        tank.clean || 0,
        tank.do_level || 0,
        tank.food_size || 0.0,
        tank.fish_size || 0.0,
        tank.diet || 0.0,
        tank.diet_type || 'L',
        tank.mort || 0
      )
    }

    db.prepare('COMMIT').run()
    return { success: true, message: 'Updated plant reading and tank data successfully.' }
  } catch (error) {
    db.prepare('ROLLBACK').run()
    console.error('Transaction failed:', error)
    return { success: false, error: error.message }
  }
}
