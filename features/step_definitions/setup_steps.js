import {defineSupportCode} from 'cucumber';
import BreadRest from '../../';
import assert from 'assert';

defineSupportCode(function({Given, When, Then}) {
  Given('I will have the RestfulBread instance "{name}"', function(name){
    this.instances[name] = null;
  });

  Given('I give it the option {name}: "{value}"', function(name, value){
    this.instanceOptions[name] = value;
  });

  Given('I have created a common framework server instance', function(){

  });

  When('I instantiate "{instanceName}"', function(instanceName){
    this.instances[instanceName] = new BreadRest(this.instanceOptions);
  });

  When('I call and observe "{instance}.{method}"', function(instance, method){
    this.methodResult = this.instances[instance][method]();
  });

  Then('the "{name}" property contains method: "{methodValue}" and action: "{actionValue}"', function(name, methodValue, actionValue){
    assert.equal(this.methodResult[name].method, methodValue);
    assert.equal(this.methodResult[name].action, actionValue);
  });

});