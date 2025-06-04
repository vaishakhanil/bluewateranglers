import { useNavigate } from 'react-router-dom'
import {Button} from '../../atoms'

export const IntroDocsPage = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1>This is Documentation Test</h1>
            <Button varient={"primary"} onClick={() => navigate('/')}>Back</Button>
        </div>
    )
}