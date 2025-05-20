import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import {
  Dashboard,
  LoginPage,
  GenerateReports,
  AddRecords,
  ActivateTanks
} from './components/pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/generateReports" element={<GenerateReports />} />
        <Route path="/addRecords" element={<AddRecords />} />
        <Route path="/addRecords/:id" element={<AddRecords />} />
        <Route path="/activateTanks" element={<ActivateTanks />} />
      </Routes>
    </Router>
  )
}

export default App
