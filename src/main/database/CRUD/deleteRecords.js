import { db } from '../initializeDatabase'

// Function to delete a plant reading and its related tank snapshots
export const deleteRecords = (plantReadingId) => {
  db.prepare('BEGIN TRANSACTION').run()

  try {
    // Delete related tank snapshots
    const deleteSnapshotsStmt = db.prepare('DELETE FROM tank_snapshots WHERE reading_id = ?')
    deleteSnapshotsStmt.run(plantReadingId)

    // Delete the plant reading
    const deleteReadingStmt = db.prepare('DELETE FROM plant_readings WHERE id = ?')
    deleteReadingStmt.run(plantReadingId)

    db.prepare('COMMIT').run()

    return { success: true, message: 'Plant reading and related snapshots deleted successfully' }
  } catch (error) {
    db.prepare('ROLLBACK').run()
    console.error('Error during deletion:', error)
    return { success: false, message: error.message }
  }
}
