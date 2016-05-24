function RouteFactory(domainModel, repository){
    this.domainModel = domainModel;
    this.repository = repository;
}

RouteFactory.prototype.buildRoute = function buildRoute(routeOptions){
    var me = this;
    var routeDefinition = {
        method: routeOptions.method || 'GET',
        path: '/' + this.domainModel.pluralName + routeOptions.path || '',
        config:{
            description: routeOptions.description ||'',
            notes: routeOptions.notes || '',
            tags: ['api',this.domainModel.name],
            handler: buildRouteHandler(routeOptions).bind(me),
            validate: buildRouteValidation(routeOptions).bind(me)
        }
    };

    return routeDefinition;
};

function buildRouteValidation(routeOptions){
    var validator = {};

    return validator;
}

function buildRouteHandler(routeOptions){
    var handler = function(request,reply){
        this.repository[routeOptions.repositoryAction]
    };
    return handler;
};


/*

BaseActions

 */

module.exports = RouteFactory;
