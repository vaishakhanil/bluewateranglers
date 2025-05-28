import React, { useEffect, useState } from 'react'
import { FormField } from '../molecules'
import { Button, Input } from '../atoms'
import { useNavigate } from 'react-router-dom'

export const ActivateTanks = () => {
  const navigate = useNavigate()
  const [tankInfo, setTankInfo] = useState([])
  const [formData, setFormData] = useState([]) // Track the form data separately
  const [isAdmin, setIsAdmin] = useState(false)

  // Fetch tanks and user role
  useEffect(() => {
    const loadData = async () => {
      const data = await window.electron.api.getAllTankInfo()
      if (data) {
        setTankInfo(data)
        fetchUserRole()
      }
    }
    loadData()
  }, [])

  const fetchUserRole = async () => {
    const role = await window.electron.auth.getRole()
    if (role === 'admin') setIsAdmin(true)
  }

  // Handle edit click for tank
  const handleEdit = (id) => {
    navigate(`/editTanks/${id}`)
  }

  // Handle toggle active checkbox
  const handleToggle = (event, tankId) => {
    // Find the tank in tankInfo
    const updatedTankInfo = tankInfo.map((tank) =>
      tank.tank_id === tankId
        ? { ...tank, tank_active: !tank.tank_active } // Toggle the tank_active status
        : tank
    )

    // Update the tankInfo state with new active/inactive value
    setTankInfo(updatedTankInfo)

    // Update formData to keep track of changes
    const updatedFormData = updatedTankInfo.map((tank) => ({
      tank_id: tank.tank_id,
      tank_active: tank.tank_active ? 1 : 0
    }))

    setFormData(updatedFormData)
  }

  const handleActivation = async () => {
    console.log(formData)
    await window.electron.api.activateTanks(formData)
    navigate('/addRecords')
  }


  // Render form data for tanks
  const renderFormData = () => {
    if (tankInfo.length === 0) {
      return <tr><td colSpan="3">No Tanks Found</td></tr>
    }

    return tankInfo.map((tankData) => (
      <tr key={tankData.tank_id}>
        <td>{tankData.tank_name}</td>
        <td>
          <Input
            type="checkbox"
            checked={tankData.tank_active}
            onChange={(event) => handleToggle(event, tankData.tank_id)}
          />
        </td>
        {isAdmin && (
          <td>
            <Button variant={'primary'} onClick={() => handleEdit(tankData.tank_id)}>
              Edit
            </Button>
          </td>
        )}
      </tr>
    ))
  }

  return (
    <div className="activate-tanks-layout">
      <h1>Activate Tanks</h1>
      <div className="render-tanks">
        <table>
          <thead>
            <tr>
              <th>Tank Name</th>
              <th>Active</th>
              {isAdmin && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {renderFormData()}
          </tbody>
        </table>
      </div>
      <Button onClick={handleActivation}>Save & Exit</Button>
    </div>
  )
}
