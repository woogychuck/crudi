var Joi = require('joi');

function DomainField(options){
    this.name = options.name;
    this.type = options.type || 'string';
    this.required = options.requried || true;
    this.description = options.description;
    this.validator = null;
    this.buildValidator();
};

DomainField.build = function buildDomainField(options){
    return new DomainField(options);
};

DomainField.prototype.buildValidator = function buildDomainFieldValidator(){
    switch(this.type){
        case 'array':
            this.validator = Joi.array();
            break;
        case 'date':
            this.validator = Joi.date();
            break;
        case 'number':
            this.validator = Joi.number();
            break;
        default :
            this.validator = Joi.string();
            if(!this.required){
                this.validator.allow('');
            }
            break;
    };

    if(this.required){
        this.validator.required();
    }else{
        this.validator.optional();
    };

    if(this.description){
        this.validator.description(this.description);
    }else {
        this.validator.description(this.name + ' (' + this.type + ') - ' + this.required ? 'required' : 'optional');
    }

    return this.validator;
}

module.exports = DomainField;