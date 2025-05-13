import { useState, useEffect } from 'react'
import { FormField } from '../molecules'

const foodOptions = ['Small', 'Medium', 'Large']
const dietTypes = ['gm', 'L']

export const TankForm = ({ initialData = {}, onSave, onCancel }) => {
  const [tankData, setTankData] = useState({
    tank_name: '',
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

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setTankData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = () => {
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
      <FormField label="DO" name="do_level" value={tankData.do_level} onChange={handleChange} />

      <label>FOOD SIZE (EVERY TUESDAYS)</label>
      <select name="food_size" value={tankData.food_size} onChange={handleChange}>
        <option value="">Select</option>
        {foodOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <FormField
        label="FISH SIZE"
        name="fish_size"
        value={tankData.fish_size}
        onChange={handleChange}
      />
      <FormField label="DIET" name="diet" value={tankData.diet} onChange={handleChange} />

      <label>DIET TYPE (GRAMS / L)</label>
      <select name="diet_type" value={tankData.diet_type} onChange={handleChange}>
        <option value="">Select</option>
        {dietTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <FormField label="MORT" name="mort" value={tankData.mort} onChange={handleChange} />

      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}
