var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile('./spec/jasmine.json');

var reporters = require('jasmine-reporters');
var junitReporter = new reporters.JUnitXmlReporter({
    savePath: './coverage/',
    consolidateAll: true
});

jasmine.addReporter(junitReporter);
jasmine.configureDefaultReporter({colors:true});
jasmine.execute();