const express = require('express');
const fs = require('fs');
const Client = require('./client');
const dotenv = require('dotenv');
const morgan = require('morgan');
const axios = require('axios').default;

const app = express();
const port = 80;

dotenv.config({
    path: fs.existsSync(`${__dirname}/.env`) ? `${__dirname}/.env` : `${__dirname}/default.env`
});

if (process.env.DEBUG) {

    axios.interceptors.request.use(x => {
        console.log('axios debug request...');
        console.log(x);
        return x;
    });

    axios.interceptors.response.use(x => {
        console.log('axios debug response...');
        console.log(x);
        return x;
    });

    morgan.token('req-headers', function (req, res) {
        return JSON.stringify(req.headers);
    });

    app.use(morgan(':method :url :status :req-headers'));
}

const client = new Client(process.env.ROUTER_IP, process.env.ROUTER_USERNAME, process.env.ROUTER_PASSWORD);

app.get('/', async (req, res) => {

    if (!await client.login()) {
        return res.status(401).send('Authentication failed.');
    }

    const external = await client.getExternalIp();

    client.logout();

    res.send(external);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
})