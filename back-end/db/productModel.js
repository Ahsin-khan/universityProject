const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
      itemId: {
        type: String,
        required: true,
      },

      userEmail : String,

      projectName: {
        type: String,
        required: true,
      },
      productName: {
        type: String,
        required: true, 
      },
      selectedProduct: {
        type: String,
        required: true,
      },
      
      company: String, // Make this field optional
      area: Number, // Make this field optional
      powerPeak: Number, // Make this field optional
      cells: String, // Make this field optional
      efficiency: String, // Make this field optional

      orientation: {
        type: String,
        required: true,
      },
      angle: {
        type: Number,
        required: true,
      },
      numberOfPanels: {
        type: Number,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: 'active', // default status when a new product is created
    },
    lastReportGenerated: {
        type: Date,
        default: Date.now, // default to the current date and time when a new product is created
    },
});

module.exports = mongoose.model("product", productSchema);
