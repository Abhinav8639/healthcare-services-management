const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
        maxLength: [100, 'Service name must be at most 100 characters long'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxLength: [500, 'Description must be at most 500 characters long'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a non-negative number'],
        validate: {
            validator: function(v) {
                return v !== null && v !== undefined;
            },
            message: 'Price must be a number'
        }
    }
});
const Service = mongoose.model("Chat", ServiceSchema);

module.exports = Service;
