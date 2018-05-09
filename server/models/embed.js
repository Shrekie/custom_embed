var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uuid = require('uuid/v1');

//TODO: strict nested for embedUrl
var Embed = new Schema({
    profileID: String,
    _id: { type: String, required: true, default: uuid},
    embedUrl: {
        extractorType: String, 
        url: String,
        title: String,
    },
    configuration: { 
        type:[{
            autoplay: {type:Boolean, required: true}
        }],
        default:[{
            autoplay: true
        }],
        strict: 'throw',
        useNestedStrict: true,
        required:true
    }
});

module.exports = mongoose.model('Embed', Embed);