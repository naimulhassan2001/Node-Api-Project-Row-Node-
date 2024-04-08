const crypto = require('crypto');
const environmenttoExport = require('./environments');

const utils = {};
utils.jsondecoder = (jsonString) => {
    let outPut;
    try {
        outPut = JSON.parse(jsonString);
    } catch {
        outPut = {};
    }

    return outPut;
};

utils.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto
            .createHmac('sha256', environmenttoExport.secretKey)
            .update('I love cupcakes')
            .digest('hex');
        return hash;
    }
    return false;
};

utils.createStr = (str) => {
    let length = str;
    length = typeof str === 'number' && str > 0 ? str : false;
    if (length) {
        const possiblecharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let outPut = '';
        for (let i = 0; i < length; i += 1) {
            const randomCharacter = possiblecharacters.charAt(
                Math.floor(Math.random() * possiblecharacters.length),
            );
            outPut += randomCharacter;
        }

        return outPut;
    }
    return false;
};

module.exports = utils;
