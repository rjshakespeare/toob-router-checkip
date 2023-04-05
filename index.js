const express = require('express');
const fs = require('fs');
const Client = require('./client');

const app = express();
const port = 80;

require('dotenv').config({
    path: fs.existsSync(`${__dirname}/.env`) ? `${__dirname}/.env` : `${__dirname}/default.env`
});

const client = new Client(process.env.ROUTER_IP, process.env.ROUTER_USERNAME, process.env.ROUTER_PASSWORD);

app.get('/', async (req, res) => {

    if (!await client.login()) {
        return res.status(401).send('Authentication failed.');
    }

    const external = await client.getExternalIp();
    res.send(external);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
})