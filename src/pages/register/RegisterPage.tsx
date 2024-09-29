import "./Register.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Onboarding from "../../components/Onboarding/Register/OnboardingRegister";

const RegisterPage = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fetchedId,setFetchedId]=useState<null|number>(null)
  const [profilePicture,setProfilePicture]=useState<File | null>(null)
  const [showPassword,setShowPassword]=useState<boolean>(false)
  const [showOnboarding,setShowOnboarding]=useState<boolean>(false)
  const navigate=useNavigate()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    console.log('Function Running');
    navigate('/login'); 
  };

  const handleRegister =async (e:FormEvent) => {
    e.preventDefault();
    const formData=new FormData()
    formData.append('username',username)
    formData.append('email',email)
    formData.append('password',password)
    if (profilePicture) {
      formData.append("file", profilePicture);
    }
    
    try {
      const response=await fetch('/api/users',{
        method:'POST',
        body:formData
      })
      if (response.ok) {
        toast.success("User Registered Successfully")
        const data=await response.json()
        setFetchedId(data.users.insertedId)
        setShowOnboarding(true)
        // navigate('/login')
      }
      else{
        toast.error("Something Went Wrong!")
      }
    } catch (error:any) {
      console.log(error.message); 
    }
  };

  return (
    
      showOnboarding?(<Onboarding fetchedId={fetchedId} onComplete={handleOnboardingComplete} showOnboarding={showOnboarding} />):(
        <>
        <Toaster position="top-right" reverseOrder={false} />
        <div className="register-container">
        <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
        <div className="input-group">
        <label htmlFor="username">Fullname</label>
        <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        />
        </div>
        <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />
        </div>
        <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
        type={`${showPassword?'text':'password'}`}
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
        {showPassword?<FaEyeSlash onClick={()=>setShowPassword(!showPassword)} className="icon" />:<FaEye onClick={()=>setShowPassword(!showPassword)} className="icon" /> }
        </div>
        <div className="input-group">
        <label id="image-label" htmlFor="image-file">Upload image</label>
        <input type="file"
        name="image-file"
        id="image-file"
        onChange={handleFileChange}
        accept ="image/x-png, image/jpeg"
        />
        </div>
        <button type="submit" className="register-button">Register</button>
        </form>
        <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
        </p>
        </div>
        </div>
        </>
      )
      
  );
};

export default RegisterPage;
