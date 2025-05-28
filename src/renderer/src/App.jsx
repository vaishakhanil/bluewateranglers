import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import {
  Dashboard,
  LoginPage,
  GenerateReports,
  AddRecords,
  ActivateTanks,
  GenerateGraphs,
  EditTanks
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
        <Route path="/generateGraphs" element={<GenerateGraphs />} />
        <Route path="/editTanks" element={<EditTanks />} />
        <Route path="/editTanks/:id" element={<EditTanks />} />
      </Routes>
    </Router>
  )
}

export default App
