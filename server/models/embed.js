var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Embed = new Schema({
    profileID: String,
    embedUrl: [{extractorType: String, url: String}]
});

module.exports = mongoose.model('Embed', Embed);