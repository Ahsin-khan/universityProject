import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ProductList = () => {
    const { itemId, projectName } = useParams();
    const [products, setProducts] = useState([]);
    console.warn({itemId});



    useEffect(() => {
        console.log("Component mounted"); // Debugging line
        getProducts();
    }, [])


    const getProducts = async () => {
        try {
            let response = await fetch(`http://localhost:5000/products/${itemId}`,{
                headers :{
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            if (response.ok) {
                let result = await response.json();
                setProducts(result);
            } else {
                console.error("Error fetching projects:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const deleteProduct = async (id) => {
        let result = await fetch(`http://localhost:5000/delProduct/${id}`, {
            method: "Delete",
            headers :{
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        if (result) {
            getProducts(); //to show updated list after deletion of record
            alert('Product Deleted');

        }
    }

    return (
        <div className="project-list" >
            <h3>{projectName}</h3>

            <ul>
                <li><b>S.No</b></li>
                <li><b>Name</b></li>
                <li><b>Product Details</b></li>
                <li><b>Update Product</b></li>
                <li><b>Delete Product</b></li>
            </ul>
            {
                products.length === 0 ? (
                    <p>No products added yet.</p>
                ) : (
                    products.map((item, index) => (
                        <ul key={item._id}>
                            <li>{index + 1}</li>
                            <li>{item.productName}</li>
                            <li>
                                <Link
                                    to={`/productDetails/${item._id}/${encodeURIComponent(
                                        item.projectName
                                    )}`}
                                >
                                    <button>Product Details</button>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={`/updateProduct/${item._id}/${encodeURIComponent(
                                        item.projectName
                                    )}`}
                                >
                                    <button>Update Product</button>
                                </Link>
                            </li>
                            <li>
                                <button onClick={() => deleteProduct(item._id)}>Delete</button>
                            </li>


                        </ul>
                    ))
                )
            }


        </div>
    )
}
export default ProductList;
