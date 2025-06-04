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
import { IntroDocsPage } from './components/pages/documentation'

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

        <Route path="/documentation" element={<IntroDocsPage />} />
      </Routes>
    </Router>
  )
}

export default App
