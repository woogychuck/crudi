'use strict';

var mongodb = require('mongodb'),
    q = require('q'),
    config = require('./config'),
    utilities = require('util'),
    connectionString,
    database = {},
    _db = null;


module.exports = database;


 database.getDb = function getDb() {
    var deferral = q.defer();
    if (_db === null) {
        if(config.db.connectionString){
            connectionString = config.db.connectionString;
        } else {
            if (config.db.user) {
                connectionString = utilities.format('mongodb://%s:%s@%s:%d/%s', config.db.user, encodeURIComponent(config.db.pass), config.db.host, config.db.port, config.db.database);
            } else {
                connectionString = utilities.format('mongodb://%s:%d/%s', config.db.host, config.db.port, config.db.database);
            }
        }

        mongodb.MongoClient.connect(connectionString, function connectMongoClient(error, db) {
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
