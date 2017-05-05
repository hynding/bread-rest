'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BreadRest = function () {
  function BreadRest(nameOrOptions, inclusiveNameOptions) {
    _classCallCheck(this, BreadRest);

    var name = typeof nameOrOptions === 'string' ? nameOrOptions : false;
    var options = name ? Object.assign({ name: name }, inclusiveNameOptions || {}) : nameOrOptions;
    this.options(options);

    // kickstart routing, when possible
    if (!this.idle && this.server && this.name) {
      this.route();
    }
  }

  _createClass(BreadRest, [{
    key: 'options',
    value: function options(_ref) {
      var server = _ref.server,
          responder = _ref.responder,
          store = _ref.store,
          storeOptions = _ref.storeOptions,
          name = _ref.name,
          collectionName = _ref.collectionName,
          basePath = _ref.basePath,
          browsePathName = _ref.browsePathName,
          browseMethod = _ref.browseMethod,
          identifier = _ref.identifier,
          pathSeparator = _ref.pathSeparator,
          idle = _ref.idle;

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
  }, {
    key: 'api',
    value: function api() {
      var browseAction = [this.collectionName].concat(this.collectionName != this.name ? [] : [this.browsePathName]);
      return {
        browse: this.getState(this.browseMethod, browseAction),
        read: this.getState('get', [this.name, this.identifier]),
        edit: this.getState('put', [this.name, this.identifier]),
        add: this.getState('post', [this.name]),
        destroy: this.getState('delete', [this.name, this.identifier])
      };
    }
  }, {
    key: 'getState',
    value: function getState(method, actionFigures) {
      var basePathPrefixed = this.basePath && !this.basePath.indexOf(this.pathSeparator);
      var basePath = basePathPrefixed ? this.basePath : '' + this.pathSeparator + this.basePath;
      var base = this.basePath ? basePath.split(this.pathSeparator) : [''];
      return {
        method: method,
        action: base.concat(actionFigures).join(this.pathSeparator)
      };
    }
  }, {
    key: 'route',
    value: function route() {
      this.serve(this.api(), this.responder);
    }
  }, {
    key: 'serve',
    value: function serve(bread, butter) {
      var _this = this;

      if (!bread || (typeof bread === 'undefined' ? 'undefined' : _typeof(bread)) !== 'object') {
        return console.error('BREAD must be an object or array of objects in order to "serve"');
      }
      // TODO: Support multiple slices of bread via name / collectionName or (to-be) entities option
      if (bread && typeof bread.forEach === 'function') {
        bread.forEach(function (breadSlice, index) {
          return _this.serveSlice(breadSlice, butter && butter[index] ? butter[index] : butter);
        });
      } else {
        this.serveSlice(bread, butter);
      }
    }
  }, {
    key: 'serveSlice',
    value: function serveSlice(slice, butter) {
      var _this2 = this;

      Object.keys(slice).forEach(function (crumb) {
        return _this2.serveCrumb(crumb, slice[crumb], butter && butter[crumb] ? butter[crumb] : butter);
      });
    }

    // Overwrite this class in an extension if using a server application that doesn't follow the Express/Restify/Sinatra routing pattern

  }, {
    key: 'serveCrumb',
    value: function serveCrumb(type, crumb, butter) {
      var _this3 = this;

      var method = crumb.method === 'delete' ? 'del' : crumb.method;
      this.server[method](crumb.action, butter || function (req, res, next) {
        _this3[type](req, res, next);
      });
    }
  }, {
    key: 'browse',
    value: function browse(req, res, next) {
      if (this.store.browse) {
        this.store.browse(req.query, this.storeOptions).then(function (list) {
          res.send(list);
          next();
        });
      } else res.send('Include a responder, store or extend and overwrite "browse"');
    }
  }, {
    key: 'read',
    value: function read(req, res, next) {
      if (this.store.read) {
        this.store.read(req.params.id, this.storeOptions).then(function (item) {
          res.send(item);
          next();
        });
      } else res.send('Include a responder, store or extend and overwrite "read"');
    }
  }, {
    key: 'edit',
    value: function edit(req, res, next) {
      if (this.store.edit) {
        this.store.edit(req.params.id, req.body).then(function (item) {
          console.log('edit done', item, req.body);
          res.send(item);
          next();
        });
      } else res.send('Include a responder, store or extend and overwrite "edit"');
    }
  }, {
    key: 'add',
    value: function add(req, res, next) {
      if (this.store.add) {
        this.store.add(req.body).then(function (item) {
          res.send(item);
          next();
        }).catch(function (err) {
          console.error(err);
        });
      } else res.send('Include a responder, store or extend and overwrite "add"');
    }
  }, {
    key: 'destroy',
    value: function destroy(req, res, next) {
      if (this.store.destroy) {
        this.store.destroy(req.params.id).then(function (item) {
          res.send(item);
          next();
        });
      } else res.send('Include a responder, store or extend and overwrite "destroy"');
    }
  }]);

  return BreadRest;
}();

exports.default = BreadRest;