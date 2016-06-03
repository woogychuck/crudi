var Joi = require('joi'),
    pluralize = require('pluralize'),
    DomainField = require('./domain_field');

function DomainModel(options){
    this.name = options.name;
    this.pluralName = pluralize(options.name);
    this.strict = options.strict || true;
    if(options.collectionName){
        this.collectionName = options.collectionName;
    }else{
        this.collectionName = pluralize(this.name);
    }

    this.fields = {};
    this.validator = null;

    if(options.fields){
        this.buildFieldsFromArray(options.fields);
        this.buildValidator();
    }

};

DomainModel.build = function buildDomainModel(options){
    return new DomainModel(options);
};

DomainModel.prototype.addField = function addDomainModelField(domainField, rebuildValidator){
    if(typeof domainField == 'string'){
        domainField = DomainField.build({name: domainField}, rebuildValidator);
    }

    if(!(domainField instanceof DomainField)){
        domainField = DomainField.build(domainField, rebuildValidator);
    }

    this.fields[domainField.name] = domainField;
    if(rebuildValidator !== false){
        this.buildValidator();
    }
};

DomainModel.prototype.buildValidator = function buildDomainValidator(){
    var validationRules = {};

    for(var fieldName in this.fields){
        if(!this.fields[fieldName].validator){
            this.fields[fieldName].buildValidator();
        }
        validationRules[fieldName] = this.fields[fieldName].validator;
    }

    this.validator = Joi.object(validationRules);
    if(!this.strict){
        this.validator = this.validator.unknown();
    };

    return this.validator;
};

DomainModel.prototype.buildFieldsFromArray = function (fieldArray){
    fieldArray.map(function(fieldDefinition){
        this.addField(fieldDefinition,false);
    }.bind(this));
}

module.exports  = DomainModel;
