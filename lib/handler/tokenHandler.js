const data = require('../data');
const utils = require('../helpers/utils');

const handler = {};

handler.tokenHandler = (req, callback) => {
    const accepteMethods = ['post', 'get', 'put', 'delete'];

    if (accepteMethods.indexOf(req.method) > -1) {
        handler.token[req.method](req, callback);
    } else {
        callback(405);
    }
};
handler.token = {};

handler.token.post = (req, callback) => {
    console.log(req.body);

    const number =
        typeof req.body.number === 'string' && req.body.number.trim().length === 11
            ? req.body.number
            : false;

    const password =
        typeof req.body.password === 'string' && req.body.password.trim().length > 0
            ? req.body.password
            : false;

    if (number && password) {
        data.read('users', number, (err, userData) => {
            if (!err && userData) {
                const hashPassword = utils.hash(password);
                if (hashPassword === utils.jsondecoder(userData).password) {
                    const tokenId = utils.createStr(20);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        number,
                        id: tokenId,
                        expires,
                    };

                    data.create('tokens', tokenId, tokenObject, (err1) => {
                        if (!err1) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { message: 'internal server error' });
                        }
                    });
                } else {
                    callback(404, { message: 'user not found ' });
                }
            } else {
                callback(404, { message: 'user not found ' });
            }
        });
    } else {
        callback(400, { message: 'bad request ' });
    }
};
handler.token.get = (req, callback) => {
    const token =        typeof req.header.token === 'string' && req.header.token.trim().length === 20
            ? req.header.token
            : false;

    if (token) {
        data.read('tokens', token, (err, tokenData) => {
            if (!err) {
                const tokenInfo = { ...utils.jsondecoder(tokenData) };

                callback(200, tokenInfo);
            } else {
                callback(404, { message: 'Requested user was not found' });
            }
        });
    } else {
        callback(404, { message: 'Requested user was not found' });
    }
};
handler.token.put = (req, callback) => {
    console.log(req.body);

    const id =        typeof req.body.id === 'string' && req.body.id.trim().length === 20 ? req.body.id : false;

    const extend = !!(typeof req.body.extend === 'boolean' && req.body.extend === true);

    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            const tokenObject = { ...utils.jsondecoder(tokenData) };
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                data.update('tokens', id, tokenObject, (err1) => {
                    if (!err1) {
                        callback(200, { message: 'update successfully ' });
                    } else {
                        callback(500, { message: 'internal server error' });
                    }
                });
            } else {
                callback(400, { message: 'token already expired' });
            }
        });
    } else {
        callback(400, { message: 'Invalid Phone Number' });
    }
};

handler.token.delete = (req, callback) => {
    const id =        typeof req.queryObject.id === 'string' && req.queryObject.id.trim().length === 20
            ? req.queryObject.id
            : false;
    if (id) {
        data.read('tokens', id, (err) => {
            if (!err) {
                data.delete('tokens', id, (err1) => {
                    if (!err1) {
                        callback(200, { message: 'token was successfully deleted' });
                    } else {
                        callback(500, { message: 'intanal server error' });
                    }
                });
            } else {
                callback(500, { message: 'intanal server error' });
            }
        });
    } else {
        callback(400, { message: 'bad request' });
    }
};

handler.token.verify = (id, number, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (
                utils.jsondecoder(tokenData).number === number &&
                utils.jsondecoder(tokenData).expires > Date.now()
            ) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
