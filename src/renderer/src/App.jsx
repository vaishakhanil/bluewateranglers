import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Dashboard, LoginPage, GenerateReports } from './components/pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/generateReports" element={<GenerateReports />} />
      </Routes>
    </Router>
  )
}

export default App
