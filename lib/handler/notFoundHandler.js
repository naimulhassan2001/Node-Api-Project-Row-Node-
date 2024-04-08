const handler = {};

handler.notFoundHandler = (req, callback) => {
    console.log('Not found Handler');
    callback(404, { message: 'Not found Handler' });
};

module.exports = handler;
