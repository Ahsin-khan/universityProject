import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from './MapComponent';

const InsertDataModal = () => {
    const { itemId, projectName } = useParams();
    const navigate = useNavigate()
    console.warn(itemId, projectName)

    // Retrieve the "user" object from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user.email;

    const [dataToSave, setDataToSave] = useState(null);

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationSelected, setLocationSelected] = useState(false); // Step 1: Track location selection
    const [latitude, setLatitude] = useState(0); //  Create state variable for latitude
    const [longitude, setLongitude] = useState(0); // Create state variable for longitude

    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = React.useState(false);

    const [showValues, setShowValues] = useState(false); // State to track if values should be shown
    const [productName, setProductName] = React.useState('');
    const [orientation, setOrientation] = React.useState('');
    const [angle, setAngle] = useState(0); // Initial value is 0
    const [numberOfPanels, setNumberOfPanels] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState('');
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


    const handleLocationSelect = (lat, lng) => {
        setSelectedLocation({ lat, lng });
        setLocationSelected(true); // Step 2: Set locationSelected to true when location is selected

        // Add a CSS class to shift the map container to the right
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.classList.add('shifted');
        }
        setLatitude(lat); // Step 2: Update latitude state variable
        setLongitude(lng); // Step 2: Update longitude state variable


    };

    //  console.warn(productName);

    //address bar k through access na ho... THIS LINE IS ERROR PRONE, TEST IT LATER
    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            console.warn("1")
            //navigate("/");
        }
    })

    //PRODUCT TYPE SELECTION START

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


    // Function to handle arrow key events
    const handleArrowKeys = useCallback((e) => {
        if (e.key === 'ArrowUp' && angle < 90) {
            setAngle(angle + 1);
            //      console.warn('Selected value:', angle + 1);
        } else if (e.key === 'ArrowDown' && angle > 0) {
            setAngle(angle - 1);
            //      console.warn('Selected value:', angle - 1);
        }
    }, [angle]);

    // Attach the arrow key event listener when the component mounts
    useEffect(() => {
        window.addEventListener('keydown', handleArrowKeys);
        return () => {
            // Remove the event listener when the component unmounts
            window.removeEventListener('keydown', handleArrowKeys);
        };
    }, [handleArrowKeys]);



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


    const handleSubmit = () => {
        console.log('Save button clicked'); // Add this line for debugging


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
            itemId,userEmail ,projectName, productName, selectedProduct, company, area, powerPeak, cells, efficiency, orientation, angle,
            numberOfPanels, latitude, longitude,
            // Add other user input fields here
        };

        // Set dataToSave state
        setDataToSave(newDataToSave);

        // Log the variable values to the console for testing
        console.log('Variable Values:', newDataToSave);

    };

    useEffect(() => {
        if (dataToSave) {
            // Send the data to the server for database insertion
            fetch('http://localhost:5000/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

                },
                body: JSON.stringify(dataToSave),
            })
                .then((response) => response.json())
                .then((data) => {

                    // Handle the response from the server, e.g., display success message
                    console.log('Data saved:', data);
                    // Conditionally navigate to the home page if there are no errors
                    if (!data.error) {
                        navigate('/');
                    }
                })
                .catch((error) => {
                    // Handle errors, e.g., display error message
                    console.error('Error saving data:', error);
                });
        }
    }, [dataToSave]);



    return (
        <div className="insert-data-container">
            <div>
                <h3>Project name: {projectName}</h3>
                {/* Display other form fields when location is selected */}
                {!locationSelected ? (
                    <MapComponent onLocationSelect={handleLocationSelect} />
                ) : (
                    <>

                        <div className='left-side'>
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

                            {/* Rest of your form inputs */}
                            <label>Product Type: </label>
                            <select onChange={handleOptionChange}>
                                <option value=""></option>
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
                                        }
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

                            {selectedLocation && (
                                <div>
                                    <p>Selected Location:</p>
                                    <p>Latitude: {selectedLocation.lat}</p>
                                    <p>Longitude: {selectedLocation.lng}</p>
                                </div>
                            )}
                            <button onClick={handleSubmit}>Save</button>
                        </div>
                    </>
                )}
            </div>

            <div className="right-side">
                {/* Display the map here */}
                {locationSelected && (
                    <MapComponent onLocationSelect={handleLocationSelect} />
                )}
            </div>
        </div>
    );

};

export default InsertDataModal;
