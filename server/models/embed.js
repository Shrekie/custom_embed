var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uuid = require('uuid/v1');

var Embed = new Schema({
    profileID: String,
    _id: { type: String, required: true, default: uuid},
    embedUrl: {
        extractorType: String, 
        url: String,
        title: String
    }
});

module.exports = mongoose.model('Embed', Embed);