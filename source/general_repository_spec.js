'use strict';

describe('General repository', function describeMongoDbRepository() {

    var Repository = require('./general_repository'),
        Errors = require('../../application/domain/error/errors'),
        repoInstance = null,
        repoName = 'HiImRepo',
        q = require('q'),
        db = require('./database'),
        ObjectId = require('mongodb').ObjectID,
        mockCollection = {},
        mockDb,
        fakeResult = {};

    beforeEach(function beforeEachMongoDbWrapperDescribe(){

        mockCollection.insertOne = jasmine.createSpy('insertOne').and.returnValue(q.when(fakeResult));
        mockCollection.replaceOne = jasmine.createSpy('replaceOne').and.returnValue(q.when(fakeResult));
        mockCollection.findOne = jasmine.createSpy('findOne').and.returnValue(q.when(fakeResult));
        mockCollection.deleteOne = jasmine.createSpy('deleteOne').and.returnValue(q.when(fakeResult));

        mockDb = {
            collection: function collectionThing(name){
                return mockCollection;
            }
        };

        spyOn(db, 'getDb').and.callFake(function fakeGetDb(){
            return q.when(mockDb);
        });

        repoInstance = new Repository(repoName);

        spyOn(mockDb, 'collection').and.callThrough();

    });

    describe('save', function describeRepositorySave(){
        it('should call MongoDB insertOne for named collecton when no id supplied', function shouldCallMongoDbDatabaseInsertOne(done){
            var saveSubject = {
                name: 'argonaut'
            };
            Object.freeze(saveSubject);
            repoInstance.save(saveSubject).then(function afterSave(saveResult){
                expect(mockDb.collection).toHaveBeenCalledWith(repoName);
                expect(mockCollection.insertOne).toHaveBeenCalledWith(saveSubject);
                expect(saveResult).toBeDefined();
                done();
            });
        });

        it('should call MongoDB replaceOne for named collecton when _id is supplied', function shouldCallMongoDbDatabaseInsertOne(done){
            var testId = '55cb831d110069000f92c11f',
                saveSubject = {
                _id: testId,
                name: 'argonaut'
            };
            Object.freeze(saveSubject);

            repoInstance.save(saveSubject).then(function afterSave(saveResult){
                expect(mockDb.collection).toHaveBeenCalledWith(repoName);

                expect(saveResult._id.toString()).toEqual(testId);
                expect(mockCollection.replaceOne).toHaveBeenCalledWith({_id:saveResult._id}, saveResult);
                done();
            });
        });


        it('should remove functions from objects prior to saving', function shouldCallMongoDbDatabaseInsertOne(done){
            var testId = '55cb831d110069000f92c11f',
                saveSubject = {
                    _id: testId,
                    name: 'argonaut',
                    testFunction: function (){
                        return 'testy';
                    }
                };
            Object.freeze(saveSubject);

            repoInstance.save(saveSubject).then(function afterSave(saveResult){

                expect(saveResult.testFunction).not.toBeDefined();
                expect(mockCollection.replaceOne).toHaveBeenCalledWith({_id:saveResult._id}, saveResult);
                done();
            });
        });

    });

    describe('get', function describeRepositoryGet(){
        it('should call MongoDB findOne for named collection', function shouldCallMongoDbDatabaseFindOne(done){
            var id = '55c91c665222ca9037206cef',
                objectId = new ObjectId(id);

            repoInstance.get(id).then(function afterGet(getResult){
                expect(mockDb.collection).toHaveBeenCalledWith(repoName);
                expect(mockCollection.findOne).toHaveBeenCalledWith({_id:objectId});
                done();
            });
        });

        it('should throw BadRequest for malformed id', function shouldCallMongoDbDatabaseFindOne(done){
            var id = 'It’s okay to cry sometimes.';

            try{
                repoInstance.get(id).then(function afterGet(getResult){
                    expect(mockDb.collection).not.toHaveBeenCalledWith(repoName);
                    done();
                });

            } catch(error){
                expect(error.code).toEqual(400);
                expect(error.message).toContain('invalid parameters');
                done();
            }

        })

    });

    describe('delete', function describeRepositoryGet(){
        it('should call MongoDB deleteOne for named collection', function shouldCallMongoDbDatabaseDeleteOne(done){
            var id = '55c91c665222ca9037206cef',
                objectId = new ObjectId(id);

            repoInstance.delete(id).then(function afterDelete(getResult){
                expect(mockDb.collection).toHaveBeenCalledWith(repoName);
                expect(mockCollection.deleteOne).toHaveBeenCalledWith({_id:objectId});
                done();
            });
        })
    });

});