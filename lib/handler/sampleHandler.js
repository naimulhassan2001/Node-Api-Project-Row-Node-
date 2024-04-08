const handler = {};

handler.samplehandler = (req, callback) => {
    console.log('sample');
    callback(200, { message: 'Sample Route' });
};

module.exports = handler;
