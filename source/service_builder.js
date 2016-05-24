var Joi = require('joi'),
    GeneralRepository = require('./general_repository');

function ServiceBuilder(domainModel, options){
    this.domainModel = domainModel;
    this.options = options | {};
    this.routes = [];

    //Configure repository
    this.repository = new GeneralRepository(this.domainModel.name);

    //Generate Routes
    this.generateRoutes();

}

ServiceBuilder.prototype.generateRoutes = function(){
    var me = this;
    //Generate Get All Route
    var getAllRoute = {
        method: 'GET',
        path: '/' + this.domainModel.pluralName,
        config: {
            description: 'Gets an array of all ' + this.domainModel.pluralName,
            notes: 'Coming Soon',
            tags: ['api',this.domainModel.name],
            handler: function (request, reply) {
                this.repository.getAll().then(function (items) {
                    reply(items);
                }, function (err) {
                    reply(err);
                })
            }.bind(me)
        }
    };
    this.routes.push(getAllRoute);

    //Generate Get By Id Route
    var getByIdParams = {};
    getByIdParams[this.domainModel.name + 'Id'] = Joi.string().required();
    var getByIdRoute = {
        method: 'GET',
        path: '/' + this.domainModel.pluralName + '/{' + this.domainModel.name + 'Id}',
        config: {
            description: 'Gets a single ' + this.domainModel.name + " identified by id",
            notes: 'Coming Soon',
            tags: ['api',this.domainModel.name],
            handler: function(request, reply) {
                this.repository.getOne({_id:request.params[this.domainModel.name + 'Id']}).then(
                    function(item){
                        reply(item);
                    }, function(err){
                        reply(err)
                    });
            }.bind(me),
            validate: {
                params: getByIdParams
            }
        }
    }
    this.routes.push(getByIdRoute);

    //Generate Post Route
    var createPayload = this.domainModel.buildValidator('post');
    var postRoute = {
        method: 'POST',
        path: '/' + this.domainModel.pluralName,
        config:{
            description: 'Creates a new ' + this.domainModel.name,
            notes: 'Coming Soon',
            tags: ['api',this.domainModel.name],
            handler: function(request, reply){
                this.repository.create(request.payload).then(
                    function(newItem){
                        reply(newItem);
                    }, function(err){
                        console.log('ERORORRO');
                        console.log(err);
                        reply(err);
                    });
            }.bind(me),
            validate: {
                payload: createPayload
            }
        }
    }
    this.routes.push(postRoute);

    //Generate Put Route

    var updatePayload = this.domainModel.buildValidator('put');
    var putRoute = {
        method: 'PUT',
        path: '/' + this.domainModel.pluralName + '/{' + this.domainModel.name + 'Id}',
        config: {
            description: 'Updates a ' + this.domainModel.name + ' document identified by ' + this.domainModel.name + 'Id',
            notes: 'Coming Soon',
            tags: ['api',this.domainModel.name],
            handler: function(request, reply){
                this.repository.update(request.params[this.domainModel.name + 'Id'], request.payload).then(
                    function(result){
                        reply(result);
                    }, function(err){
                        reply(err);
                    });
            }.bind(me),
            validate: {
                params: getByIdParams,
                payload: updatePayload
            }
        }
    };
    this.routes.push(putRoute);

    var deleteRoute = {
        method: 'DELETE',
        path: '/' + this.domainModel.pluralName + '/{' + this.domainModel.name + 'Id}',
        config: {
            description: 'Deletes a ' + this.domainModel.name + ' document identified by ' + this.domainModel.name + 'Id',
            notes: 'Coming Soon',
            tags: ['api',this.domainModel.name],
            handler: function(request, reply){
                this.repository.delete(request.params[this.domainModel.name + 'Id']).then(
                    function(result){
                        reply(result);
                    }, function(err){
                        reply(err);
                    });
            }.bind(me),
            validate: {
                params: getByIdParams
            }
        }
    };
    this.routes.push(deleteRoute)

    var searchRoute = {
        method: 'POST',
        path: '/' + this.domainModel.pluralName  + '/search',
        config: {
            description: 'Executes a search',
            notes: 'Returns an array of documents that matches the provided search query object',
            tags: ['api',this.domainModel.name],
            handler: function(request, reply){
                this.repository.findAll(request.payload.query).then(
                    function(result){
                        reply(result);
                    }, function(err){
                        reply(err);
                    });
            }.bind(me),
            validate: {
                payload: {
                    'query': Joi.object().unknown()
                }
            }
        }
    }

    return this.routes;
};

ServiceBuilder.build = function(domainModel,options){
    return new ServiceBuilder(domainModel, options);
};

module.exports = ServiceBuilder;
