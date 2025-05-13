import { db } from '../initializeDatabase'

export const getPaginatedReadings = (page = 1, pageSize = 20) => {
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
