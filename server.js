const express = require('express');
const shortid = require('shortid');
const mongoose = require('mongoose');
const app = express();
const ShortenUrl = require('./ShortenURL');
const bodyParser = require('body-parser');
const urlExists = require('url-exists');
const path = require('path');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, err => {
    if(err) console.log(err);
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.use('/static', express.static(__dirname + '/public'));


// GET
app.get('/api/shorturl/:urlCode', async(req, res) => {
    const urlCode = req.params.urlCode;
    try{
        const item = await ShortenUrl.findOne({urlCode: urlCode});
        res.redirect(item.originalUrl);
    }
    catch(error){
        res.json({error: "Code not found"})
    }
})

// POST
app.post('/api/shorturl/new', (req, res) => {
    const originalUrl = req.body.url;
    urlExists(originalUrl, async (error, exists)=>{
        if(!exists){
            res.json({error: "invalid URL"})
        }
        else{
            const tryItem = await ShortenUrl.findOne({originalUrl: originalUrl});
            if(tryItem){
                res.json({originalUrl: originalUrl, short_url: tryItem.shortUrl});
            }
            else {
                const urlCode = shortid.generate();
                const shortUrl = 
                    `http://localhost:${process.env.PORT || '8000'}/api/shorturl/${urlCode}`;
                const item = new ShortenUrl({
                    originalUrl,
                    shortUrl,
                    urlCode,
                    });
                const newItem = await item.save();
                res.json({originalUrl: originalUrl, short_url: newItem.shortUrl});   
            }
        }
    }); 
});

// All others routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, (req, res) => {
    console.log(`The server is listening on PORT:${PORT}`);
})



