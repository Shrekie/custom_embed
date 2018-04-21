var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uuid = require('uuid/v1');

var Embed = new Schema({
    profileID: String,
    embedUrl: [{
        extractorType: String, 
        url: String,
        _id: { type: String, required: true, default: uuid}
    }]
});

module.exports = mongoose.model('Embed', Embed);