import { useState, useEffect } from 'react'
import { FormField } from '../molecules'
import { Button, Labels } from '../atoms'
import { Select } from '../atoms/Inputs'

const foodOptions = [
  '"0" CRUMB',
  '"1" CRUMB',
  '"2" CRUMB',
  '#1.2 MM',
  '#1.5 MM',
  '#2 MM',
  '#3 MM FLOAT',
  '#5 MM FLOAT'
]
const dietTypes = ['gm', 'L']

export const TankForm = ({ initialData = {}, onSave, onCancel }) => {
  // State to store form data
  const [tankData, setTankData] = useState({
    tank_name: '',
    fish_type_name: '',
    number_of_fishes: 0,
    flow: false,
    clean: false,
    do_level: '',
    food_size: '',
    fish_size: '',
    diet: '',
    diet_type: '',
    mort: '',
    ...initialData
  })

  // State to determine if it's Tuesday
  const [isTuesday, setIsTuesday] = useState(false)

  const [isAdmin, setIsAdmin] = useState(false)
  const [loader, setLoader] = useState(false)

  // Check if today is Tuesday (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
  useEffect(() => {
    fetchUserRole()
    const today = new Date().getDay()
    setIsTuesday(today === 2) // 2 corresponds to Tuesday
  }, [])

  const fetchUserRole = async () => {
    setLoader(true)
    const role = await window.electron.auth.getRole()
    if (role === 'admin') setIsAdmin(true)
    setLoader(false)
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setTankData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle form submission
  const handleSubmit = () => {
    console.log(tankData)
    onSave(tankData)
  }

  return (
    <div className="tank-form">
      <FormField
        label="TANK NAME"
        name="tank_name"
        value={tankData.tank_name}
        onChange={handleChange}
      />
      <FormField
        label="FISH TYPE"
        name="fish_type_name"
        value={tankData.fish_type_name}
        onChange={handleChange}
      />

      <div className="form__tank-block">
        <FormField
          label="FLOW"
          name="flow"
          type="checkbox"
          value={tankData.flow}
          onChange={handleChange}
        />
        <FormField
          label="CLEAN"
          name="clean"
          type="checkbox"
          value={tankData.clean}
          onChange={handleChange}
        />
      </div>
      <FormField label="DO" name="do_level" value={tankData.do_level} onChange={handleChange} />

      {/* Food Size Dropdown */}
      <Labels>FOOD SIZE (EVERY TUESDAY)</Labels>
      <Select
        name="food_size"
        value={tankData.food_size}
        onChange={handleChange}
        disabled={!isTuesday && !isAdmin} // Disable if not Tuesday and not admin
      >
        <option value="">Select</option>
        {foodOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>

      {/* Fish Size Input */}
      <FormField
        label="FISH SIZE (EVERY TUESDAY)"
        name="fish_size"
        value={tankData.fish_size}
        onChange={handleChange}
        disabled={!isTuesday && !isAdmin} // Disable if not Tuesday and not admin
      />

      {/* Number of Fishes Input */}
      <FormField
        label="NUMBER OF FISHES"
        name="number_of_fishes"
        value={tankData.number_of_fishes}
        onChange={handleChange}
      />

      <FormField label="DIET" name="diet" value={tankData.diet} onChange={handleChange} />

      <Labels>DIET TYPE (GRAMS / L)</Labels>
      <Select name="diet_type" value={tankData.diet_type} onChange={handleChange}>
        <option value="">Select</option>
        {dietTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>

      <FormField label="MORT" name="mort" value={tankData.mort} onChange={handleChange} />

      <Button onClick={handleSubmit}>Save</Button>
      <Button onClick={onCancel}>Cancel</Button>
    </div>
  )
}
