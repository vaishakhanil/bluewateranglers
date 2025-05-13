import { useState, useMemo } from 'react'

export const TankSnapshotViewer = (data = []) => {
  const snapshotArray = data.snapshots

  const tankNames = useMemo(() => {
    const unique = new Map()
    snapshotArray.forEach((snap) => {
      const name = snap.tank_name.toLowerCase()
      if (!unique.has(name)) {
        unique.set(name, snap.tank_name)
      }
    })
    return Array.from(unique.values())
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleDropdownChange = (e) => {
    const selectedName = e.target.value
    const index = tankNames.findIndex((name) => name === selectedName)
    if (index !== -1) setCurrentIndex(index)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? tankNames.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === tankNames.length - 1 ? 0 : prev + 1))
  }

  const currentTankName = tankNames[currentIndex]
  const filteredSnapshots = snapshotArray.filter(
    (snap) => snap.tank_name.toLowerCase() === currentTankName.toLowerCase()
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <h3>TANK</h3>
        <select value={currentTankName} onChange={handleDropdownChange}>
          {tankNames.map((name, idx) => (
            <option key={idx} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button onClick={handlePrev}>⬅️</button>
        <button onClick={handleNext}>➡️</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Flow</th>
            <th>Clean</th>
            <th>DO Level</th>
            <th>Food Size</th>
            <th>Fish Size</th>
            <th>Diet</th>
            <th>Diet Type</th>
            <th>Mortality</th>
          </tr>
        </thead>
        <tbody>
          {filteredSnapshots.map((snap) => (
            <tr key={snap.snapshot_id}>
              <td>{snap.timestamp}</td>
              <td className={snap.flow ? 'active-table-cell' : 'inactive-table-cell'}>
                {snap.flow ? 'True' : 'False'}
              </td>
              <td className={snap.flow ? 'active-table-cell' : 'inactive-table-cell'}>
                {snap.clean ? 'True' : 'False'}
              </td>
              <td>{snap.do_level}</td>
              <td>{snap.food_size}</td>
              <td>{snap.fish_size}</td>
              <td>{snap.diet}</td>
              <td>{snap.diet_type}</td>
              <td>{snap.mort}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TankSnapshotViewer
