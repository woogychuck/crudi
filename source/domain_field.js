var Joi = require('joi');

function DomainField(options, buildValidator){
    this.name = options.name;
    this.type = options.type || 'string';
    this.required = (typeof options.required === 'boolean') ? options.required : true;
    this.description = options.description;
    this.validator = null;
    if(buildValidator) {
        this.buildValidator();
    }
};

DomainField.build = function buildDomainField(options, buildValidator){
    return new DomainField(options, buildValidator);
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
                this.validator = this.validator.allow('');
            }
            break;
    };

    if(this.required){
        this.validator = this.validator.required();
    }

    if(this.description){
        this.validator = this.validator.description(this.description);
    }else {
        this.validator = this.validator.description(this.name + ' (' + this.type + ') - ' + this.required ? 'required' : 'optional');
    }

    return this.validator;
}

module.exports = DomainField;