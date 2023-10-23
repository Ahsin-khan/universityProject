import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav=()=>{
    const auth = localStorage.getItem("user")     //check if user is signed in or not already
    const navigate = useNavigate()
    
    const logout = ()=>{            //if logout link clicked, then clear localstorage and redirect to signup page
        localStorage.clear();
        navigate("/signup");
    }
    return(
        <div>
            { auth? 
            <ul className="nav-ul">
                <li><Link to = "/">Projects</Link></li>
                <li><Link to = "/add">Add Project</Link></li>
                <li><Link to = "/update">Update Project</Link></li>
                <li><Link to = "/profile">Profile</Link></li>
                {/* <li><Link to = "/addProduct/:itemId">Product Add</Link></li> */}
                <li><Link onClick={logout} to = "/signup">Logout ({JSON.parse(auth).name}) </Link> </li>
            </ul>    
                :
            <ul className="nav-ul nav-right">
                <li><Link to = "/signup">Signup</Link></li>                                               
                <li><Link to="/login">Login</Link></li>
            </ul> 
            }

        </div>
    )
}

export default Nav;