
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var productSchema = new mongoose.Schema({
    itemID: { type: String, required: true,trim: true },
    name: { type: String, required: true },
    supName: String,
    country: String,
    purchasingPrice: { type: String, required: true },
    sellingPrice: { type: String, required: true },
    stock: { type: String, required: true },
    description: String,
    minStock: { type: String, required: true },
    status: { type: String, required: true },
    weight: String,
    insertDate: {type:Date,default: Date.now}

});

// Return model
module.exports = restful.model('Products', productSchema);
