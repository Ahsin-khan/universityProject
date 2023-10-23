import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate()


  useEffect(() => {
    console.log("Component mounted"); // Debugging line
    getProjects();
  }, [])

  const addNewProject = () => {
    navigate('/add');

  }

  const getProjects = async () => {
    try {
      // // Wait for the token to be set in localStorage
      // const token = await new Promise((resolve) => {
      //   const checkToken = () => {
      //     const storedToken = localStorage.getItem('token');
      //     if (storedToken) {
      //       resolve(storedToken);
      //     } else {
      //       setTimeout(checkToken, 100); // Check again in 100ms
      //     }
      //   };
      //   checkToken();
      // });
      const token2 = JSON.parse(localStorage.getItem('token'));
      console.log('Token:', token2);

      const userId = JSON.parse(localStorage.getItem('user'))._id;
      console.warn({ userId });


      let response = await fetch(`http://localhost:5000/projects/${userId}`, {
          headers: {
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`, // Use 'Bearer' before the token
          },
      });

      if (response.ok) {
        let result = await response.json();
        if (Array.isArray(result)) {
          setProjects(result);
        } else {
          console.error("Fetched data is not an array:", result);
        }
        //setProjects(result);
      } else {
        console.error("Error fetching projects:", response.statusText);
      }

    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const deleteProject = async (id) => {
    let result = await fetch(`http://localhost:5000/delProject/${id}`, {
      method: "Delete",
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    result = await result.json();
    if (result) {
      if (Array.isArray(result) && result.length === 0) {
        // If result is an empty array, there are no projects, update state accordingly
        setProjects([]);
      } else {
        getProjects(); // Fetch and display updated project list
      }
      alert('Project Deleted');

    }
  }


  return (
    <div className="project-list" >
      <h3>Here is Project list</h3>
      <ul>
        <li><b>S.No</b></li>
        <li><b>Name</b></li>
        <li><b>Add Product</b></li>
        <li><b>All Products</b></li>
        <li><b>Delete</b></li>
      </ul>
      {
        projects.length === 0 ? (
          <div>No Projects Found</div>
        ) : (
          projects.map((item, index) =>

            <ul key={item._id}>
              <li>{index + 1}</li>
              <li>{item.projectName}</li>
              <li>
                <Link to={`/addProduct/${item._id}/${encodeURIComponent(
                  item.projectName)}`}>
                  <button>Add Product</button>
                </Link>
              </li>
              <li>

                <Link to={`/productList/${item._id}/${encodeURIComponent(
                  item.projectName)}`}>
                  <button>Check All Products</button>
                </Link>
              </li>
              <li><button onClick={() => deleteProject(item._id)}>Delete</button></li>

            </ul>
          ))
      }
      <button type="button" className="appButton" onClick={addNewProject}>Create New Project</button>

    </div>
  )
}
export default ProjectList;
