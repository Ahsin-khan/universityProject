import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SingleMarkerMapComponent from './singleMarkerMap';

const ProductDetails = () => {
    const { itemId, projectName } = useParams();
    const [products, setProducts] = useState([]);
    console.warn({ itemId });
    useEffect(() => {
        console.log("Component mounted"); // Debugging line
        getProductDetails();
    }, [])

    const getProductDetails = async () => {

        try {
            let response = await fetch(`http://localhost:5000/productDetails/${itemId}`, {
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
    //    console.warn("projects", projects);

    return (
        <div className="product-list">
            <h3>Product Details</h3>
            <div className="product-list-container">
                {/* Left side for displaying product details */}
                <div className="product-details">
                    {products.map((item, index) => (
                        <div key={item._id} className="product-item">
                            <h4>Product {index + 1}</h4>
                            <p><strong>Name:</strong> {item.productName}</p>
                            <p><strong>Selected Product:</strong> {item.selectedProduct}</p>
                            <p><strong>Company:</strong> {item.company}</p>
                            <p><strong>Area:</strong> {item.area}</p>
                            <p><strong>Power Peak:</strong> {item.powerPeak}</p>
                            <p><strong>Cells:</strong> {item.cells}</p>
                            <p><strong>Efficiency:</strong> {item.efficiency}</p>
                            <p><strong>Orientation:</strong> {item.orientation}</p>
                            <p><strong>Angle:</strong> {item.angle}</p>
                            <p><strong>Number of Panels:</strong> {item.numberOfPanels}</p>
                            <p><strong>Latitude:</strong> {item.latitude}</p>
                            <p><strong>Longitude:</strong> {item.longitude}</p>
                            {/* Add other product details here */}
                        </div>
                    ))}
                </div>

                {/* Right side for displaying the map */}
                <div className="product-map">
                    <h4>Product Locations</h4>
                    <SingleMarkerMapComponent
                        latitude={products[0]?.latitude} // Use the first product's latitude
                        longitude={products[0]?.longitude} // Use the first product's longitude
                    />               
                </div>
            </div>
        </div>
    );
}
export default ProductDetails;
