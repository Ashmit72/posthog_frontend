import { useEffect, useState } from "react"
import Logout from "../Logout/Logout"
import "./Navbar.css"
import Cookies from "js-cookie"
import { Link } from "react-router-dom"
import { LiaToggleOffSolid } from "react-icons/lia";
import { useDispatch,useSelector } from "react-redux"
import { LiaToggleOnSolid } from "react-icons/lia";
import { AppDispatch, RootState } from "../../../store/store"
import { updateView } from "../../../slices/experimentSlice"

const Navbar = () => {

    const dispatch:AppDispatch=useDispatch()
    const experiment=useSelector((state:RootState)=>state.experiment)

    interface User {
        id: number;
        name: string;
        profilePicture: string;
        password:string
      }
      
    const [users,setUsers]=useState<User[]>([])
    const token=JSON.stringify(Cookies.get("task_token"))

    function parseJwt (token:string) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }    

    async function getUsers(){
        try {
            const id=parseJwt(token).userId
            const response=await fetch(`http://localhost:8080/users/${id}`)
            if (!response.ok) {
                console.log('Something Went Wrong!');
            }
            const data=await response.json()
            setUsers(data.user)
            
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>{
       getUsers()
    },[])

  return (
    <nav>
    <div className="nav-container" >
        <Link to="/" >
        TodoApp
        </Link>
        <div className="nav-items" >

        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}> <p style={{fontWeight:'bold'}} >Experiment</p> {experiment?<LiaToggleOnSolid onClick={()=>dispatch(updateView())} style={{fontSize:'36px',color:'green',cursor:'pointer'}} />:<LiaToggleOffSolid onClick={()=>dispatch(updateView())} style={{fontSize:'36px',color:'green',cursor:'pointer'}} />}</div>
        

            <span style={{padding:0,background:'transparent',boxShadow:'none',borderLeft:'none'}} className="nav-list" >
                <Link to="/settings" >
                Settings
                </Link>
            </span>
                
            <span style={{padding:0,background:'transparent',boxShadow:'none',borderLeft:'none'}} className="nav-list" >
                <Logout/>
            </span>

           <div style={{height:'40px',width:'auto',borderRadius:'100%'}} >
            {
                users.map((item)=>(
                    item.profilePicture!==`http://localhost:8080/null`?(<img key={item.id} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'100%',cursor:'pointer'}} src={item.profilePicture} alt="user" />):<img key={item.id} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'100%',cursor:'pointer'}} src='/profile.jpg' alt="user" />
                ))
            }
           </div>
        </div>
    </div>
    </nav>
  )
}

export default Navbar