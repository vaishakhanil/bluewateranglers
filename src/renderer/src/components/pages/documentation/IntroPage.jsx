import { useNavigate } from 'react-router-dom'
import { Button } from '../../atoms'
import { Header } from '../../organisms'

export const IntroDocsPage = () => {
  const navigate = useNavigate()
  return (
    <>
      <Header displayMenus={false}>
        <Button variant={'regular'} onClick={() => navigate('/')}>
          BACK TO DASHBOARD
        </Button>
      </Header>
    </>
  )
}
