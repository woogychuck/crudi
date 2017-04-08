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
        throw new Error("BAD REQUEST", e);
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

    this.update = function update(findQuery, document){

        //Convert Ids
        for(var field in findQuery){
            if(field.indexOf('_id') > -1){
                findQuery[field] = buildObjectIdFromString(findQuery[field]);
            }
        }


        return db.getDb().then(function updateDocument(db){
            db.collection(entityName).updateOne(findQuery,document);
        });
    }

    this.delete = function deleteItem(findQuery){
        //Convert Ids
        for(var field in findQuery){
            if(field.indexOf('_id') > -1){
                findQuery[field] = buildObjectIdFromString(findQuery[field]);
            }
        }

        return db.getDb().then(function deleteItem(db){
            return db.collection(entityName).deleteOne(findQuery);
        });
    };
}


