import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
//this is a hook navigator use to redirect pages

const Signup = ()=>{

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    useEffect(()=>{
        const auth = localStorage.getItem("user");
        if(auth){
            navigate("/")
        }
    })

    const collectData = async ()=>{
        console.warn(name, email, password)
        let result = await fetch('http://localhost:5000/register',{
            method:'post',
            body: JSON.stringify({name, email, password}),
            headers: {
                'Content-Type':'application/json'
            },
        });
        
        result = await result.json()
        console.warn(result);
        localStorage.setItem("user", JSON.stringify(result.result));
        localStorage.setItem("token", JSON.stringify(result.auth));

        if(result){
            navigate('/'); //means redirect to homepage
        }

    }

    return(
        <div className="register">
            <h1>Register</h1>
            <input type="text" placeholder="Enter Name" className="inputBox" value={name}
             onChange={(e)=>setName(e.target.value)}></input>

            <input type="text" placeholder="Enter Email" className="inputBox" value={email}
             onChange={(e)=>setEmail(e.target.value)}></input>

            <input type="password" placeholder="Enter Password" className="inputBox" value={password}
             onChange={(e)=>setPassword(e.target.value)}></input>

            <button type="button" className="appButton" onClick={collectData}>Signup</button>
        </div>
    )
}

export default Signup;