/*
Init File, containing all main dependencies and server initalization
*/

require('dotenv').config();

var bodyParser = require('body-parser')

const express = require('express');
const app = express();

const ngrok = require('ngrok');


// parse application/json
app.use(bodyParser.json());

const router = require('./app/routes');

router(app);

/*
Launching server and Ngrok tunnel
*/
app.listen(process.env.PORT,()=>{
    console.log(`Application listening on ${process.env.PORT}`);
    (async function(){
        const ngrok_endpoint = await ngrok.connect(process.env.PORT);
        console.log(`localhost:${process.env.PORT} available at: ${ngrok_endpoint}`);
    })()
})

