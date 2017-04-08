function RouteFactory(domainModel, repository){
    this.domainModel = domainModel;
    this.repository = repository;
}

RouteFactory.prototype.buildRoute = function buildRoute(routeOptions){
    var me = this;
    var reqParams = routeOptions.reqParams;
    routeOptions.path = routeOptions.path || '/';
    var routeDefinition = {
        method: routeOptions.method || 'GET',
        path: '/' + this.domainModel.pluralName + routeOptions.path,
        config:{
            description: routeOptions.description ||'Default Description',
            notes: routeOptions.notes || 'Default Notes',
            tags: ['api',this.domainModel.name],
            handler: function(request,reply){
                var repoPayload = null;
                var repoParams = [];
                if(reqParams && reqParams.length){
                    repoPayload = {};
                    for(var i = 0; i < reqParams.length; i++){
                        var payloadDef = reqParams[i].split(':');
                        var payloadKey = payloadDef[0];
                        var payloadValue = payloadDef[1];
                        if(payloadValue.indexOf('??') >= 0){
                            //Get from request params
                            payloadValue = request.params[payloadValue.substring(2)];
                        }else if(payloadValue.indexOf('##') >= 0){
                            //Get from post payload
                            payloadValue = request.payload[payloadValue.substring(2)];
                        }
                        repoPayload[payloadKey] = payloadValue;
                    }
                    repoParams.push(repoPayload);
                }

                if(routeOptions.method == 'POST' || routeOptions.method == 'PUT'){
                    repoParams.push(request.payload);
                }

                if(repoParams.length == 0){
                    repoParams = null;
                }
                
                me.repository[routeOptions.repositoryAction].apply(this,repoParams).then(function processResult(results){
                    reply(results);
                }, function processError(error){
                    reply(error);
                })
            }
        }
    };

    if(routeOptions.validation){
        routeDefinition.config.validate = {};
        if(routeOptions.validation.params){
            routeDefinition.config.validate.params = routeOptions.validation.params;
        }

        if(routeOptions.validation.payload){
            routeDefinition.config.validate.payload = routeOptions.validation.payload;
        }
    }

    return routeDefinition;
};




module.exports = RouteFactory;

//RepoArgs
// Starts with ?? Get from request params
// Starts with ## Get from request body
//