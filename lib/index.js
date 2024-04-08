const http = require('http');

const { handlerReqRes } = require('./helpers/handlereqres');
const environmenttoExport = require('./helpers/environments');

const app = {};

app.createServer = () => {
    const server = http.createServer(handlerReqRes);

    server.listen(environmenttoExport.port, () => {
        console.log(`server listing ${environmenttoExport.port}`);
    });
};

app.createServer();
