const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    rating_data: { type: Number, required: true },
    user_name: { type: String, required: true },
    user_review: { type: String, required: true },
    product_id: { type: String, required: true }, // Add this field
    created: { type: Date, default: Date.now },
});

const User = mongoose.model('reviewUser', userSchema);

module.exports = User;
