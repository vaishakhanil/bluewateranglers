import { useEffect, useState } from 'react'
import { Header } from '../organisms/Header/Header'
import { Button } from '../atoms'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchUserRole()
  }, [])

  const fetchUserRole = async () => {
    const role = await window.electron.auth.getRole()
    if (role === 'admin') setIsAdmin(true)
  }

  const handleLogout = () => {
    window.electron.auth.logout()
    window.location.reload()
  }

  return (
    <>
      <Header isAdmin={isAdmin} />
      <div>Dashboard Page</div>
      {isAdmin && <div>is admin</div>}
      {isAdmin ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Button onClick={() => navigate('/login')}>Switch to User</Button>
      )}
    </>
  )
}
