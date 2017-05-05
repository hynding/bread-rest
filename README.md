# restful-bread
An extendable, unassuming utility for standing up RESTful methods with CRUD/SCRUD (search + crud) persistent storage, or (as I prefer) BREAD [Browse, Read, Edit, Add, Destroy].
It supports out-of-the-box routing integration with Express/Restify/Sinatra but can be simply extended to use your preferred server API solution.

#### Basic usage
The most basic usage of this package is to generate a RESTful BREAD API document.

    var RestfulBread = require('restful-bread');
    var breadBox = new RestfulBread('box');
    
    console.log(breadBox.api());
    
    /*  
    
    {
      "browse": {
        "method": "get",
        "action": "/box/browse"
      },
      "read": {
        "method": "get",
        "action": "/box/:id"
      },
      "edit": {
        "method": "put",
        "action": "/box/:id"
      },
      "add": {
        "method": "post",
        "action": "/box"
      },
      "destroy": {
        "method": "delete",
        "action": "/box/:id"
      }
    }
    */
    
    
#### Ingredients
**DISCLAIMER:** I had some fun running with the 'bread' acronymn as an analogy when coding variables. 
I'm taking the same liberties in the rest of the documentation but I'll specify in parenthesis the underlying context.

The following ingredients (options) can be added to knead (customize) your BREAD:

| Option             | Type   | Description |
| ------------------ | ------ | ----------- |
| name   |
| collectionName
| browsePathName


    this.name = name || collectionName;
    this.collectionName = collectionName || name;
    // if you don't use a collectionName (or it's the same as name), this will be added to the path
    this.browsePathName = browsePathName || 'browse';
    // some prefer 'post'; TODO: allow both
    this.browseMethod = browseMethod || 'get';
    this.identifier = identifier || ':id';
    this.pathSeparator = pathSeparator || '/';
    // prevent routing kickstarter
    this.idle = idle;


#### Server Routing
You can supply your RestfulBread instance with its own server instance and responder object. 
