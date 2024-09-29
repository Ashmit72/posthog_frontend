import { useNavigate } from 'react-router-dom'
import './Logout.css'
import Cookies from 'js-cookie'
const Logout = () => {
    const navigate=useNavigate()
    const handleLogout=()=>{
        Cookies.remove('task_token')
        navigate('/login');
    }
  return (
    <div onClick={handleLogout}  style={{background:'green',fontWeight:'bolder',margin:"2rem auto",color:"white",padding:'0.5rem',width:'100px',textAlign:'center', borderRadius:'3px',cursor:'pointer' }} >Logout</div>
  )
}

export default Logout