'use strict';

var mongodb = require('mongodb'),
    q = require('q'),
    config = require('./config'),
    utilities = require('util'),
    connectionString,
    database = {},
    _db = null,
    dbOptions = {
        db:{
            // bufferMaxEntries is the Max Number of operations buffered while waiting for server reconnect.
            // Set to zero so that if connection is interrupted db requests will error out until successful reconnect.
            // *note: autoReconnect is set to true by default so MongoDB Driver will attempt to reconnect automatically.
            bufferMaxEntries: 0
        }
    };


module.exports = database;


if(process.env.MONGO_URI){
    connectionString = process.env.MONGO_URI;
} else {
    if (config.db.user) {
        connectionString = utilities.format('mongodb://%s:%s@%s:%d/%s', config.db.user, config.db.pass, config.db.host, config.db.port, config.db.database);
    } else {
        connectionString = utilities.format('mongodb://%s:%d/%s', config.db.host, config.db.port, config.db.database);
    }
}

 database.getDb = function getDb() {

    var deferral = q.defer();
    if (_db === null) {
        mongodb.MongoClient.connect(connectionString, dbOptions, function connectMongoClient(error, db) {
            _db = db;
            if (error) {
                console.log('DB CONNECTION ERROR');
                console.log('USING CONNECTION STRING: ' + connectionString);
                console.log(error);
                return deferral.reject(error);
            } else {
                return deferral.resolve(_db);
            }
        });
    } else {
        deferral.resolve(_db);
    }
    return deferral.promise;
};
