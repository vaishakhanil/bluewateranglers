import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FormField } from '../molecules'
import { Button } from '../atoms'

export const EditTanks = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    tank_name: '',
    tank_active: false
  })

  useEffect(() => {
    if(id) {
        const fetchTankData = async () => {
            // const data = await setFormData
        } 
    }
  }, [])

  const submitTanks = () => {
    console.log('active')
  }

  const handleChange = (event) => {
    const { tankName } = event.target
    console.log(tankName)
  }

  return (
    <div className="add-tanks-container">
      <h1>Activate Tanks</h1>
      <div className="add-tanks-form-container">
        <FormField
          label="Tank Name"
          name="tankName"
          value={formData.tank_name}
          onChange={handleChange}
        />
        <FormField
          label="Activate Tank"
          name="activateTank"
          type="checkbox"
          value={formData.tank_active}
          onChange={handleChange}
        />
        <div>
          <Button onClick={submitTanks}>Save</Button>
          <Button onClick={() => navigate('/addRecords')}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}
