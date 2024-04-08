const environments = {};

environments.staging = {
    port: 5000,
    envName: 'staging',
    secretKey: 'Naimul Hassan',
};

environments.production = {
    port: 4000,
    envName: 'staging',
    secretKey: 'Naimul Hassan',
};

const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const environmenttoExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

module.exports = environmenttoExport;
