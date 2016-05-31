# crudi
Crudi is a tool for quickly generating HTTP routes that perform basic CRUD operations for your HAPI project. It's a useful tool for quickly building out a restful API for protyping or simple production projects.

## Tutorial
A more detailed tutorial is coming soon, the following is just a quick start.

### 1. Create a domain object
Use the Domain.build function to create an instance of a DomainModel object to define your model. The build method accepts 2 parameters: name and fields. The name parameter is a string that defines the name of your model and determines the name of the collection that they will be stored in. The fields parameter is an array of field definitions. There are 3 ways to define a field:

1. **Pass only the field name** - Passing just a string as the field definition creates a field using all default settings using the passed string as the name of the field. The default settings for v.0.0.6 are type string and required true.
2. **Pass an object defining the fields properties** - Passing an object will allow more control over the field. You can set the name, type, requirement, description, and validator. The available types are 'array','date','number', and 'string'. If needed, you can pass a custom Joi validator in the validator property rather than allow Crudi to generate it for you.
3. **Pass an instance of a DomainField** - In future versions, this will allow deeper customization. At the moment, it's just something that you can do if you feel like it.

**Example**
The following creates a Crudi domain you can use to generate a Crudi service
    
    var Crudi = require('crudi');

    var projectDomain = Crudi.Domain.build(
    {
        name:'project',
        fields: [
            'teamName',
            'projectName',
            {name:'teamMembers', type:'array'},
            {name: 'office', type: 'array'},
            'description',
            'targetAudience',
            'youtubeId',
            {name:'additionalUrl', required: false},
            {name:'notes', required:false},
            {name:'createDate', type:'date'}
        ]
    });

    module.exports = projectDomain;

### 2. Add a Crudi service to Hapi using your domain object
To add the service routes for your domain to Hapi, create your Hapi server normally, then call the Crudi.AddService method passing your domain object and the Hapi server instance. This will register the CRUD routes with Hapi.

**Example**
The below example creates and instance of Hapi, with Swagger documetation, using the ProjectDomain defined in the previous example.
    
    var Hapi =      require('hapi'),
    	Inert =         require('inert'),
    	Vision =        require('vision'),
    	HapiSwagger =   require('hapi-swagger'),
    	Pack =          require('./package'),
    	Crudi =         require('crudi'),
    	ProjectDomain = require('.project_domain'),
    	Joi =           require('joi');


	var server = new Hapi.Server(),
	    swaggerOptions = {
	        'info': {
	            'title': 'My API',
	            'version': Pack.version
	        }
	    };


    function startServer() {
        server.connection({port: 1337, routes : {cors:true}});

	    Crudi.AddService(ProjectDomain, server);
	
	
	    server.register([
	        Inert,
	        Vision,
	        {
	            'register': HapiSwagger,
	            'options' : swaggerOptions
	        }
	    ], function(err){
	        if(err){
	            console.log(err);
	            throw err;
	        }
	        server.start(function(err){
	            if(err){
	                console.log(err);
	                throw err;
	            }
	
	            console.log('Server running at:' + server.info.uri);
	        })
	    });
    };

    startServer();


I know this documentation is pretty sparse. More details, as well as an example service, will be added in the coming weeks.