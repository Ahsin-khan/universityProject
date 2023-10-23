const express = require('express');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const axios = require('axios');
const async = require('async');
require("./db/config");
const cors = require('cors');
const app = express();
const User = require('./db/userModel');
const Project = require('./db/projectModel');
const Product = require('./db/productModel')
const Jwt = require("jsonwebtoken")
const jwtKey = "solar";

app.use(express.json());
app.use(cors());

//Sign-up
app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await (user.save());
    result = result.toObject()
    delete result.password;

    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            resp.send({ result: "something went wrong" });
        }
        resp.send({ result, auth: token });
    })

});

//Login
app.post("/login", async (req, resp) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send({ result: "something went wrong" });
                }
                resp.send({ user, auth: token });
            })
        } else {
            resp.send({ result: 'No user found' })
        }
    } else {
        resp.send({ result: "No user found" });
    }
})

//Add Project
app.post("/add-project", verifyToken, async (req, resp) => {
    let project = new Project(req.body);
    let result = await project.save();
    resp.send(result);
})

// Get Projects List
app.get("/projects/:id", verifyToken, async (req, resp) => {
    const userId = req.params.id;
    console.log(userId);
    try {
        let result = await Project.find({ userId });
        console.log(result);
        if (result.length > 0) {
            resp.send(result);
        } else {
            resp.send({ result: "No Projects Found" });
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        resp.status(500).json({ error: "Internal server error" });
    }
});


//Add Products
app.post('/addProduct', verifyToken, async (req, res) => {
    const requiredFields = ['itemId', 'projectName', 'productName', 'selectedProduct', 'orientation',
        'angle', 'numberOfPanels', 'latitude', 'longitude'];

    console.log(req.body);
    // Check if all required fields are present in the request body
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    try {
        const product = new Product(req.body);
        const result = await product.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error saving data' });
    }
});


// Get Product List
app.get("/products/:id", verifyToken, async (req, resp) => {
    const projectId = req.params.id;
    const itemId = projectId;
    console.log(itemId);
    try {
        let result = await Product.find({ itemId });
        console.log(result);
        if (result.length > 0) {
            resp.send(result);
        } else {
            console.log("No products found")
            resp.send([]); //to avoid "products.map is not a function error"
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        resp.status(500).json({ error: "Internal server error" });
    }
});

// Get Product Details
app.get("/productDetails/:id", verifyToken, async (req, resp) => {
    const _id = req.params.id;
    console.log(_id);
    try {
        let result = await Product.find({ _id });
        console.log(result);
        if (result.length > 0) {
            resp.send(result);
        } else {
            resp.send({ result: "No Product Found" });
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        resp.status(500).json({ error: "Internal server error" });
    }
});


//delete Project
app.delete("/delProject/:id", verifyToken, async (req, resp) => {
    const projectId = req.params.id;
    console.log(projectId);

    try {
        // Find and delete associated products
        await Product.deleteMany({ itemId: projectId });

        // Now, delete the project
        const projectResult = await Project.deleteOne({ _id: projectId });
        // resp.send(projectResult);
        if (projectResult.length > 0) {
            resp.send(projectResult);
        } else {
            console.log("No products found")
            resp.send([]); //to avoid "products.map is not a function error"
        }




    } catch (error) {
        console.error("Error deleting project and associated products:", error);
        resp.status(500).json({ error: "Internal server error" });
    }
});


//delete Product
app.delete("/delProduct/:id", verifyToken, async (req, resp) => {
    const _id = req.params.id;
    console.log(_id);
    try {
        const result = await Product.deleteOne({ _id })
        resp.send(result);
    } catch (error) {
        console.error("Error fetching projects:", error);
        resp.status(500).json({ error: "Internal server error" });
    }
});

//getting single product for update
app.get("/updateProduct/:id", verifyToken, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    console.log({ result });
    if (result) {
        resp.send(result);
    } else {
        resp.send({ result: "No record found" });

    }
});


//UPDATE PRODUCT
// UPDATE PRODUCT
app.put("/product/:id", verifyToken, async (req, resp) => {
    const productId = req.params.id;
    const updatedProductData = req.body;

    // Check if any required field is empty
    if (
        !updatedProductData.productName ||
        !updatedProductData.selectedProduct ||
        !updatedProductData.orientation ||
        !updatedProductData.angle ||
        !updatedProductData.numberOfPanels
    ) {
        // Send a validation error response
        resp.status(400).json({ error: "All fields must be filled." });
        return;
    }

    try {
        const result = await Product.updateOne(
            { _id: productId },
            { $set: updatedProductData }
        );

        if (result.nModified === 0) {
            // No document was modified, indicating that the product ID doesn't exist
            resp.status(404).json({ error: "Product not found." });
        } else {
            // Product updated successfully
            resp.json({ message: "Product updated successfully." });
        }
    } catch (error) {
        // Handle any other errors that may occur during the update
        console.error("Error updating product:", error);
        resp.status(500).json({ error: "Internal server error." });
    }
});


//it will be called in search method we can see
function verifyToken(req, resp, next) {
    //next means if everything goes well then proceed (next)    

    let token = req.headers['authorization'];
    // taking token from header in postman
    if (token) {                         //if we have token  
        token = token.split(' ')[1];
        //split token from bearer keyword and take the value on 1st index which is token
        console.warn('middleware called in if', token);
        //showing token in console 
        Jwt.verify(token, jwtKey, (error, valid) => {
            //verifying token and key described above
            if (error) {                              //if any error
                resp.status(401).send({ result: 'Please add valid token' })
                //print this
            } else {                                           //else        
                next(); //proceed next i.e keep working in search api    
            }
        })
    } else {
        resp.status(403).send({ result: 'please add token with headers' });
    }
}

//schedular for report generation
// cron.schedule('0 0 */30 * *', async () => {
cron.schedule('*/1 * * * *', async () => {
    const products = await Product.find({
        status: 'active', // Assuming 'active' is the status for active products
        lastReportGenerated: { $lt: new Date(Date.now() - 3 * 60 * 1000) }, // Products not reported in the last 30 days
    });
    products.forEach(async (product) => {
        const electricityProduced = await calculateElectricityProduced(product);
        await sendReportByEmail(product, electricityProduced);
        await updateProductStatus(product);
    });
});

async function calculateElectricityProduced(product) {

    const efficiency = parseFloat(product.efficiency.replace('%', '')) / 100;
    // Adjust efficiency based on orientation
    if (product.orientation === 'South') {
        efficiency *= 1.1; // Increase efficiency by 10% for South-facing panels
    } else if (product.orientation === 'North') {
        efficiency *= 0.9; // Decrease efficiency by 10% for North-facing panels
    } else if (product.orientation === 'East') {
        efficiency *= 0.95; // Decrease efficiency by 5% for East-facing panels
    } else if (product.orientation === 'West') {
        efficiency *= 0.95; // Decrease efficiency by 5% for West-facing panels
    }


    // Assuming the angle is given in degrees and not radians
    const radians = (product.angle * Math.PI) / 180;
    //    const apiKey = 'ff362e3a4bfb31ebe934b49945b7609e';
    const apiKey = '9152762d93274a867df8f94b69691576';
    const latitude = product.latitude /* Latitude of the location */;
    const longitude = product.longitude/* Longitude of the location */;
    try {
        console.log("Before API call");
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly&appid=${apiKey}`);
        //const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=9152762d93274a867df8f94b69691576`);
        //  console.log(weatherResponse);
        //   const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/onecall`, {
        //     params: {
        //         lat: latitude,
        //         lon: longitude,
        //         exclude: 'current,minutely,hourly', 
        //         appid: apiKey,
        //     },
        // });
        console.log("after API call");
        //    console.log(weatherResponse.data);
        const sunriseTimestamp = weatherResponse.data.sys.sunrise;
        const sunsetTimestamp = weatherResponse.data.sys.sunset;

        const daylightDurationInSeconds = sunsetTimestamp - sunriseTimestamp;
        const dailySunlightHours = daylightDurationInSeconds / 3600; // Convert seconds to hours
        console.log("Daily Sunlight Hours:", dailySunlightHours);

        // const dailySunlightHours = (weatherResponse.data.sunriseTimestamp - weatherResponse.data.daily[0].sunrise) / 3600; // Convert seconds to hours
        //  console.log(dailySunlightHours);

        // Basic power calculation formula (Area * Power Peak * Efficiency * Sin(Angle) * Number of Panels)
        const electricityProduced = product.area * product.powerPeak * efficiency * Math.sin(radians) * product.numberOfPanels * dailySunlightHours;
        console.log(electricityProduced);
        return electricityProduced;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Handle error, set electricityProduced to a default value, or throw an error
        return 0;
        //throw error; // Returning 0 for electricityProduced in case of error
    }

}

async function sendReportByEmail(product, electricityProduced) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'farmank32400@gmail.com',
            pass: 'bjkm vhou ehpt qwwr'
        }
    });

    const mailOptions = {
        from: 'farmank32400@gmail.com',
        to: product.userEmail,
        subject: 'Your Photovoltaic System Report',
        text: `Electricity Produced: ${electricityProduced} kWh`
    };

    await transporter.sendMail(mailOptions);
}

async function updateProductStatus(product) {
    await Product.updateOne({ _id: product._id }, { status: 'read-only' });
}



app.listen(5000);