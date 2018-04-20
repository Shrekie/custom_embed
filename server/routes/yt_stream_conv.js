var express = require('express');
var router = express.Router();

const ytdl = require('youtube-dl');

router.post('/getStream', (req, res)=>{

    var link = req.body.YTURL;

    const ytdl = require('youtube-dl');

    ytdl.exec(link, ['-f best', '-s', '-g'], {}, function(err, output) {
        if (err) throw err;
        res.json(output[0]);
    });
    
});

module.exports = router;