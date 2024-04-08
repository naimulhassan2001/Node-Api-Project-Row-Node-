const fs = require('fs');
const path = require('path');

const data = {};

data.basedir = path.join(__dirname, './../.data/');

data.create = (dir, file, dat, callback) => {
    fs.open(`${data.basedir + dir}/${file}.json`, 'wx', (err, fileDescrtiptor) => {
        if (!err && fileDescrtiptor) {
            const stringData = JSON.stringify(dat);
            fs.writeFile(fileDescrtiptor, stringData, (err1) => {
                if (!err1) {
                    fs.close(fileDescrtiptor, (err2) => {
                        if (!err2) {
                            callback(false);
                        } else {
                            callback('Error closing the new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('could not create new file , it may already exists');
        }
    });
};

data.read = (dir, file, callback) => {
    fs.readFile(`${data.basedir + dir}/${file}.json`, 'utf8', (err, dat) => {
        callback(err, dat);
    });
};

data.update = (dir, file, dat, callback) => {
    fs.open(`${data.basedir + dir}/${file}.json`, 'r+', (err, fileDescrtiptor) => {
        if (!err && fileDescrtiptor) {
            const stringData = JSON.stringify(dat);
            fs.ftruncate(fileDescrtiptor, (err1) => {
                if (!err1) {
                    fs.writeFile(fileDescrtiptor, stringData, (err2) => {
                        if (!err2) {
                            fs.close(fileDescrtiptor, (err3) => {
                                if (!err3) {
                                    callback(false);
                                } else {
                                    callback('error closing file');
                                }
                            });
                        } else {
                            callback('error writing to fille');
                        }
                    });
                } else {
                    callback('error trucatiion file ');
                }
            });
        } else {
            callback('jdfjdfj');
        }
    });
};

data.delete = (dir, file, callback) => {
    fs.unlink(`${data.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('error deletin file ');
        }
    });
};

module.exports = data;
