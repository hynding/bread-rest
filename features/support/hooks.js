import {defineSupportCode} from 'cucumber';

defineSupportCode(function({registerHandler, Before, After}) {

  registerHandler('BeforeFeatures', (feature, next)=>{
    next()
  });

  Before(function(){
    this.instances = {};
    this.instanceOptions = {};
  });

  After(function(ScenarioResult, next){
    this.instances = {};
    this.methodResult = null;
    next()
  });
});