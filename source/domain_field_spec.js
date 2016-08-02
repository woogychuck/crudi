describe('Domain Field', function(){
    var DomainField = require('./domain_field');

    describe('Building fields', function(){
        it('Correctly builds a domain field with default values', function(){
            var testFieldOptions = {name:'TestField'};
            var exampleField = DomainField.build(testFieldOptions, false);
            expect(exampleField.name).toEqual(testFieldOptions.name);
            expect(exampleField.type).toEqual('string');
            expect(exampleField.required).toEqual(true);
        });

        it('Correctly builds a domain field with set values',function(){
            var testFieldOptions = {name:'TestField', type:'array',required:false};
            var exampleField = DomainField.build(testFieldOptions, false);
            expect(exampleField.name).toEqual(testFieldOptions.name);
            expect(exampleField.type).toEqual('array');
            expect(exampleField.required).toEqual(false);
        });

        it('Defaults required to true when invalid value is passed',function(){
            var testFieldOptions = {name:'TestField', required:'false'};
            var exampleField = DomainField.build(testFieldOptions, false);
            expect(exampleField.name).toEqual(testFieldOptions.name);
            expect(exampleField.required).toEqual(true);
        });
    });

    describe('Building the validator', function(){
        spyOn(DomainField,'buildValidator').andCallThrough();

        it('Calls the validator by default', function(){
            var testFieldOptions = {name:'TestField'};
            var exampleField = DomainField.build(testFieldOptions);

        });
    });
});
