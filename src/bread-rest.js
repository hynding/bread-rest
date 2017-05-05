export default class BreadRest {

  constructor(nameOrOptions, inclusiveNameOptions) {
    let name = (typeof nameOrOptions === 'string') ? nameOrOptions: false;
    let options = name ? Object.assign({name}, inclusiveNameOptions || {}): nameOrOptions;
    this.options(options);

    // kickstart routing, when possible
    if (!this.idle && this.server && this.name) {
      this.route();
    }
  }

  options({server, responder, store, storeOptions, name, collectionName, basePath, browsePathName, browseMethod, identifier, pathSeparator, idle}) {
    // An instance of your server with built-in support for Express/Restify/Sinatra routing
    this.server = server;
    // an object or function that handles the responses to the server
    this.responder = responder;
    // if you prefer plural or singular names for requests that expect an array or object, I've got you covered
    this.name = name || collectionName;
    this.collectionName = collectionName || name;
    this.basePath = basePath;
    this.store = store || {};
    this.storeOptions = storeOptions || {};
    // if you don't use a collectionName (or it's the same as name), this will be added to the path
    this.browsePathName = browsePathName || 'browse';
    // some prefer 'post'; TODO: allow both
    this.browseMethod = browseMethod || 'get';
    this.identifier = identifier || ':id';
    this.pathSeparator = pathSeparator || '/';
    // prevent routing kickstarter
    this.idle = idle;
  }

  api() {
    let browseAction = [this.collectionName].concat((this.collectionName!=this.name)?[]:[this.browsePathName]);
    return {
      browse: this.getState(this.browseMethod, browseAction),
      read: this.getState('get', [this.name, this.identifier]),
      edit: this.getState('put', [this.name, this.identifier]),
      add: this.getState('post', [this.name]),
      destroy: this.getState('delete', [this.name, this.identifier]),
    }
  }

  getState(method, actionFigures) {
    let basePathPrefixed = (this.basePath && !this.basePath.indexOf(this.pathSeparator));
    let basePath = basePathPrefixed?this.basePath:`${this.pathSeparator}${this.basePath}`;
    let base = this.basePath?basePath.split(this.pathSeparator):[''];
    return {
      method,
      action: base.concat(actionFigures).join(this.pathSeparator)
    }
  }

  route() {
    this.serve(this.api(), this.responder);
  }

  serve(bread, butter) {
    if (!bread || typeof bread !== 'object') {
      return console.error('BREAD must be an object or array of objects in order to "serve"');
    }
    // TODO: Support multiple slices of bread via name / collectionName or (to-be) entities option
    if (bread && typeof bread.forEach === 'function') {
      bread.forEach((breadSlice,index)=>this.serveSlice(breadSlice, (butter && butter[index])?butter[index]: butter));
    }
    else {
      this.serveSlice(bread,butter);
    }
  }

  serveSlice(slice, butter) {
    Object.keys(slice).forEach(crumb=>this.serveCrumb(crumb, slice[crumb], (butter && butter[crumb])?butter[crumb]: butter));
  }

  // Overwrite this class in an extension if using a server application that doesn't follow the Express/Restify/Sinatra routing pattern
  serveCrumb(type, crumb, butter) {
    var method = (crumb.method==='delete')?'del':crumb.method;
    this.server[method](crumb.action, butter || ((req, res, next)=>{
        this[type](req, res, next);
      }));
  }

  browse(req, res, next) {
    if (this.store.browse) {
      this.store.browse(req.query, this.storeOptions).then(list=>{
        res.send(list);
        next();
      });
    }
    else res.send('Include a responder, store or extend and overwrite "browse"');
  }

  read(req, res, next) {
    if (this.store.read) {
      this.store.read(req.params.id, this.storeOptions).then(item=>{
        res.send(item);
        next();
      });
    }
    else res.send('Include a responder, store or extend and overwrite "read"');
  }

  edit(req, res, next) {
    if (this.store.edit) {
      this.store.edit(req.params.id, req.body).then(item=>{
        console.log('edit done', item, req.body);
        res.send(item);
        next();
      });
    }
    else res.send('Include a responder, store or extend and overwrite "edit"');
  }

  add(req, res, next) {
    if (this.store.add) {
      this.store.add(req.body).then(item=>{
        res.send(item);
        next();
      }).catch((err)=>{console.error(err);});
    }
    else res.send('Include a responder, store or extend and overwrite "add"');
  }

  destroy(req, res, next) {
    if (this.store.destroy) {
      this.store.destroy(req.params.id).then(item=>{
        res.send(item);
        next();
      });
    }
    else res.send('Include a responder, store or extend and overwrite "destroy"');
  }
}