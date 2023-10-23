import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import UpdateProductMapComponent from './updateProductMap';


const UpdateProduct = () => {
    const { itemId, projectName } = useParams();

    const navigate = useNavigate()
    //  console.warn(itemId, projectName)
    const [product, setProduct] = useState([])

    const [dataToSave, setDataToSave] = useState(null);
    const [latitude, setSelectedLatitude] = useState(0);
    const [longitude, setSelectedLongitude] = useState(0);

    console.log({latitude});
    console.log({longitude});

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationSelected, setLocationSelected] = useState(false); // Step 1: Track location selection

    const [oldLatitude, setLatitude] = useState(null); //  Create state variable for latitude
    const [oldLongitude, setLongitude] = useState(null); // Create state variable for longitude

    // const [latitude, setLatitude] = useState(null); //  Create state variable for latitude
    // const [longitude, setLongitude] = useState(null); // Create state variable for longitude

    const [errorMessage, setErrorMessage] = useState('');

    const [showValues, setShowValues] = useState(false); // State to track if values should be shown
    const [productName, setProductName] = React.useState('');
    const [orientation, setOrientation] = React.useState('');
    const [angle, setAngle] = useState(0); // Initial value is 0
    const [numberOfPanels, setNumberOfPanels] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productType, setProductType] = useState('');
    const [company, setCompany] = useState(0);
    const [efficiency, setEfficiency] = useState(0);
    const [cells, setCells] = useState(0);
    const [area, setArea] = useState(0);
    const [powerPeak, setPowerPeak] = useState(0);


    // State variables to track unfilled fields
    const [productNameError, setProductNameError] = useState(false);
    const [selectedProductError, setSelectedProductError] = useState(false);
    const [orientationError, setOrientationError] = useState(false);
    const [angleError, setAngleError] = useState(false);
    const [numberOfPanelsError, setNumberOfPanelsError] = useState(false);
    const [updateError, setUpdateError] = useState(null);


    useEffect(() => {
        getProductsDetails()
    }, [])

    // useEffect(() => {
    //     console.log('Latitude:', latitude); // Use selectedLatitude here
    //     console.log('Longitude:', longitude); // Use selectedLongitude here
    // }, [latitude, longitude]); // Update dependencies
    


    const getProductsDetails = async () => {
        // console.warn(itemId);
        let result = await fetch(`http://localhost:5000/updateProduct/${itemId}`, {
            headers :{
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }); //`template engine` getting id through params.
        result = await result.json(); //converting readable string to json
        setProductName(result.productName);         //input fields prefill 
        setProductType(result.selectedProduct);       //input fields prefill
        setCompany(result.company);   //input fields prefill
        setArea(result.area);   //input fields prefill
        setPowerPeak(result.powerPeak);   //input fields prefill
        setCells(result.cells);   //input fields prefill
        setEfficiency(result.efficiency);   //input fields prefill
        setOrientation(result.orientation);       //input fields prefill
        setAngle(result.angle); //input fields prefill
        setNumberOfPanels(result.numberOfPanels);   //input fields prefill
        setLatitude(result.latitude);   //input fields prefill
        setLongitude(result.longitude);   //input fields prefill
        setProduct(result)

    }


    const handleOptionChange = (e) => {
        // Update selected option
        if (e.target.value !== '') {
            setSelectedProductError(false);
        }
        setSelectedProduct(e.target.value);
        setShowValues(true); // Set showValues to true when an option is selected

        // Calculate static values based on the selected option
        if (e.target.value === 'Q.Peak Duo XL-G10.3/BFG 475') {
            setCompany('Hanwha Q CELLS');
            setEfficiency('20.5%');
            setCells('6x18');
            setArea(2.315);
            setPowerPeak(357.6);
        } else if (e.target.value === 'JKM5255-72HL4-BDVP') {
            setCompany('Jinko Solar');
            setEfficiency('10.5%');
            setCells('2274x1134');
            setArea(3.235);
            setPowerPeak(530);
        } else if (e.target.value === '1IKO-A445-MAH54-MAH54MB') {
            setCompany('Mahiko');
            setEfficiency('15.5%');
            setCells('5x16');
            setArea(4.315);
            setPowerPeak(477.6);
        }
    };     //PRODUCT TYPE SELECTION END

    //ORIENTATION (North, south, east, west) SECTION START
    function handleSelectChange(event) {
        const newValue = event.target.value;
        setOrientation(newValue);
        if (newValue !== '') {
            setOrientationError(false);
        }
    }
    //ORIENTATION (North, south, east, west) SECTION END

    //NUMBER OF PANELS SECTION START
    const handleInputChange = (e) => {
        // Use parseInt to ensure the value is a number
        const newValue = parseInt(e.target.value, 10) || 0;
        if (newValue > 0) {
            setNumberOfPanels(newValue);
            setErrorMessage('');
        } else {
            setErrorMessage('Please enter a number greater than 0.');
        }

        if (newValue !== '') {
            setNumberOfPanelsError(false);
        }

    };
    //NUMBER OF PANELS SECTION END

    const handleLocationSelect = (lat, lng) => {
        setSelectedLocation({ lat, lng });
        setLocationSelected(true); // Step 2: Set locationSelected to true when location is selected
        setSelectedLatitude(lat); // Update selected latitude
        setSelectedLongitude(lng); // Update selected longitude

    };

    const update = async () => {
               // Check for unfilled fields and display error messages
               if (!productName) {
                setProductNameError(true);
            }
            if (!selectedProduct) {
                setSelectedProductError(true);
            }
            if (!orientation) {
                setOrientationError(true);
            }
            if (angle <= 0 || angle > 90) {
                setAngleError(true);
            }
            if (numberOfPanels <= 0) {
                setNumberOfPanelsError(true);
            }
    
            // // Check if all required fields are filled
            const isFormReady = !productNameError && !selectedProductError && !orientationError && !angleError
                && !numberOfPanelsError;
    
            // // If any field is unfilled, prevent form submission
            if (!isFormReady) {
                return;
            }
       
        // Gather all data, including user input and static values
        const newDataToSave = {
            itemId,
            projectName,
            productName,
            selectedProduct,
            company,
            area,
            powerPeak,
            cells,
            efficiency,
            orientation,
            angle,
            numberOfPanels,
            latitude, // Use preLatitude
            longitude // Use preLongitude

            // latitude: selectedLatitude, // Use preLatitude
            // longitude: selectedLongitude, // Use preLongitude
            // Add other user input fields here
        };
        
        console.log({latitude});
        console.log({longitude});

        // Set dataToSave state
        setDataToSave(newDataToSave);

        // Log the variable values to the console for testing
        // console.log('Variable Values:', newDataToSave);
    };

    useEffect(() => {
        if (dataToSave) {
            // Send the data to the server for database insertion
            fetch(`http://localhost:5000/product/${itemId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    productName,
                    selectedProduct,
                    company,
                    area,
                    powerPeak,
                    cells,
                    efficiency,
                    orientation,
                    angle,
                    numberOfPanels,
                    latitude,
                    longitude,
                }),
                headers: {
                    'Content-Type': 'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

                },
            })
                .then((response) => response.json())
                .then((data) => {
                    // Handle the response from the server
                    if (data.error) {
                        // Display validation errors or other errors
                        console.error('Error updating product:', data.error);
                        setUpdateError(data.error);
                        // You can set state to display the error message on the UI if needed
                    } else { 
                        // Product updated successfully, clear any previous error
                        setUpdateError(null); 
                        console.log('Data Updated:', data);
                        navigate('/');
                    }
                })
                .catch((error) => {
                    // Handle fetch errors
                    console.error('Error saving data:', error);
                    // You can set state to display the error message on the UI if needed
                });
        }
    }, [dataToSave]);



    return (
        <div>
            <h3>Project name: {projectName}</h3>
            <div className="product-list">
                <div className="product-list-container">
                    {/* Left side for displaying product details */}
                    <div className="product-details">
                        {/* Display other form fields when location is selected */}
                        <h4>Product Details</h4>

                        <input
                            type="text"
                            placeholder="Product Name"
                            className="inputBox"
                            value={productName}
                            onChange={(e) => {
                                setProductName(e.target.value);
                                setProductNameError(!e.target.value);
                            }}
                        />
                        {productNameError && (
                            <p style={{ color: 'red' }}>Product Name is required.</p>
                        )}

                        {/* SELECT PRODUCT TYPE HERE */}
                        <label>Product Type: </label>
                        <select onChange={handleOptionChange}>
                            <option></option>
                            <option value="Q.Peak Duo XL-G10.3/BFG 475">Q.Peak Duo XL-G10.3/BFG 475</option>
                            <option value="JKM5255-72HL4-BDVP">JKM5255-72HL4-BDVP</option>
                            <option value="1IKO-A445-MAH54-MAH54MB">1IKO-A445-MAH54-MAH54MB</option>
                        </select>

                        {selectedProductError && (
                            <p style={{ color: 'red' }}>Product Type is required.</p>
                        )}

                        {showValues && ( // Conditionally render the values if showValues is true
                            <>
                                <p>Product Type: {selectedProduct}</p>
                                <p>Company Name: {company}</p>
                                <p>Cells: {cells}</p>
                                <p>Efficiency: {efficiency}</p>
                                <p>Area: {area} m²</p>
                                <p>Power Peak: {powerPeak} W</p>
                            </>
                        )}

                        {/* SELECT ORIENTAITON HERE */}
                        <div>
                            <label>Orientation: </label>
                            <select value={orientation} onChange={handleSelectChange}>
                                <option value=""></option>
                                <option value="north">North</option>
                                <option value="south">South</option>
                                <option value="east">East</option>
                                <option value="west">West</option>
                            </select>
                            {orientationError && (
                                <p style={{ color: 'red' }}>Orientation is required.</p>
                            )}

                        </div>
                        {/* ANGLE SELECT SECTION */}
                        <div>
                            <label>Angle Tilt: </label>
                            <input
                                type="number"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                value={angle}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value, 10) || 0;
                                    if (newValue >= 0 && newValue <= 90) {
                                        setAngle(newValue);
                                    };
                                    setAngleError(!e.target.value);
                                }}
                            />
                            {angleError && (
                                <p style={{ color: 'red' }}>Angle must be between 1 and 90.</p>
                            )}
                        </div>

                        <div>
                            <label>Number of Panels: </label>
                            <input
                                type="number"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                value={numberOfPanels}
                                onChange={handleInputChange}
                            />
                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            {numberOfPanelsError && (
                                <p style={{ color: 'red' }}>Number of Panels must be greater than 0.</p>
                            )}

                        </div>

                        {/* Display error messages for other fields */}

                        <div>
                            <p>Latitude: {oldLatitude}</p>
                            <p>Longitude: {oldLongitude}</p>


                            {/* <p>Latitude: {latitude}</p>
                            <p>Longitude: {longitude}</p> */}
                        </div>

                        <button onClick={update}>Update</button>

                        {updateError && <p style={{ color: 'red' }}>{updateError}</p>}

                    </div>



                    {/* Right side for displaying the map */}
                    <div className="product-map">
                        <h4>Product Locations</h4>
                        {oldLatitude !== null && oldLongitude !== null && (
                            <UpdateProductMapComponent
                                latitude={oldLatitude}
                                longitude={oldLongitude}

                                // latitude={latitude}
                                // longitude={longitude}
                                onMapClick={handleLocationSelect}
                            />
                        )}
                    </div>


                </div>
            </div>
        </div>

    )
}

export default UpdateProduct;
