import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";


const Login = ()=>{

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate()

    //address bar k through access na ho
    useEffect(()=>{
        const auth = localStorage.getItem("user");
        if(auth){
            navigate("/");
        }
    })

    
    const handleLogin = async ()=>{
        console.warn(email, password)
    
        let result = await fetch('http://localhost:5000/login',{
            method:'post',
            body: JSON.stringify({email, password}),
            headers: {
                'Content-Type':'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
        });
        result = await result.json()
        console.warn(result);
        if(result.auth){
            localStorage.setItem("user",JSON.stringify(result.user))
            localStorage.setItem("token",JSON.stringify(result.auth))
            navigate('/');
        }else{
            alert('Please Enter Correct Details');
        }

    }
    return(
        <div className="register">
            <h1>Login Page</h1>
            <input type="text" placeholder="Enter Email" className="inputBox"
                onChange={(e)=>setEmail(e.target.value)} value={email}/>
            
            <input type="password" placeholder="Enter Password" className="inputBox"
                onChange={(e)=>setPassword(e.target.value)} value={password}/>

            <button type="button" className="appButton" onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login
