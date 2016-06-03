'use strict';

var db = require('./database'),
    q = require('q'),
    ObjectId = require('mongodb').ObjectID;

module.exports = GeneralRepository;

function buildObjectIdFromString(id){
    if(id instanceof ObjectId){
        return id;
    }
    var objectId;
    try {
        objectId = new ObjectId(id);
    } catch(e){
        throw new Error("BAD REQUEST");
    }
    return objectId;
}

function prepQuery(query){
    for(var queryTerm in query){
        if(queryTerm.indexOf('_id') >= 0){
            query[queryTerm] = buildObjectIdFromString(query[queryTerm]);
        }
    }
    return query;
}

function GeneralRepository(entityName){
    var entityName = entityName;

    this.getOne = function getOne(query){
        query = prepQuery(query) || {};
        return db.getDb().then(function getItem(db){
            return db.collection(entityName).findOne(query);
        });
    };

    this.getAll = function getAll(query){
        query = prepQuery(query) || {};
        return db.getDb().then(function getItem(db){
            return db.collection(entityName).find(query).toArray();
        });
    };

    this.create = function create(document){
        return db.getDb().then(function createDocument(db){
            return db.collection(entityName).insertOne(document);
        });
    };

    this.update = function update(id, document){
        var objectId = buildObjectIdFromString(id);

        return db.getDb().then(function updateDocument(db){
            db.collection(entityName).updateOne({"_id":objectId},document);
        });
    }

    this.delete = function deleteItem(id){
        var objectId = buildObjectIdFromString(id);

        return db.getDb().then(function deleteItem(db){
            return db.collection(entityName).deleteOne({_id: objectId});
        });
    };
}


