var Joi = require('joi'),
    GeneralRepository = require('./general_repository'),
    RouteFactory = require('./route_factory');

function ServiceBuilder(domainModel, options){
    this.domainModel = domainModel;
    this.options = options | {};
    this.routes = [];

    //Configure repository
    this.repository = new GeneralRepository(this.domainModel.name);

    //Configure route factory
    this.routeFactory = new RouteFactory(this.domainModel, this.repository);

    //Generate Routes
    this.generateRoutes();

}

ServiceBuilder.prototype.generateRoutes = function(){

    var me = this;
    var getByIdParams = {};
    getByIdParams[me.domainModel.name + 'Id'] = Joi.string().required();

    var getAllOptions = {repositoryAction:'getAll', path:''};
    var getAllRoute = me.routeFactory.buildRoute(getAllOptions);
    this.routes.push(getAllRoute);

    //Generate Get By Id Route
    var getByIdOptions = {
        repositoryAction: 'getOne',
        path: '/{' + me.domainModel.name + 'Id}',
        description: 'Gets a single ' + me.domainModel.name + ' identified by id',
        reqParams: ["_id:??" + me.domainModel.name + 'Id'],
        validation: {params:getByIdParams}
    };
    this.routes.push(me.routeFactory.buildRoute(getByIdOptions));

    //Generate POST Route
    var postOptions = {
        repositoryAction: 'create',
        method: 'POST',
        description: 'Creates a new ' + this.domainModel.name,
        validation: {
            payload: me.domainModel.validator
        }
    }
    this.routes.push(me.routeFactory.buildRoute(postOptions));

    //Generate Put Route
    var putOptions = {
        repositoryAction: 'update',
        path: '/{' + me.domainModel.name + 'Id}',
        method: 'PUT',
        description: 'Updates a/an ' + this.domainModel.name,
        reqParams: ["_id:??" + me.domainModel.name + 'Id'],
        validation: {
            params: getByIdParams,
            payload: me.domainModel.validator
        }
    }
    this.routes.push(me.routeFactory.buildRoute(putOptions));

    //Generate Delete Route
    var deleteOptions = {
        repositoryAction: 'delete',
        path: '/{' + me.domainModel.name + 'Id}',
        method: 'DELETE',
        description: 'Deletes a/an ' + this.domainModel.name,
        reqParams: ["_id:??" + me.domainModel.name + 'Id'],
        validation: {params:getByIdParams}
    };
    var deleteRoute = me.routeFactory.buildRoute(deleteOptions);
    this.routes.push(deleteRoute);

    return this.routes;
};

ServiceBuilder.prototype.addCustomRoute = function(routeOptions){
    //Validate New Route

    //Add the Route
    this.routes.push(this.routeFactory.buildRoute(routeOptions));
}

ServiceBuilder.build = function(domainModel,options){
    return new ServiceBuilder(domainModel, options);
};

module.exports = ServiceBuilder;
