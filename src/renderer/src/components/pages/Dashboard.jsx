import { useEffect, useState } from 'react'
import { Header } from '../organisms/Header/Header'
import { Button } from '../atoms'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../organisms/Loader/Loader'

import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

export const Dashboard = () => {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loader, setLoader] = useState(false)
  const [page, setPage] = useState(1)
  const [plantReadings, setPlantReadings] = useState([])

  useEffect(() => {
    fetchUserRole()
    getData()
  }, [])

  useEffect(() => {
    getData()
  }, [page])

  const getData = async () => {
    const data = await window.electron.api.getPlantReadings(page)
    console.log(data)
    if (data['plant_readings']) {
      setPlantReadings(data['plant_readings'])
    }
  }

  const fetchUserRole = async () => {
    setLoader(true)
    const role = await window.electron.auth.getRole()
    if (role === 'admin') setIsAdmin(true)
    setLoader(false)
  }

  const handleLogout = () => {
    window.electron.auth.logout()
    window.location.reload()
  }

  const handlePageChange = (e) => {
    const val = parseInt(e.target.value)
    if (!isNaN(val) && val > 0) {
      setPage(val)
    }
  }

  const handleNext = () => setPage((p) => p + 1)
  const handlePrev = () => setPage((p) => Math.max(1, p - 1))

  return (
    <>
      {loader && <Loader />}
      <Header isAdmin={isAdmin} />

      {/* 
          DISPLAY THE DATA
      */}
      {/* {renderData()} */}

      <Tabs>
        <TabList>
          <Tab>Base Area</Tab>
          <Tab>Aeration System</Tab>
          <Tab>Generator Area</Tab>
          <Tab>Tanks</Tab>
        </TabList>

        {/* BA Tab */}
        <TabPanel>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Header Pressure</th>
                <th>Pump 1</th>
                <th>Pump 2</th>
                <th>Pump 3</th>
                <th>Pump 4</th>
                <th>East Pump North</th>
                <th>East Well Pressure</th>
                <th>Water Temp</th>
                <th>Alarm</th>
                {isAdmin && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {plantReadings.map((reading) => (
                <tr key={reading.id}>
                  <td>{new Date(reading.timestamp).toLocaleDateString('en-GB')}</td>
                  <td>{reading.header_pressure_in}</td>
                  <td>{reading.pump_1_active ? 'Active' : 'Inactive'}</td>
                  <td>{reading.pump_2_active ? 'Active' : 'Inactive'}</td>
                  <td>{reading.pump_3_active ? 'Active' : 'Inactive'}</td>
                  <td>{reading.pump_4_active ? 'Active' : 'Inactive'}</td>
                  <td>{reading.east_pump_active ? 'Active' : 'Inactive'}</td>
                  <td>{reading.east_well_pressure}</td>
                  <td>{reading.water_temperature}</td>
                  <td>{reading.alarm_activated ? 'Yes' : 'No'}</td>
                  {isAdmin && (
                    <td>
                      <button>edit</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        {/* AS Tab */}
        <TabPanel>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>East Blower North</th>
                <th>East Blower South</th>
                <th>West Blower</th>
                <th>East Blower Pressure</th>
                <th>West Blower Pressure</th>
                <th>Overflow</th>
              </tr>
            </thead>
            <tbody>
              {plantReadings.map((reading) => (
                <tr key={reading.id}>
                  <td>{new Date(reading.timestamp).toLocaleDateString('en-GB')}</td>
                  <td>{reading.east_blower_north_active ? 'Active' : 'Inactive'}</td>
                  <td>{reading.east_blower_south_active ? 'Active' : 'Inactive'}</td>
                  <td>{reading.west_blower_active ? 'Active' : 'Inactive'}</td>
                  <td>{reading.east_blower_header_pressure}</td>
                  <td>{reading.west_blower_header_pressure}</td>
                  <td>{reading.aeration_tank_overflow ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        {/* GA Tab */}
        <TabPanel>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Room Temp</th>
                <th>Battery</th>
                <th>Block Heater</th>
                <th>Autostart</th>
                <th>Hours</th>
                <th>Fuel Tank Level</th>
                <th>Transfer Switch</th>
                <th>Generator at Rest</th>
                <th>PLC Active</th>
              </tr>
            </thead>
            <tbody>
              {plantReadings.map((reading) => (
                <tr key={reading.id}>
                  <td>{new Date(reading.timestamp).toLocaleDateString('en-GB')}</td>
                  <td>{reading.diesel_room_temperature}</td>
                  <td>{reading.battery_voltage}</td>
                  <td>{reading.block_heater_active ? 'Active' : 'Inactive'}</td>
                  <td>{reading.generator_autostart ? 'Yes' : 'No'}</td>
                  <td>{`${reading.generator_hours}:${reading.generator_minutes}`}</td>
                  <td>{reading.fuel_tank_level}</td>
                  <td>{reading.transfer_switch_active ? 'Active' : 'Inactive'}</td>
                  <td>{reading.generator_at_rest ? 'Yes' : 'No'}</td>
                  <td>{reading.plc_active ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>
      </Tabs>

      {isAdmin ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Button onClick={() => navigate('/login')}>Switch to User</Button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <button onClick={handlePrev} disabled={page === 1}>
          Previous
        </button>
        <input
          type="number"
          value={page}
          onChange={handlePageChange}
          style={{ width: 60, margin: '0 10px' }}
        />
        <button onClick={handleNext}>Next</button>
      </div>
    </>
  )
}
