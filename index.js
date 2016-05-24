var ServiceBuilder = require('./source/service_builder'),
    config = require('./source/config');

module.exports = {
    Domain: require('./source/domain_model'),
    DomainField: require('./source/domain_field'),
    AddService: function(domainObject, server){
        var service = ServiceBuilder.build(domainObject);
        service.routes.map(function(route){
            server.route(route);
        });
    },
    Config: function(settings){
        if(settings.db){
            if(settings.db.host){
                config.db.host = settings.db.host;
            }
            if(settings.db.port){
                config.db.port = settings.db.port;
            }
            if(settings.db.database){
                config.db.database = settings.db.database;
            }
        }
    }
}