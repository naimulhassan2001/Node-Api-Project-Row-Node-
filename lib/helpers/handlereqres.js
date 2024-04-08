const url = require('url');
const { StringDecoder } = require('string_decoder');
const { notFoundHandler } = require('../handler/notFoundHandler');
const routes = require('../routes');
const { jsondecoder } = require('./utils');

const handler = {};

handler.handlerReqRes = (req, res) => {
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;

    const trimmPath = parseUrl.pathname.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryObject = parseUrl.query;
    const header = req.headers;
    const decoder = new StringDecoder('utf-8');
    let body = '';
    const reqPpt = {
        parseUrl,
        trimmPath,
        path,
        method,
        header,
        queryObject,
    };

    const chosenHandler = routes[trimmPath] ? routes[trimmPath] : notFoundHandler;
    req.on('data', (buffer) => {
        body += decoder.write(buffer);
    });
    req.on('end', () => {
        body += decoder.end();
        reqPpt.body = jsondecoder(body);
        chosenHandler(reqPpt, (sCode, pload) => {
            let statusCode = sCode;
            let payload = pload;
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);
            res.setHeader('content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handler;
