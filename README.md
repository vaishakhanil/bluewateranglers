# Step by Step Plan

---

1.  Setup and Connect Plant Reading Database - Done
2.  Setup the admin login - done
3.  Setup the Form and Insert data - done
4.  Setup the Display of the table after reading the database - done
5.  Setup the admin Edit part
6.  Search Feature
7.  Feature to save as excel and open in excel
8.  Generate Reports
9.  Load all 800 records and tables

    {/\*
    DATE
    HEADER PRESSURE

          PUMP #1
          PUMP #2
          PUMP #3
          PUMP #4
          EAST PUMP

          EAST WELL PRESSURE
          WATER TEMPERATURE

          EAST BLOWER NORTH
          WEST BLOWER
          EAST BLOWER SOUTH

          EAST BLOWER HEADER PRESSURE
          WEST BLOWER HEADER PRESSURE

          AERIATION TANK OVERFLOW

          DIESEL ROOM TEMPERATURE
          BATTERY

          BLOCK HEATER
          GENERATOR AUTOSTART

          GENERATOR HOURS
          GENERATOR MINUTES
          FUEL TANK LEVEL

          TRANSFER SWITCH
          GENERATOR AT REST
          PLC ACTIVE
          ALARAM ACTIVATED

          OPERATOR NAME
          */}

    {/\*

         APPEND TANKS
         -------------

         TANK NAME

         FLOW
         CLEAN

         DO

         FOOD SIZE (EVERY TUESDAYS)
         FISH SIZE

         DIET
         DIET TYPE (GRAMS / L)

         MORT (DEAD FISHES)

         */}

// const renderData = () => {
// if (plantReadings.length === 0) {
// return <p>No plant readings found.</p>
// }

// return (
// <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
// <thead>
// <tr>
// <th style={thStyle}>Date</th>
// <th style={thStyle}>Operator</th>
// <th style={thStyle}>Header Pressure</th>
// <th style={thStyle}>Water Temp</th>
// <th style={thStyle}>Tanks</th>
// </tr>
// </thead>
// <tbody>
// {plantReadings.map((reading) => (
// <tr key={reading.id}>
// <td style={tdStyle}>{new Date(reading.timestamp).toLocaleDateString('en-GB')}</td>
// <td style={tdStyle}>{reading.operator_name}</td>
// <td style={tdStyle}>{reading.header_pressure_in}</td>
// <td style={tdStyle}>{reading.water_temperature}</td>
// <td style={tdStyle}>
// {reading.tank_snapshots.length > 0 ? (
// <table style={{ width: '100%', borderCollapse: 'collapse' }}>
// <thead>
// <tr>
// <th style={thStyle}>Tank</th>
// <th style={thStyle}>Flow</th>
// <th style={thStyle}>Clean</th>
// <th style={thStyle}>DO</th>
// <th style={thStyle}>Fish Size</th>
// <th style={thStyle}>Diet</th>
// <th style={thStyle}>Diet Type</th>
// <th style={thStyle}>Mort</th>
// </tr>
// </thead>
// <tbody>
// {reading.tank_snapshots.map((tank) => (
// <tr key={tank.snapshot_id}>
// <td style={tdStyle}>{tank.tank_name}</td>
// <td style={tdStyle}>{tank.flow ? 'Yes' : 'No'}</td>
// <td style={tdStyle}>{tank.clean ? 'Yes' : 'No'}</td>
// <td style={tdStyle}>{tank.do_level}</td>
// <td style={tdStyle}>{tank.fish_size}</td>
// <td style={tdStyle}>{tank.diet}</td>
// <td style={tdStyle}>{tank.diet_type}</td>
// <td style={tdStyle}>{tank.mort}</td>
// </tr>
// ))}
// </tbody>
// </table>
// ) : (
// <em>No tanks</em>
// )}
// </td>
// </tr>
// ))}
// </tbody>
// </table>
// )
// }

// const thStyle = { border: '1px solid #ddd', padding: '8px', background: '#f4f4f4' }
// const tdStyle = { border: '1px solid #ddd', padding: '8px', verticalAlign: 'top' }
