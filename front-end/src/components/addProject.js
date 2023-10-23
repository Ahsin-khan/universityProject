import React from "react";
import { useNavigate } from "react-router-dom";


const AddProject = ()=>{
    const [projectName, setName] = React.useState('');
    const [error, setError] = React.useState(false);
    const navigate = useNavigate()

    const addProject = async()=>{
        if(!projectName){
            setError(true)
            return false;
        }

        console.warn(projectName);
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        
        let result = await fetch('http://localhost:5000/add-project',{
        method: 'post',
        body: JSON.stringify({projectName, userId}),
        headers:{
            "Content-Type":"application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
        });
        result = await result.json()
        console.warn(result);    
        navigate('/');

    }
    return(
        <div className="product">
            <h1>Add Project</h1>
     
            <input type="text" placeholder="Enter Project Name" className="inputBox" 
            value={projectName} onChange={(e)=>setName(e.target.value)}
            />
            {error && !projectName && <span className="invalid-input">Enter Project Name</span>}
        
            <button onClick={addProject} className="appButton">Add Project</button>
        </div>
    )
}

export default AddProject;
