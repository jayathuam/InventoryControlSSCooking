
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var productSchema = new mongoose.Schema({
    itemID: String,
    name: String,
    supName: String,
    country: String,
    purchasingPrice: Number,
    sellingPrice: Number,
    stock: Number,
    description: String,
    status: Boolean
});

// Return model
module.exports = restful.model('Products', productSchema);
