const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: String,
    userId: String,
});

module.exports = mongoose.model("projects", projectSchema);
