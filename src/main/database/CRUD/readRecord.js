import { db } from '../initializeDatabase'

export const getTotalNumberOfPages = (tableName) => {
  const result = db
    .prepare(
      `
      SELECT COUNT(*) as count
      FROM ${tableName}
    `
    )
    .get()

  return result.count
}

export const getPaginatedReadings = (page = 1, pageSize = 5) => {
  const offset = (page - 1) * pageSize

  // 1. Get the plant_readings (paginated)
  const readings = db
    .prepare(
      `
      SELECT * FROM plant_readings
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `
    )
    .all(pageSize, offset)

  // 2. Get all reading_ids from current page
  const readingIds = readings.map((r) => r.id)

  if (readingIds.length === 0) return []

  // 3. Get all related tank_snapshots, including tank name and fish type name
  const placeholders = readingIds.map(() => '?').join(',')
  const snapshots = db
    .prepare(
      `
      SELECT 
        ts.*, 
        t.tank_name,
        ft.fish_type_name
      FROM tank_snapshots ts
      LEFT JOIN tanks t ON ts.tank_id = t.tank_id
      LEFT JOIN fish_types ft ON ts.fish_type_id = ft.fish_type_id
      WHERE ts.reading_id IN (${placeholders})
    `
    )
    .all(...readingIds)

  // 4. Group snapshots by reading_id
  const snapshotsByReading = {}
  snapshots.forEach((snapshot) => {
    if (!snapshotsByReading[snapshot.reading_id]) {
      snapshotsByReading[snapshot.reading_id] = []
    }
    snapshotsByReading[snapshot.reading_id].push(snapshot)
  })

  // 5. Attach snapshots to readings
  const result = readings.map((reading) => ({
    ...reading,
    tank_snapshots: snapshotsByReading[reading.id] || []
  }))

  return result
}

export const getDataUsingDate = (start, end) => {
  // 1. Get the plant_readings within the date range
  const readings = db
    .prepare(
      `
      SELECT * FROM plant_readings
      WHERE timestamp BETWEEN ? AND ?
      ORDER BY timestamp DESC
    `
    )
    .all(start, end)

  // 2. Get all reading_ids
  const readingIds = readings.map((r) => r.id)

  if (readingIds.length === 0) return []

  // 3. Get all related tank_snapshots with tank name
  const snapshots = db
    .prepare(
      `
      SELECT 
        ts.*, 
        t.tank_name 
      FROM tank_snapshots ts
      LEFT JOIN tanks t ON ts.tank_id = t.tank_id
      WHERE ts.reading_id IN (${readingIds.map(() => '?').join(',')})
    `
    )
    .all(...readingIds)

  // 4. Group snapshots by reading_id
  const snapshotsByReading = {}
  snapshots.forEach((snapshot) => {
    if (!snapshotsByReading[snapshot.reading_id]) {
      snapshotsByReading[snapshot.reading_id] = []
    }
    snapshotsByReading[snapshot.reading_id].push(snapshot)
  })

  // 5. Attach snapshots to readings
  const result = readings.map((reading) => ({
    ...reading,
    tank_snapshots: snapshotsByReading[reading.id] || []
  }))

  return result
}

export const getRecordById = (id) => {
  // 1. Get the plant_reading by the given id
  const reading = db
    .prepare(
      `
      SELECT * FROM plant_readings
      WHERE id = ?
      `
    )
    .get(id)

  // If no record is found, return null
  if (!reading) return null

  // 2. Get all related tank_snapshots with tank name and fish type name
  const snapshots = db
    .prepare(
      `
      SELECT 
        ts.*, 
        t.tank_name,
        ft.fish_type_name
      FROM tank_snapshots ts
      LEFT JOIN tanks t ON ts.tank_id = t.tank_id
      LEFT JOIN fish_types ft ON ts.fish_type_id = ft.fish_type_id
      WHERE ts.reading_id = ?
      `
    )
    .all(id)

  // 3. Attach snapshots to the reading
  const result = {
    ...reading,
    tank_snapshots: snapshots
  }

  return result
}


export const getTankById = (tankId) => {
  const tankInfo = db
    .prepare(
      `
      SELECT * FROM tanks
      WHERE tank_id = ?
    `
    )
    .get(tankId)

  if (!tankInfo) return null

  // Get distinct fish types associated with this tank via tank_snapshots
  const fishTypes = db
    .prepare(
      `
      SELECT DISTINCT ft.fish_type_id, ft.fish_type_name
      FROM tank_snapshots ts
      JOIN fish_types ft ON ts.fish_type_id = ft.fish_type_id
      WHERE ts.tank_id = ?
    `
    )
    .all(tankId)

  tankInfo.fish_type_name = fishTypes

  console.log(tankInfo)

  return {
    tank: tankInfo
  }
}
export const getAllTankInfo = () => {
  const AllTanks = db.prepare('SELECT * FROM TANKS').all()
  return AllTanks
}
