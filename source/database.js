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

connectionString = utilities.format('mongodb://%s:%d/%s', config.db.host, config.db.port, config.db.database);

 database.getDb = function getDb() {

    var deferral = q.defer();
    if (_db === null) {
        console.log(connectionString);
        mongodb.MongoClient.connect(connectionString, dbOptions, function connectMongoClient(error, db) {
            _db = db;
            if (error) {
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
