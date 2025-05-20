import React, { useEffect, useState } from 'react'
import { FormField } from '../molecules'
import { Button, Input } from '../atoms'
import { useNavigate } from 'react-router-dom'

export const ActivateTanks = () => {
  const navigate = useNavigate()
  const [tankInfo, setTankInfo] = useState([])
  const [formData, setFormData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const data = await window.electron.api.getAllTankInfo()
      if (data) {
        console.log(data)
        setTankInfo(data)
      }
    }
    loadData()
  }, [])

  const renderFormData = () => {
    if (tankInfo.length === 0) {
      return 'No Tanks Found'
    }

    const handleToggle = (event) => {
      event.stopPropagation()

      let checkbox
      if (event.target.type === 'checkbox') {
        checkbox = event.target
      } else {
        checkbox = event.currentTarget.querySelector('input[type="checkbox"]')
      }

      if (checkbox) {
        const tankId = checkbox.id
        const newValue = !checkbox.checked

        // Toggle visually (if not using controlled component)
        checkbox.checked = newValue

        // Update formData by toggling tank_active
        setFormData((prevData) => {
          let updatedData = []
          let index = -1

          if (prevData.length != 0) {
            updatedData = [...prevData]
            index = updatedData.findIndex((item) => item.tank_id === tankId)
          }

          if (index !== -1) {
            // Update existing entry
            updatedData[index] = {
              ...updatedData[index],
              tank_active: newValue
            }
          } else {
            // Add new entry
            updatedData.push({
              tank_id: tankId,
              tank_active: newValue
            })
          }

          return updatedData
        })

        console.log(`Tank ${tankId} is now ${JSON.stringify(formData)}`)
      }
    }

    return tankInfo.map((tankData) => (
      <tr key={tankData.tank_id}>
        <td>{tankData.tank_name}</td>
        <td id={tankData.tank_id} onClick={handleToggle}>
          <input
            id={tankData.tank_id}
            type="checkbox"
            checked={tankData.tank_active}
            onChange={handleToggle}
          />
        </td>
      </tr>
    ))
  }

  return (
    <div className="activate-tanks-layout">
      <h1>Activate Tanks</h1>
      <div className="render-tanks">
        <table>
          <thead>
            <th>Tank Name</th>
            <th>Active</th>
          </thead>
          {renderFormData()}
        </table>
      </div>
      <Button onClick={() => navigate('/addRecords')}>Save & Exit</Button>
    </div>
  )
}
