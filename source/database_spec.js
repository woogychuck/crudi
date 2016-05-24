'use strict';

var proxyquire = require('proxyquire').noCallThru().preserveCache();

fdescribe('MongoDB Database wrapper', function describeMongoDBdatabase(){

    var mongodb,
        db,
        q = require('q'),
        mockConnection = {
            collection: function(name){
                return ['blah', 'unique', 'undefined'];
            }
        },
        database1,
        database2,
        MongoClientConnectCount = 0,
        fakeError,
        fakeConnectWithError,
        fakeConfig;

    mongodb = {
        MongoClient: {
            connect: function fakeConnect(connectionString, dbOptions, callback){

                ++MongoClientConnectCount;
                callback(null, mockConnection);
            }
        }
    };

    fakeConnectWithError = function fakeConnectWithError(connectionString, dbOptions, callback){
        fakeError = new Error('I have a headache');
        callback(fakeError, null);
    };

    beforeEach(function beforeEachMongoDatabaseTest(){
        fakeConfig = {
            host: 'lumiere',
            port: '42',
            database: 'yep. dat a base!'
        };

        db = proxyquire('./database', {
            'mongodb': mongodb,
            './config': fakeConfig
        });
    });

    describe('getDb method', function describeGetDb(){

        it('should connect to mongoDB database', function shouldConnectToMongo(done){
            spyOn(mongodb.MongoClient, 'connect').and.callThrough();

            db.getDb().then(function(db1){
                expect(db1).toEqual(mockConnection);
                expect(mongodb.MongoClient.connect.calls.mostRecent().args[0]).toMatch(new RegExp(fakeConfig.host));
                expect(mongodb.MongoClient.connect.calls.mostRecent().args[0]).toMatch(new RegExp(fakeConfig.port));
                expect(mongodb.MongoClient.connect.calls.mostRecent().args[0]).toMatch(new RegExp(fakeConfig.database));

                done();
            });
        });

        it('should expose a single connection to mongoDB database', function shouldExposeSingleMongoConnection(done){

            MongoClientConnectCount = 0;

            db.getDb().then(function(db1){
                database1 = db1;

                db.getDb().then(function(db2){
                    database2 = db2;

                    expect(MongoClientConnectCount).toEqual(1);
                    expect(database1).toBe(database2);

                    done();
                });
            });
        });

        it('should reject promise with error when error occurs', function shouldRejectWithError(done){

            mongodb.MongoClient.connect = fakeConnectWithError;

            db.getDb().then(function(db1){
                expect(error).toBeDefined();
                done();
            }).catch(function processError(error){
                expect(error).toBe(fakeError);
                done();
            });

        });

    });

});
