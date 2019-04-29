const mongoose = require('mongoose');

const ShortenUrlSchema = mongoose.Schema({
    originalUrl: {type: String, unique: true, required: true},
    shortUrl: {type: String, unique: true, required: true},
    urlCode: {type: String, unique: true, required: true}
});
module.exports = mongoose.model('ShortenUrl', ShortenUrlSchema);

