const data = require('../data');
const utils = require('../helpers/utils');
const tokenHandler = require('./tokenHandler');

const handler = {};

handler.userHandler = (req, callback) => {
    const accepteMethods = ['post', 'get', 'put', 'delete'];

    if (accepteMethods.indexOf(req.method) > -1) {
        handler.users[req.method](req, callback);
    } else {
        callback(405);
    }
};
handler.users = {};

handler.users.post = (req, callback) => {
    console.log(req.body);
    const firstName =
        typeof req.body.firstName === 'string' && req.body.firstName.trim().length > 0
            ? req.body.firstName
            : false;

    const lastName =        typeof req.body.lastName === 'string' && req.body.lastName.trim().length > 0
            ? req.body.lastName
            : false;

    const number =
        typeof req.body.number === 'string' && req.body.number.trim().length == 11
            ? req.body.number
            : false;

    const password =
        typeof req.body.password === 'string' && req.body.password.trim().length > 0
            ? req.body.password
            : false;

    if (firstName && lastName && number && password) {
        data.read('users', number, (err) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    number,
                    password: utils.hash(password),
                };
                data.create('users', number, userObject, (err1) => {
                    if (!err1) {
                        callback(200, {
                            message: 'user was created succeessfully',
                            data: userObject,
                        });
                    } else {
                        callback(500, { message: 'Internal server error' });
                    }
                });
            } else {
                callback(409, {
                    message: 'user already exists',
                });
            }
        });
    } else {
        callback(400, {
            error: 'you have a problem in your request',
        });
    }
};

handler.users.get = (req, callback) => {
    const number =
        typeof req.queryObject.number === 'string' && req.queryObject.number.trim().length == 11
            ? req.queryObject.number
            : false;

    const id =
        typeof req.header.id === 'string' && req.header.id.trim().length === 20
            ? req.header.id
            : false;

    if (number) {
        tokenHandler.token.verify(id, number, (tokenId) => {
            if (tokenId) {
                data.read('users', number, (err, userData) => {
                    if (!err) {
                        const userInfo = { ...utils.jsondecoder(userData) };
                        delete userInfo.password;
                        callback(200, userInfo);
                    } else {
                        callback(404, { message: 'Requested user was not found' });
                    }
                });
            } else {
                callback(401, { message: 'Authentiction failure' });
            }
        });
    } else {
        callback(404, { message: 'Requested user was not found' });
    }
};
handler.users.put = (req, callback) => {
    console.log(req.body);
    const firstName =        typeof req.body.firstName === 'string' && req.body.firstName.trim().length > 0
            ? req.body.firstName
            : false;

    const lastName =        typeof req.body.lastName === 'string' && req.body.lastName.trim().length > 0
            ? req.body.lastName
            : false;

    const number =
        typeof req.body.number === 'string' && req.body.number.trim().length == 11
            ? req.body.number
            : false;

    const password =
        typeof req.body.password === 'string' && req.body.password.trim().length > 0
            ? req.body.password
            : false;

    const id =
        typeof req.header.id === 'string' && req.header.id.trim().length === 20
            ? req.header.id
            : false;

    if (number) {
        tokenHandler.token.verify(id, number, (tokenId) => {
            if (tokenId) {
                if (firstName || lastName || password) {
                    data.read('users', number, (err, userData) => {
                        if (!err && userData) {
                            const userInfo = { ...utils.jsondecoder(userData) };
                            if (firstName) {
                                userInfo.firstName = firstName;
                            }

                            if (lastName) {
                                userInfo.lastName = lastName;
                            }

                            if (password) {
                                userInfo.password = password;
                            }

                            data.update('users', number, userInfo, (err2) => {
                                if (!err2) {
                                    callback(200, userInfo);
                                } else {
                                    callback(500, { message: 'internal server error' });
                                }
                            });
                        } else {
                            callback(400, { message: 'bad request ' });
                        }
                    });
                } else {
                    callback(400, { message: 'bad request ' });
                }
            } else {
                callback(401, { message: 'Authenication failure' });
            }
        });
    } else {
        callback(400, { message: 'Invalid Phone Number' });
    }
};

handler.users.delete = (req, callback) => {
    const number =
        typeof req.queryObject.number === 'string' && req.queryObject.number.trim().length === 11
            ? req.queryObject.number
            : false;
    const id =
        typeof req.header.id === 'string' && req.header.id.trim().length === 20
            ? req.header.id
            : false;

    if (number) {
        tokenHandler.token.verify(id, number, (tokenId) => {
            if (tokenId) {
                data.read('users', number, (err) => {
                    if (!err) {
                        data.delete('users', number, (err1) => {
                            if (!err1) {
                                callback(200, { message: 'user was successfully deleted' });
                            } else {
                                callback(500, { message: 'intanal server error' });
                            }
                        });
                    } else {
                        callback(500, { message: 'intanal server error' });
                    }
                });
            } else {
                callback(401, { message: 'Authentication failure' });
            }
        });
    } else {
        callback(400, { message: 'bad request' });
    }
};

module.exports = handler;
