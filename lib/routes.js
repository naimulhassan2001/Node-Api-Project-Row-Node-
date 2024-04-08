const { samplehandler } = require('./handler/sampleHandler');
const { userHandler } = require('./handler/userHandler');
const { tokenHandler } = require('./handler/tokenHandler');

const routes = {
    sample: samplehandler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;
