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
    if(options.fields){
        this.buildFieldsFromArray(options.fields);
        this.buildValidator();
    }
    this.validator = null;
};

DomainModel.build = function buildDomainModel(options){
    return new DomainModel(options);
};

DomainModel.prototype.addField = function addDomainModelField(domainField, rebuildValidator){
    if(typeof domainField == 'string'){
        domainField = DomainField.build({name: domainField});
    }

    if(!(domainField instanceof DomainField)){
        domainField = DomainField.build(domainField);
    }

    this.fields[domainField.name] = domainField;
    if(rebuildValidator !== false){
        this.buildValidator();
    }
};

DomainModel.prototype.buildValidator = function buildDomainValidator(method){
    var validationRules = {};

    for(var fieldName in this.fields){
        validationRules[fieldName] = this.fields[fieldName].buildValidator();
    }

    this.validator = Joi.object(validationRules);
    if(!this.strict){
        this.validator.unknown();
    }

    return this.validator;
};

DomainModel.prototype.buildFieldsFromArray = function (fieldArray){
    fieldArray.map(function(fieldDefinition){
        this.addField(fieldDefinition,false);
    }.bind(this));
}

module.exports  = DomainModel;
