import { useState } from 'react'
import { Header } from '../organisms/Header/Header'
import { Loader } from '../organisms/Loader/Loader'

export const GenerateReports = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.')
      return
    }

    const startISO = new Date(startDate).toISOString()
    const endISO = new Date(endDate).toISOString()

    if (new Date(startISO) > new Date(endISO)) {
      alert('Start date must be before end date.')
      return
    }

    try {
      setLoading(true)
      const dates = {
        start: startISO,
        end: endISO
      }
      await window.electron.api.generateExcel(dates)
      alert('Excel file generated successfully.')
    } catch (err) {
      console.error(err)
      alert('Failed to generate Excel: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <Header displayMenus={false} displayReportMenu={true} />
      <div style={{ padding: '2rem' }}>
        <h2>Export Plant Data</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Start Date:{' '}
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            End Date:{' '}
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handleExport} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Excel'}
        </button>
      </div>
    </>
  )
}
