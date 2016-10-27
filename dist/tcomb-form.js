(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["TcombForm"] = factory(require("React"));
	else
		root["TcombForm"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_52__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ = __webpack_require__(1);
	
	var _2 = _interopRequireDefault(_);
	
	var _tcombFormTemplatesBootstrap = __webpack_require__(54);
	
	var _tcombFormTemplatesBootstrap2 = _interopRequireDefault(_tcombFormTemplatesBootstrap);
	
	var _en = __webpack_require__(71);
	
	var _en2 = _interopRequireDefault(_en);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_2.default.form.Form.templates = _tcombFormTemplatesBootstrap2.default; /*! @preserve
	                                                                         *
	                                                                         * The MIT License (MIT)
	                                                                         *
	                                                                         * Copyright (c) 2014-2015 Giulio Canti
	                                                                         *
	                                                                         */
	
	_2.default.form.Form.i18n = _en2.default;
	
	exports.default = _2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _tcombValidation = __webpack_require__(2);
	
	var _tcombValidation2 = _interopRequireDefault(_tcombValidation);
	
	var _components = __webpack_require__(51);
	
	var components = _interopRequireWildcard(_components);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* global File */
	_tcombValidation2.default.form = components;
	_tcombValidation2.default.form.File = _tcombValidation2.default.irreducible('File', function (x) {
	  return x instanceof File;
	});
	
	module.exports = _tcombValidation2.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var t = __webpack_require__(3);
	var stringify = t.stringify;
	
	var ValidationError = t.struct({
	  message: t.Str,
	  actual: t.Any,
	  expected: t.Any,
	  path: t.list(t.union([t.Str, t.Num]))
	}, 'ValidationError');
	
	function getDefaultValidationErrorMessage(actual, expected, path) {
	  var expectedName = t.getTypeName(expected);
	  var to = path.length ? '/' + path.join('/') + ': ' + expectedName : expectedName;
	  return 'Invalid value ' + stringify(actual) + ' supplied to ' + to;
	}
	
	function getValidationErrorMessage(actual, expected, path, context) {
	  if (t.Function.is(expected.getValidationErrorMessage)) {
	    return expected.getValidationErrorMessage(actual, path, context);
	  }
	  else {
	    return getDefaultValidationErrorMessage(actual, expected, path);
	  }
	}
	
	ValidationError.of = function (actual, expected, path, context) {
	  return new ValidationError({
	    message: getValidationErrorMessage(actual, expected, path, context),
	    actual: actual,
	    expected: expected,
	    path: path
	  });
	};
	
	var ValidationResult = t.struct({
	  errors: t.list(ValidationError),
	  value: t.Any
	}, 'ValidationResult');
	
	ValidationResult.prototype.isValid = function () {
	  return !(this.errors.length);
	};
	
	ValidationResult.prototype.firstError = function () {
	  return this.isValid() ? null : this.errors[0];
	};
	
	ValidationResult.prototype.toString = function () {
	  if (this.isValid()) {
	    return '[ValidationResult, true, ' + stringify(this.value) + ']';
	  }
	  else {
	    return '[ValidationResult, false, (' + this.errors.map(function (err) {
	      return err.message;
	    }).join(', ') + ')]';
	  }
	};
	
	function validate(x, type, options) {
	  options = options || {};
	  var path = t.Array.is(options) ? options : options.path || [];
	  return new ValidationResult(recurse(x, type, path, options));
	}
	
	function recurse(x, type, path, options) {
	  if (t.isType(type)) {
	    return validators[type.meta.kind](x, type, path, options);
	  }
	  else {
	    return validators.es6classes(x, type, path, options);
	  }
	}
	
	var validators = validate.validators = {};
	
	validators.es6classes = function validateES6Classes(x, type, path, options) {
	  return {
	    value: x,
	    errors: x instanceof type ? [] : [ValidationError.of(x, type, path, options.context)]
	  };
	};
	
	// irreducibles and enums
	validators.irreducible =
	validators.enums = function validateIrreducible(x, type, path, options) {
	  return {
	    value: x,
	    errors: type.is(x) ? [] : [ValidationError.of(x, type, path, options.context)]
	  };
	};
	
	validators.list = function validateList(x, type, path, options) {
	
	  // x should be an array
	  if (!t.Arr.is(x)) {
	    return {value: x, errors: [ValidationError.of(x, type, path, options.context)]};
	  }
	
	  var ret = {value: [], errors: []};
	  // every item should be of type `type.meta.type`
	  for (var i = 0, len = x.length; i < len; i++ ) {
	    var item = recurse(x[i], type.meta.type, path.concat(i), options);
	    ret.value[i] = item.value;
	    ret.errors = ret.errors.concat(item.errors);
	  }
	  return ret;
	};
	
	validators.subtype = function validateSubtype(x, type, path, options) {
	
	  // x should be a valid inner type
	  var ret = recurse(x, type.meta.type, path, options);
	  if (ret.errors.length) {
	    return ret;
	  }
	
	  // x should satisfy the predicate
	  if (!type.meta.predicate(ret.value)) {
	    ret.errors = [ValidationError.of(x, type, path, options.context)];
	  }
	
	  return ret;
	
	};
	
	validators.maybe = function validateMaybe(x, type, path, options) {
	  return t.Nil.is(x) ?
	    {value: null, errors: []} :
	    recurse(x, type.meta.type, path, options);
	};
	
	validators.struct = function validateStruct(x, type, path, options) {
	
	  // x should be an object
	  if (!t.Obj.is(x)) {
	    return {value: x, errors: [ValidationError.of(x, type, path, options.context)]};
	  }
	
	  // [optimization]
	  if (type.is(x)) {
	    return {value: x, errors: []};
	  }
	
	  var ret = {value: {}, errors: []};
	  var props = type.meta.props;
	  // every item should be of type `props[name]`
	  for (var name in props) {
	    if (props.hasOwnProperty(name)) {
	      var prop = recurse(x[name], props[name], path.concat(name), options);
	      ret.value[name] = prop.value;
	      ret.errors = ret.errors.concat(prop.errors);
	    }
	  }
	  if (options.strict) {
	    for (var field in x) {
	      if (x.hasOwnProperty(field) && !props.hasOwnProperty(field) && !t.Nil.is(x[field])) {
	        ret.errors.push(ValidationError.of(x[field], t.Nil, path.concat(field), options.context));
	      }
	    }
	  }
	  if (!ret.errors.length) {
	    ret.value = new type(ret.value);
	  }
	  return ret;
	};
	
	validators.tuple = function validateTuple(x, type, path, options) {
	
	  var types = type.meta.types;
	  var len = types.length;
	
	  // x should be an array of at most `len` items
	  if (!t.Arr.is(x) || x.length > len) {
	    return {value: x, errors: [ValidationError.of(x, type, path, options.context)]};
	  }
	
	  var ret = {value: [], errors: []};
	  // every item should be of type `types[i]`
	  for (var i = 0; i < len; i++) {
	    var item = recurse(x[i], types[i], path.concat(i), options);
	    ret.value[i] = item.value;
	    ret.errors = ret.errors.concat(item.errors);
	  }
	  return ret;
	};
	
	validators.dict = function validateDict(x, type, path, options) {
	
	  // x should be an object
	  if (!t.Obj.is(x)) {
	    return {value: x, errors: [ValidationError.of(x, type, path, options.context)]};
	  }
	
	  var ret = {value: {}, errors: []};
	  // every key should be of type `domain`
	  // every value should be of type `codomain`
	  for (var k in x) {
	    if (x.hasOwnProperty(k)) {
	      var subpath = path.concat(k);
	      var key = recurse(k, type.meta.domain, subpath, options);
	      var item = recurse(x[k], type.meta.codomain, subpath, options);
	      ret.value[k] = item.value;
	      ret.errors = ret.errors.concat(key.errors, item.errors);
	    }
	  }
	  return ret;
	};
	
	validators.union = function validateUnion(x, type, path, options) {
	  var ctor = type.dispatch(x);
	  return t.Func.is(ctor) ?
	    recurse(x, ctor, path.concat(type.meta.types.indexOf(ctor)), options) :
	    {value: x, errors: [ValidationError.of(x, type, path, options.context)]};
	};
	
	validators.intersection = function validateIntersection(x, type, path, options) {
	
	  var types = type.meta.types;
	  var len = types.length;
	
	  var ret = {value: x, errors: []};
	  // x should be of type `types[i]` for all i
	  for (var i = 0; i < len; i++) {
	    var item = recurse(x, types[i], path, options);
	    ret.errors = ret.errors.concat(item.errors);
	  }
	  return ret;
	};
	
	t.mixin(t, {
	  ValidationError: ValidationError,
	  ValidationResult: ValidationResult,
	  validate: validate
	});
	
	module.exports = t;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*! @preserve
	 *
	 * The MIT License (MIT)
	 *
	 * Copyright (c) 2014-2016 Giulio Canti
	 *
	 */
	
	// core
	var t = __webpack_require__(4);
	
	// types
	t.Any = __webpack_require__(9);
	t.Array = __webpack_require__(18);
	t.Boolean = __webpack_require__(19);
	t.Date = __webpack_require__(21);
	t.Error = __webpack_require__(22);
	t.Function = __webpack_require__(23);
	t.Nil = __webpack_require__(24);
	t.Number = __webpack_require__(25);
	t.Object = __webpack_require__(27);
	t.RegExp = __webpack_require__(28);
	t.String = __webpack_require__(29);
	
	// short alias are deprecated
	t.Arr = t.Array;
	t.Bool = t.Boolean;
	t.Dat = t.Date;
	t.Err = t.Error;
	t.Func = t.Function;
	t.Num = t.Number;
	t.Obj = t.Object;
	t.Re = t.RegExp;
	t.Str = t.String;
	
	// combinators
	t.dict = __webpack_require__(30);
	t.declare = __webpack_require__(36);
	t.enums = __webpack_require__(38);
	t.irreducible = __webpack_require__(10);
	t.list = __webpack_require__(39);
	t.maybe = __webpack_require__(40);
	t.refinement = __webpack_require__(42);
	t.struct = __webpack_require__(43);
	t.tuple = __webpack_require__(44);
	t.union = __webpack_require__(45);
	t.func = __webpack_require__(47);
	t.intersection = __webpack_require__(48);
	t.subtype = t.refinement;
	
	// functions
	t.assert = t;
	t.update = __webpack_require__(49);
	t.mixin = __webpack_require__(37);
	t.isType = __webpack_require__(14);
	t.is = __webpack_require__(35);
	t.getTypeName = __webpack_require__(13);
	t.match = __webpack_require__(50);
	
	module.exports = t;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(5);
	var isNil = __webpack_require__(6);
	var fail = __webpack_require__(7);
	var stringify = __webpack_require__(8);
	
	function assert(guard, message) {
	  if (guard !== true) {
	    if (isFunction(message)) { // handle lazy messages
	      message = message();
	    }
	    else if (isNil(message)) { // use a default message
	      message = 'Assert failed (turn on "Pause on exceptions" in your Source panel)';
	    }
	    assert.fail(message);
	  }
	}
	
	assert.fail = fail;
	assert.stringify = stringify;
	
	module.exports = assert;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function isFunction(x) {
	  return typeof x === 'function';
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function isNil(x) {
	  return x === null || x === void 0;
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function fail(message) {
	  throw new TypeError('[tcomb] ' + message);
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function stringify(x) {
	  try { // handle "Converting circular structure to JSON" error
	    return JSON.stringify(x, null, 2);
	  }
	  catch (e) {
	    return String(x);
	  }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	
	module.exports = irreducible('Any', function () { return true; });


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isString = __webpack_require__(11);
	var isFunction = __webpack_require__(5);
	var forbidNewOperator = __webpack_require__(12);
	
	module.exports = function irreducible(name, predicate) {
	
	  if (true) {
	    assert(isString(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to irreducible(name, predicate) (expected a string)'; });
	    assert(isFunction(predicate), 'Invalid argument predicate ' + assert.stringify(predicate) + ' supplied to irreducible(name, predicate) (expected a function)');
	  }
	
	  function Irreducible(value, path) {
	
	    if (true) {
	      forbidNewOperator(this, Irreducible);
	      path = path || [name];
	      assert(predicate(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
	    }
	
	    return value;
	  }
	
	  Irreducible.meta = {
	    kind: 'irreducible',
	    name: name,
	    predicate: predicate,
	    identity: true
	  };
	
	  Irreducible.displayName = name;
	
	  Irreducible.is = predicate;
	
	  return Irreducible;
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function isString(x) {
	  return typeof x === 'string';
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var getTypeName = __webpack_require__(13);
	
	module.exports = function forbidNewOperator(x, type) {
	  assert(!(x instanceof type), function () { return 'Cannot use the new operator to instantiate the type ' + getTypeName(type); });
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(14);
	var getFunctionName = __webpack_require__(17);
	
	module.exports = function getTypeName(constructor) {
	  if (isType(constructor)) {
	    return constructor.displayName;
	  }
	  return getFunctionName(constructor);
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(5);
	var isObject = __webpack_require__(15);
	
	module.exports = function isType(x) {
	  return isFunction(x) && isObject(x.meta);
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isNil = __webpack_require__(6);
	var isArray = __webpack_require__(16);
	
	module.exports = function isObject(x) {
	  return !isNil(x) && typeof x === 'object' && !isArray(x);
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function isArray(x) {
	  return x instanceof Array;
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function getFunctionName(f) {
	  return f.displayName || f.name || '<function' + f.length + '>';
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	var isArray = __webpack_require__(16);
	
	module.exports = irreducible('Array', isArray);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	var isBoolean = __webpack_require__(20);
	
	module.exports = irreducible('Boolean', isBoolean);


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function isBoolean(x) {
	  return x === true || x === false;
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	
	module.exports = irreducible('Date', function (x) { return x instanceof Date; });


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	
	module.exports = irreducible('Error', function (x) { return x instanceof Error; });


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	var isFunction = __webpack_require__(5);
	
	module.exports = irreducible('Function', isFunction);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	var isNil = __webpack_require__(6);
	
	module.exports = irreducible('Nil', isNil);


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	var isNumber = __webpack_require__(26);
	
	module.exports = irreducible('Number', isNumber);


/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function isNumber(x) {
	  return typeof x === 'number' && isFinite(x) && !isNaN(x);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	var isObject = __webpack_require__(15);
	
	module.exports = irreducible('Object', isObject);


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	
	module.exports = irreducible('RegExp', function (x) { return x instanceof RegExp; });


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var irreducible = __webpack_require__(10);
	var isString = __webpack_require__(11);
	
	module.exports = irreducible('String', isString);


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var isFunction = __webpack_require__(5);
	var getTypeName = __webpack_require__(13);
	var isIdentity = __webpack_require__(32);
	var isObject = __webpack_require__(15);
	var create = __webpack_require__(33);
	var is = __webpack_require__(35);
	
	function getDefaultName(domain, codomain) {
	  return '{[key: ' + getTypeName(domain) + ']: ' + getTypeName(codomain) + '}';
	}
	
	function dict(domain, codomain, name) {
	
	  if (true) {
	    assert(isFunction(domain), function () { return 'Invalid argument domain ' + assert.stringify(domain) + ' supplied to dict(domain, codomain, [name]) combinator (expected a type)'; });
	    assert(isFunction(codomain), function () { return 'Invalid argument codomain ' + assert.stringify(codomain) + ' supplied to dict(domain, codomain, [name]) combinator (expected a type)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to dict(domain, codomain, [name]) combinator (expected a string)'; });
	  }
	
	  var displayName = name || getDefaultName(domain, codomain);
	  var domainNameCache = getTypeName(domain);
	  var codomainNameCache = getTypeName(codomain);
	  var identity = isIdentity(domain) && isIdentity(codomain);
	
	  function Dict(value, path) {
	
	    if (false) {
	      if (identity) {
	        return value; // just trust the input if elements must not be hydrated
	      }
	    }
	
	    if (true) {
	      path = path || [displayName];
	      assert(isObject(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
	    }
	
	    var idempotent = true; // will remain true if I can reutilise the input
	    var ret = {}; // make a temporary copy, will be discarded if idempotent remains true
	    for (var k in value) {
	      if (value.hasOwnProperty(k)) {
	        k = create(domain, k, (  true ? path.concat(domainNameCache) : null ));
	        var actual = value[k];
	        var instance = create(codomain, actual, (  true ? path.concat(k + ': ' + codomainNameCache) : null ));
	        idempotent = idempotent && ( actual === instance );
	        ret[k] = instance;
	      }
	    }
	
	    if (idempotent) { // implements idempotency
	      ret = value;
	    }
	
	    if (true) {
	      Object.freeze(ret);
	    }
	
	    return ret;
	  }
	
	  Dict.meta = {
	    kind: 'dict',
	    domain: domain,
	    codomain: codomain,
	    name: name,
	    identity: identity
	  };
	
	  Dict.displayName = displayName;
	
	  Dict.is = function (x) {
	    if (!isObject(x)) {
	      return false;
	    }
	    for (var k in x) {
	      if (x.hasOwnProperty(k)) {
	        if (!is(k, domain) || !is(x[k], codomain)) {
	          return false;
	        }
	      }
	    }
	    return true;
	  };
	
	  Dict.update = function (instance, patch) {
	    return Dict(assert.update(instance, patch));
	  };
	
	  return Dict;
	}
	
	dict.getDefaultName = getDefaultName;
	module.exports = dict;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var isNil = __webpack_require__(6);
	var isString = __webpack_require__(11);
	
	module.exports = function isTypeName(name) {
	  return isNil(name) || isString(name);
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var Boolean = __webpack_require__(19);
	var isType = __webpack_require__(14);
	var getTypeName = __webpack_require__(13);
	
	// return true if the type constructor behaves like the identity function
	module.exports = function isIdentity(type) {
	  if (isType(type)) {
	    if (true) {
	      assert(Boolean.is(type.meta.identity), function () { return 'Invalid meta identity ' + assert.stringify(type.meta.identity) + ' supplied to type ' + getTypeName(type); });
	    }
	    return type.meta.identity;
	  }
	  // for tcomb the other constructors, like ES6 classes, are identity-like
	  return true;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(14);
	var isStruct = __webpack_require__(34);
	var getFunctionName = __webpack_require__(17);
	var assert = __webpack_require__(4);
	var stringify = __webpack_require__(8);
	
	// creates an instance of a type, handling the optional new operator
	module.exports = function create(type, value, path) {
	  if (isType(type)) {
	    // for structs the new operator is allowed
	    return isStruct(type) ? new type(value, path) : type(value, path);
	  }
	
	  if (true) {
	    // here type should be a class constructor and value some instance, just check membership and return the value
	    path = path || [getFunctionName(type)];
	    assert(value instanceof type, function () { return 'Invalid value ' + stringify(value) + ' supplied to ' + path.join('/'); });
	  }
	
	  return value;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(14);
	
	module.exports = function isStruct(x) {
	  return isType(x) && ( x.meta.kind === 'struct' );
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(14);
	
	// returns true if x is an instance of type
	module.exports = function is(x, type) {
	  if (isType(type)) {
	    return type.is(x);
	  }
	  return x instanceof type; // type should be a class constructor
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var isType = __webpack_require__(14);
	var isNil = __webpack_require__(6);
	var mixin = __webpack_require__(37);
	var getTypeName = __webpack_require__(13);
	
	// All the .declare-d types should be clearly different from each other thus they should have
	// different names when a name was not explicitly provided.
	var nextDeclareUniqueId = 1;
	
	module.exports = function declare(name) {
	  if (true) {
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + name + ' supplied to declare([name]) (expected a string)'; });
	  }
	
	  var type;
	
	  function Declare(value, path) {
	    if (true) {
	      assert(!isNil(type), function () { return 'Type declared but not defined, don\'t forget to call .define on every declared type'; });
	    }
	    return type(value, path);
	  }
	
	  Declare.define = function (spec) {
	    if (true) {
	      assert(isType(spec), function () { return 'Invalid argument type ' + assert.stringify(spec) +  ' supplied to define(type) (expected a type)'; });
	      assert(isNil(type), function () { return 'Declare.define(type) can only be invoked once'; });
	      assert(isNil(spec.meta.name) && Object.keys(spec.prototype).length === 0, function () { return 'Invalid argument type ' + assert.stringify(spec) + ' supplied to define(type) (expected a fresh, unnamed type)'; });
	    }
	
	    type = spec;
	    mixin(Declare, type, true); // true because it overwrites Declare.displayName
	    if (name) {
	      type.displayName = Declare.displayName = name;
	      Declare.meta.name = name;
	    }
	    // ensure identity is still false
	    Declare.meta.identity = false;
	    Declare.prototype = type.prototype;
	    return Declare;
	  };
	
	  Declare.displayName = name || ( getTypeName(Declare) + "$" + nextDeclareUniqueId++ );
	  // in general I can't say if this type will be an identity, for safety setting to false
	  Declare.meta = { identity: false };
	  Declare.prototype = null;
	  return Declare;
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var isNil = __webpack_require__(6);
	var assert = __webpack_require__(4);
	
	// safe mixin, cannot override props unless specified
	module.exports = function mixin(target, source, overwrite) {
	  if (isNil(source)) { return target; }
	  for (var k in source) {
	    if (source.hasOwnProperty(k)) {
	      if (overwrite !== true) {
	        if (true) {
	          assert(!target.hasOwnProperty(k), function () { return 'Invalid call to mixin(target, source, [overwrite]): cannot overwrite property "' + k + '" of target object'; });
	        }
	      }
	      target[k] = source[k];
	    }
	  }
	  return target;
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var forbidNewOperator = __webpack_require__(12);
	var isString = __webpack_require__(11);
	var isObject = __webpack_require__(15);
	
	function getDefaultName(map) {
	  return Object.keys(map).map(function (k) { return assert.stringify(k); }).join(' | ');
	}
	
	function enums(map, name) {
	
	  if (true) {
	    assert(isObject(map), function () { return 'Invalid argument map ' + assert.stringify(map) + ' supplied to enums(map, [name]) combinator (expected a dictionary of String -> String | Number)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to enums(map, [name]) combinator (expected a string)'; });
	  }
	
	  var displayName = name || getDefaultName(map);
	
	  function Enums(value, path) {
	
	    if (true) {
	      forbidNewOperator(this, Enums);
	      path = path || [displayName];
	      assert(Enums.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected one of ' + assert.stringify(Object.keys(map)) + ')'; });
	    }
	
	    return value;
	  }
	
	  Enums.meta = {
	    kind: 'enums',
	    map: map,
	    name: name,
	    identity: true
	  };
	
	  Enums.displayName = displayName;
	
	  Enums.is = function (x) {
	    return map.hasOwnProperty(x);
	  };
	
	  return Enums;
	}
	
	enums.of = function (keys, name) {
	  keys = isString(keys) ? keys.split(' ') : keys;
	  var value = {};
	  keys.forEach(function (k) {
	    value[k] = k;
	  });
	  return enums(value, name);
	};
	
	enums.getDefaultName = getDefaultName;
	module.exports = enums;
	


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var isFunction = __webpack_require__(5);
	var getTypeName = __webpack_require__(13);
	var isIdentity = __webpack_require__(32);
	var create = __webpack_require__(33);
	var is = __webpack_require__(35);
	var isArray = __webpack_require__(16);
	
	function getDefaultName(type) {
	  return 'Array<' + getTypeName(type) + '>';
	}
	
	function list(type, name) {
	
	  if (true) {
	    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to list(type, [name]) combinator (expected a type)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to list(type, [name]) combinator (expected a string)'; });
	  }
	
	  var displayName = name || getDefaultName(type);
	  var typeNameCache = getTypeName(type);
	  var identity = isIdentity(type); // the list is identity iif type is identity
	
	  function List(value, path) {
	
	    if (false) {
	      if (identity) {
	        return value; // just trust the input if elements must not be hydrated
	      }
	    }
	
	    if (true) {
	      path = path || [displayName];
	      assert(isArray(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an array of ' + typeNameCache + ')'; });
	    }
	
	    var idempotent = true; // will remain true if I can reutilise the input
	    var ret = []; // make a temporary copy, will be discarded if idempotent remains true
	    for (var i = 0, len = value.length; i < len; i++ ) {
	      var actual = value[i];
	      var instance = create(type, actual, (  true ? path.concat(i + ': ' + typeNameCache) : null ));
	      idempotent = idempotent && ( actual === instance );
	      ret.push(instance);
	    }
	
	    if (idempotent) { // implements idempotency
	      ret = value;
	    }
	
	    if (true) {
	      Object.freeze(ret);
	    }
	
	    return ret;
	  }
	
	  List.meta = {
	    kind: 'list',
	    type: type,
	    name: name,
	    identity: identity
	  };
	
	  List.displayName = displayName;
	
	  List.is = function (x) {
	    return isArray(x) && x.every(function (e) {
	      return is(e, type);
	    });
	  };
	
	  List.update = function (instance, patch) {
	    return List(assert.update(instance, patch));
	  };
	
	  return List;
	}
	
	list.getDefaultName = getDefaultName;
	module.exports = list;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var isFunction = __webpack_require__(5);
	var isMaybe = __webpack_require__(41);
	var isIdentity = __webpack_require__(32);
	var Any = __webpack_require__(9);
	var create = __webpack_require__(33);
	var Nil = __webpack_require__(24);
	var forbidNewOperator = __webpack_require__(12);
	var is = __webpack_require__(35);
	var getTypeName = __webpack_require__(13);
	
	function getDefaultName(type) {
	  return '?' + getTypeName(type);
	}
	
	function maybe(type, name) {
	
	  if (isMaybe(type) || type === Any || type === Nil) { // makes the combinator idempotent and handle Any, Nil
	    return type;
	  }
	
	  if (true) {
	    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to maybe(type, [name]) combinator (expected a type)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to maybe(type, [name]) combinator (expected a string)'; });
	  }
	
	  var displayName = name || getDefaultName(type);
	
	  function Maybe(value, path) {
	    if (true) {
	      forbidNewOperator(this, Maybe);
	    }
	    return Nil.is(value) ? null : create(type, value, path);
	  }
	
	  Maybe.meta = {
	    kind: 'maybe',
	    type: type,
	    name: name,
	    identity: isIdentity(type)
	  };
	
	  Maybe.displayName = displayName;
	
	  Maybe.is = function (x) {
	    return Nil.is(x) || is(x, type);
	  };
	
	  return Maybe;
	}
	
	maybe.getDefaultName = getDefaultName;
	module.exports = maybe;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(14);
	
	module.exports = function isMaybe(x) {
	  return isType(x) && ( x.meta.kind === 'maybe' );
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var isFunction = __webpack_require__(5);
	var forbidNewOperator = __webpack_require__(12);
	var isIdentity = __webpack_require__(32);
	var create = __webpack_require__(33);
	var is = __webpack_require__(35);
	var getTypeName = __webpack_require__(13);
	var getFunctionName = __webpack_require__(17);
	
	function getDefaultName(type, predicate) {
	  return '{' + getTypeName(type) + ' | ' + getFunctionName(predicate) + '}';
	}
	
	function refinement(type, predicate, name) {
	
	  if (true) {
	    assert(isFunction(type), function () { return 'Invalid argument type ' + assert.stringify(type) + ' supplied to refinement(type, predicate, [name]) combinator (expected a type)'; });
	    assert(isFunction(predicate), function () { return 'Invalid argument predicate supplied to refinement(type, predicate, [name]) combinator (expected a function)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to refinement(type, predicate, [name]) combinator (expected a string)'; });
	  }
	
	  var displayName = name || getDefaultName(type, predicate);
	  var identity = isIdentity(type);
	
	  function Refinement(value, path) {
	
	    if (true) {
	      forbidNewOperator(this, Refinement);
	      path = path || [displayName];
	    }
	
	    var x = create(type, value, path);
	
	    if (true) {
	      assert(predicate(x), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
	    }
	
	    return x;
	  }
	
	  Refinement.meta = {
	    kind: 'subtype',
	    type: type,
	    predicate: predicate,
	    name: name,
	    identity: identity
	  };
	
	  Refinement.displayName = displayName;
	
	  Refinement.is = function (x) {
	    return is(x, type) && predicate(x);
	  };
	
	  Refinement.update = function (instance, patch) {
	    return Refinement(assert.update(instance, patch));
	  };
	
	  return Refinement;
	}
	
	refinement.getDefaultName = getDefaultName;
	module.exports = refinement;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var String = __webpack_require__(29);
	var Function = __webpack_require__(23);
	var isArray = __webpack_require__(16);
	var isObject = __webpack_require__(15);
	var create = __webpack_require__(33);
	var mixin = __webpack_require__(37);
	var isStruct = __webpack_require__(34);
	var getTypeName = __webpack_require__(13);
	var dict = __webpack_require__(30);
	
	function getDefaultName(props) {
	  return '{' + Object.keys(props).map(function (prop) {
	    return prop + ': ' + getTypeName(props[prop]);
	  }).join(', ') + '}';
	}
	
	function extend(mixins, name) {
	  if (true) {
	    assert(isArray(mixins) && mixins.every(function (x) {
	      return isObject(x) || isStruct(x);
	    }), function () { return 'Invalid argument mixins supplied to extend(mixins, name), expected an array of objects or structs'; });
	  }
	  var props = {};
	  var prototype = {};
	  mixins.forEach(function (struct) {
	    if (isObject(struct)) {
	      mixin(props, struct);
	    }
	    else {
	      mixin(props, struct.meta.props);
	      mixin(prototype, struct.prototype);
	    }
	  });
	  var ret = struct(props, name);
	  mixin(ret.prototype, prototype);
	  return ret;
	}
	
	function struct(props, name) {
	
	  if (true) {
	    assert(dict(String, Function).is(props), function () { return 'Invalid argument props ' + assert.stringify(props) + ' supplied to struct(props, [name]) combinator (expected a dictionary String -> Type)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to struct(props, [name]) combinator (expected a string)'; });
	  }
	
	  var displayName = name || getDefaultName(props);
	
	  function Struct(value, path) {
	
	    if (Struct.is(value)) { // implements idempotency
	      return value;
	    }
	
	    if (true) {
	      path = path || [displayName];
	      assert(isObject(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an object)'; });
	    }
	
	    if (!(this instanceof Struct)) { // `new` is optional
	      return new Struct(value, path);
	    }
	
	    for (var k in props) {
	      if (props.hasOwnProperty(k)) {
	        var expected = props[k];
	        var actual = value[k];
	        this[k] = create(expected, actual, (  true ? path.concat(k + ': ' + getTypeName(expected)) : null ));
	      }
	    }
	
	    if (true) {
	      Object.freeze(this);
	    }
	
	  }
	
	  Struct.meta = {
	    kind: 'struct',
	    props: props,
	    name: name,
	    identity: false
	  };
	
	  Struct.displayName = displayName;
	
	  Struct.is = function (x) {
	    return x instanceof Struct;
	  };
	
	  Struct.update = function (instance, patch) {
	    return new Struct(assert.update(instance, patch));
	  };
	
	  Struct.extend = function (structs, name) {
	    return extend([Struct].concat(structs), name);
	  };
	
	  return Struct;
	}
	
	struct.getDefaultName = getDefaultName;
	struct.extend = extend;
	module.exports = struct;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var isFunction = __webpack_require__(5);
	var getTypeName = __webpack_require__(13);
	var isIdentity = __webpack_require__(32);
	var isArray = __webpack_require__(16);
	var create = __webpack_require__(33);
	var is = __webpack_require__(35);
	
	function getDefaultName(types) {
	  return '[' + types.map(getTypeName).join(', ') + ']';
	}
	
	function tuple(types, name) {
	
	  if (true) {
	    assert(isArray(types) && types.every(isFunction), function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to tuple(types, [name]) combinator (expected an array of types)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to tuple(types, [name]) combinator (expected a string)'; });
	  }
	
	  var displayName = name || getDefaultName(types);
	  var identity = types.every(isIdentity);
	
	  function Tuple(value, path) {
	
	    if (false) {
	      if (identity) {
	        return value;
	      }
	    }
	
	    if (true) {
	      path = path || [displayName];
	      assert(isArray(value) && value.length === types.length, function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (expected an array of length ' + types.length + ')'; });
	    }
	
	    var idempotent = true;
	    var ret = [];
	    for (var i = 0, len = types.length; i < len; i++) {
	      var expected = types[i];
	      var actual = value[i];
	      var instance = create(expected, actual, (  true ? path.concat(i + ': ' + getTypeName(expected)) : null ));
	      idempotent = idempotent && ( actual === instance );
	      ret.push(instance);
	    }
	
	    if (idempotent) { // implements idempotency
	      ret = value;
	    }
	
	    if (true) {
	      Object.freeze(ret);
	    }
	
	    return ret;
	  }
	
	  Tuple.meta = {
	    kind: 'tuple',
	    types: types,
	    name: name,
	    identity: identity
	  };
	
	  Tuple.displayName = displayName;
	
	  Tuple.is = function (x) {
	    return isArray(x) &&
	      x.length === types.length &&
	      types.every(function (type, i) {
	        return is(x[i], type);
	      });
	  };
	
	  Tuple.update = function (instance, patch) {
	    return Tuple(assert.update(instance, patch));
	  };
	
	  return Tuple;
	}
	
	tuple.getDefaultName = getDefaultName;
	module.exports = tuple;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var isFunction = __webpack_require__(5);
	var getTypeName = __webpack_require__(13);
	var isIdentity = __webpack_require__(32);
	var isArray = __webpack_require__(16);
	var create = __webpack_require__(33);
	var is = __webpack_require__(35);
	var forbidNewOperator = __webpack_require__(12);
	var isType = __webpack_require__(14);
	var isUnion = __webpack_require__(46);
	var isNil = __webpack_require__(6);
	
	function getDefaultName(types) {
	  return types.map(getTypeName).join(' | ');
	}
	
	function union(types, name) {
	
	  if (true) {
	    assert(isArray(types) && types.every(isFunction) && types.length >= 2, function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to union(types, [name]) combinator (expected an array of at least 2 types)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to union(types, [name]) combinator (expected a string)'; });
	  }
	
	  var displayName = name || getDefaultName(types);
	  var identity = types.every(isIdentity);
	
	  function Union(value, path) {
	
	    if (false) {
	      if (identity) {
	        return value;
	      }
	    }
	
	    var type = Union.dispatch(value);
	    if (!type && Union.is(value)) {
	      return value;
	    }
	
	    if (true) {
	      forbidNewOperator(this, Union);
	      path = path || [displayName];
	      assert(isType(type), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/') + ' (no constructor returned by dispatch)'; });
	      path[path.length - 1] += '(' + getTypeName(type) + ')';
	    }
	
	    return create(type, value, path);
	  }
	
	  Union.meta = {
	    kind: 'union',
	    types: types,
	    name: name,
	    identity: identity
	  };
	
	  Union.displayName = displayName;
	
	  Union.is = function (x) {
	    return types.some(function (type) {
	      return is(x, type);
	    });
	  };
	
	  Union.dispatch = function (x) { // default dispatch implementation
	    for (var i = 0, len = types.length; i < len; i++ ) {
	      var type = types[i];
	      if (isUnion(type)) { // handle union of unions
	        var t = type.dispatch(x);
	        if (!isNil(t)) {
	          return t;
	        }
	      }
	      else if (is(x, type)) {
	        return type;
	      }
	    }
	  };
	
	  Union.update = function (instance, patch) {
	    return Union(assert.update(instance, patch));
	  };
	
	  return Union;
	}
	
	union.getDefaultName = getDefaultName;
	module.exports = union;
	


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var isType = __webpack_require__(14);
	
	module.exports = function isUnion(x) {
	  return isType(x) && ( x.meta.kind === 'union' );
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var FunctionType = __webpack_require__(23);
	var isArray = __webpack_require__(16);
	var list = __webpack_require__(39);
	var isObject = __webpack_require__(15);
	var create = __webpack_require__(33);
	var isNil = __webpack_require__(6);
	var isBoolean = __webpack_require__(20);
	var tuple = __webpack_require__(44);
	var getFunctionName = __webpack_require__(17);
	var getTypeName = __webpack_require__(13);
	
	function getDefaultName(domain, codomain) {
	  return '(' + domain.map(getTypeName).join(', ') + ') => ' + getTypeName(codomain);
	}
	
	function isInstrumented(f) {
	  return FunctionType.is(f) && isObject(f.instrumentation);
	}
	
	function func(domain, codomain, name) {
	
	  domain = isArray(domain) ? domain : [domain]; // handle handy syntax for unary functions
	
	  if (true) {
	    assert(list(FunctionType).is(domain), function () { return 'Invalid argument domain ' + assert.stringify(domain) + ' supplied to func(domain, codomain, [name]) combinator (expected an array of types)'; });
	    assert(FunctionType.is(codomain), function () { return 'Invalid argument codomain ' + assert.stringify(codomain) + ' supplied to func(domain, codomain, [name]) combinator (expected a type)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to func(domain, codomain, [name]) combinator (expected a string)'; });
	  }
	
	  var displayName = name || getDefaultName(domain, codomain);
	
	  function FuncType(value, curried) {
	
	    if (!isInstrumented(value)) { // automatically instrument the function
	      return FuncType.of(value, curried);
	    }
	
	    if (true) {
	      assert(FuncType.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + displayName; });
	    }
	
	    return value;
	  }
	
	  FuncType.meta = {
	    kind: 'func',
	    domain: domain,
	    codomain: codomain,
	    name: name,
	    identity: true
	  };
	
	  FuncType.displayName = displayName;
	
	  FuncType.is = function (x) {
	    return isInstrumented(x) &&
	      x.instrumentation.domain.length === domain.length &&
	      x.instrumentation.domain.every(function (type, i) {
	        return type === domain[i];
	      }) &&
	      x.instrumentation.codomain === codomain;
	  };
	
	  FuncType.of = function (f, curried) {
	
	    if (true) {
	      assert(FunctionType.is(f), function () { return 'Invalid argument f supplied to func.of ' + displayName + ' (expected a function)'; });
	      assert(isNil(curried) || isBoolean(curried), function () { return 'Invalid argument curried ' + assert.stringify(curried) + ' supplied to func.of ' + displayName + ' (expected a boolean)'; });
	    }
	
	    if (FuncType.is(f)) { // makes FuncType.of idempotent
	      return f;
	    }
	
	    function fn() {
	      var args = Array.prototype.slice.call(arguments);
	      var len = curried ?
	        args.length :
	        domain.length;
	      var argsType = tuple(domain.slice(0, len));
	
	      args = argsType(args); // type check arguments
	
	      if (len === domain.length) {
	        return create(codomain, f.apply(this, args));
	      }
	      else {
	        var g = Function.prototype.bind.apply(f, [this].concat(args));
	        var newdomain = func(domain.slice(len), codomain);
	        return newdomain.of(g, curried);
	      }
	    }
	
	    fn.instrumentation = {
	      domain: domain,
	      codomain: codomain,
	      f: f
	    };
	
	    fn.displayName = getFunctionName(f);
	
	    return fn;
	
	  };
	
	  return FuncType;
	
	}
	
	func.getDefaultName = getDefaultName;
	module.exports = func;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isTypeName = __webpack_require__(31);
	var isFunction = __webpack_require__(5);
	var isArray = __webpack_require__(16);
	var forbidNewOperator = __webpack_require__(32);
	var is = __webpack_require__(35);
	var getTypeName = __webpack_require__(13);
	
	function getDefaultName(types) {
	  return types.map(getTypeName).join(' & ');
	}
	
	function intersection(types, name) {
	
	  if (true) {
	    assert(isArray(types) && types.every(isFunction) && types.length >= 2, function () { return 'Invalid argument types ' + assert.stringify(types) + ' supplied to intersection(types, [name]) combinator (expected an array of at least 2 types)'; });
	    assert(isTypeName(name), function () { return 'Invalid argument name ' + assert.stringify(name) + ' supplied to intersection(types, [name]) combinator (expected a string)'; });
	  }
	
	  var displayName = name || getDefaultName(types);
	
	  function Intersection(value, path) {
	
	    if (true) {
	      forbidNewOperator(this, Intersection);
	      path = path || [displayName];
	      assert(Intersection.is(value), function () { return 'Invalid value ' + assert.stringify(value) + ' supplied to ' + path.join('/'); });
	    }
	
	    return value;
	  }
	
	  Intersection.meta = {
	    kind: 'intersection',
	    types: types,
	    name: name,
	    identity: true
	  };
	
	  Intersection.displayName = displayName;
	
	  Intersection.is = function (x) {
	    return types.every(function (type) {
	      return is(x, type);
	    });
	  };
	
	  Intersection.update = function (instance, patch) {
	    return Intersection(assert.update(instance, patch));
	  };
	
	  return Intersection;
	}
	
	intersection.getDefaultName = getDefaultName;
	module.exports = intersection;
	


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isObject = __webpack_require__(15);
	var isFunction = __webpack_require__(5);
	var isArray = __webpack_require__(16);
	var isNumber = __webpack_require__(26);
	var mixin = __webpack_require__(37);
	
	function getShallowCopy(x) {
	  if (isArray(x)) {
	    return x.concat();
	  }
	  if (x instanceof Date || x instanceof RegExp) {
	    return x;
	  }
	  if (isObject(x)) {
	    return mixin({}, x);
	  }
	  return x;
	}
	
	function update(instance, patch) {
	
	  if (true) {
	    assert(isObject(patch), function () { return 'Invalid argument patch ' + assert.stringify(patch) + ' supplied to function update(instance, patch): expected an object containing commands'; });
	  }
	
	  var value = getShallowCopy(instance);
	  var isChanged = false;
	  for (var k in patch) {
	    if (patch.hasOwnProperty(k)) {
	      if (update.commands.hasOwnProperty(k)) {
	        value = update.commands[k](patch[k], value);
	        isChanged = true;
	      }
	      else {
	        var newValue = update(value[k], patch[k]);
	        isChanged = isChanged || ( newValue !== value[k] );
	        value[k] = newValue;
	      }
	    }
	  }
	  return isChanged ? value : instance;
	}
	
	// built-in commands
	
	function $apply(f, value) {
	  if (true) {
	    assert(isFunction(f), 'Invalid argument f supplied to immutability helper { $apply: f } (expected a function)');
	  }
	  return f(value);
	}
	
	function $push(elements, arr) {
	  if (true) {
	    assert(isArray(elements), 'Invalid argument elements supplied to immutability helper { $push: elements } (expected an array)');
	    assert(isArray(arr), 'Invalid value supplied to immutability helper $push (expected an array)');
	  }
	  return arr.concat(elements);
	}
	
	function $remove(keys, obj) {
	  if (true) {
	    assert(isArray(keys), 'Invalid argument keys supplied to immutability helper { $remove: keys } (expected an array)');
	    assert(isObject(obj), 'Invalid value supplied to immutability helper $remove (expected an object)');
	  }
	  for (var i = 0, len = keys.length; i < len; i++ ) {
	    delete obj[keys[i]];
	  }
	  return obj;
	}
	
	function $set(value) {
	  return value;
	}
	
	function $splice(splices, arr) {
	  if (true) {
	    assert(isArray(splices) && splices.every(isArray), 'Invalid argument splices supplied to immutability helper { $splice: splices } (expected an array of arrays)');
	    assert(isArray(arr), 'Invalid value supplied to immutability helper $splice (expected an array)');
	  }
	  return splices.reduce(function (acc, splice) {
	    acc.splice.apply(acc, splice);
	    return acc;
	  }, arr);
	}
	
	function $swap(config, arr) {
	  if (true) {
	    assert(isObject(config), 'Invalid argument config supplied to immutability helper { $swap: config } (expected an object)');
	    assert(isNumber(config.from), 'Invalid argument config.from supplied to immutability helper { $swap: config } (expected a number)');
	    assert(isNumber(config.to), 'Invalid argument config.to supplied to immutability helper { $swap: config } (expected a number)');
	    assert(isArray(arr), 'Invalid value supplied to immutability helper $swap (expected an array)');
	  }
	  var element = arr[config.to];
	  arr[config.to] = arr[config.from];
	  arr[config.from] = element;
	  return arr;
	}
	
	function $unshift(elements, arr) {
	  if (true) {
	    assert(isArray(elements), 'Invalid argument elements supplied to immutability helper {$unshift: elements} (expected an array)');
	    assert(isArray(arr), 'Invalid value supplied to immutability helper $unshift (expected an array)');
	  }
	  return elements.concat(arr);
	}
	
	function $merge(obj, value) {
	  return mixin(mixin({}, value), obj, true);
	}
	
	update.commands = {
	  $apply: $apply,
	  $push: $push,
	  $remove: $remove,
	  $set: $set,
	  $splice: $splice,
	  $swap: $swap,
	  $unshift: $unshift,
	  $merge: $merge
	};
	
	module.exports = update;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4);
	var isFunction = __webpack_require__(5);
	var isType = __webpack_require__(14);
	var Any = __webpack_require__(9);
	
	module.exports = function match(x) {
	  var type, guard, f, count;
	  for (var i = 1, len = arguments.length; i < len; ) {
	    type = arguments[i];
	    guard = arguments[i + 1];
	    f = arguments[i + 2];
	
	    if (isFunction(f) && !isType(f)) {
	      i = i + 3;
	    }
	    else {
	      f = guard;
	      guard = Any.is;
	      i = i + 2;
	    }
	
	    if (true) {
	      count = (count || 0) + 1;
	      assert(isType(type), function () { return 'Invalid type in clause #' + count; });
	      assert(isFunction(guard), function () { return 'Invalid guard in clause #' + count; });
	      assert(isFunction(f), function () { return 'Invalid block in clause #' + count; });
	    }
	
	    if (type.is(x) && guard(x)) {
	      return f(x);
	    }
	  }
	  assert.fail('Match error');
	};


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Form = exports.List = exports.Struct = exports.Datetime = exports.Radio = exports.Select = exports.Checkbox = exports.Textbox = exports.Component = exports.decorators = undefined;
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _tcombValidation = __webpack_require__(2);
	
	var _tcombValidation2 = _interopRequireDefault(_tcombValidation);
	
	var _util = __webpack_require__(53);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _class, _temp, _dec, _dec2, _class2, _class3, _temp2, _dec3, _dec4, _class4, _class5, _temp3, _dec5, _dec6, _class6, _class7, _temp4, _dec7, _dec8, _class8, _class9, _temp5, _dec9, _dec10, _class10, _class11, _temp6, _dec11, _class12, _class13, _temp8, _dec12, _class14, _class15, _temp9;
	
	var Nil = _tcombValidation2.default.Nil;
	var assert = _tcombValidation2.default.assert;
	var SOURCE = 'tcomb-form';
	var noobj = Object.freeze({});
	var noarr = Object.freeze([]);
	var noop = function noop() {};
	
	function getType(type, value) {
	  if (type.meta.kind === 'union') {
	    return type.dispatch(value);
	  }
	  return type;
	}
	
	function getOptions(options, defaultOptions, value) {
	  if (_tcombValidation2.default.Nil.is(options)) {
	    return defaultOptions;
	  }
	  if (_tcombValidation2.default.Function.is(options)) {
	    return options(value);
	  }
	  return options;
	}
	
	function getFormComponent(type, options) {
	  if (options.factory) {
	    return options.factory;
	  }
	  if (type.getTcombFormFactory) {
	    return type.getTcombFormFactory(options);
	  }
	  var name = _tcombValidation2.default.getTypeName(type);
	  switch (type.meta.kind) {
	    case 'irreducible':
	      if (type === _tcombValidation2.default.Boolean) {
	        return Checkbox; // eslint-disable-line no-use-before-define
	      } else if (type === _tcombValidation2.default.Date) {
	        return Datetime; // eslint-disable-line no-use-before-define
	      }
	      return Textbox; // eslint-disable-line no-use-before-define
	    case 'struct':
	      return Struct; // eslint-disable-line no-use-before-define
	    case 'list':
	      return List; // eslint-disable-line no-use-before-define
	    case 'enums':
	      return Select; // eslint-disable-line no-use-before-define
	    case 'maybe':
	    case 'subtype':
	      return getFormComponent(type.meta.type, options);
	    default:
	      _tcombValidation2.default.fail('[' + SOURCE + '] unsupported kind ' + type.meta.kind + ' for type ' + name);
	  }
	}
	
	exports.getComponent = getFormComponent;
	
	function sortByText(a, b) {
	  if (a.text < b.text) {
	    return -1;
	  } else if (a.text > b.text) {
	    return 1;
	  }
	  return 0;
	}
	
	function getComparator(order) {
	  return {
	    asc: sortByText,
	    desc: function desc(a, b) {
	      return -sortByText(a, b);
	    }
	  }[order];
	}
	
	var decorators = exports.decorators = {
	  template: function template(name) {
	    return function (Component) {
	      Component.prototype.getTemplate = function getTemplate() {
	        return this.props.options.template || this.props.ctx.templates[name];
	      };
	    };
	  },
	  attrs: function attrs(Component) {
	    Component.prototype.getAttrs = function getAttrs() {
	      var attrs = _tcombValidation2.default.mixin({}, this.props.options.attrs);
	      attrs.id = this.getId();
	      attrs.name = this.getName();
	      return attrs;
	    };
	  },
	  templates: function templates(Component) {
	    Component.prototype.getTemplates = function getTemplates() {
	      return (0, _util.merge)(this.props.ctx.templates, this.props.options.templates);
	    };
	  }
	};
	
	var Component = exports.Component = (_temp = _class = function (_React$Component) {
	  _inherits(Component, _React$Component);
	
	  function Component(props) {
	    _classCallCheck(this, Component);
	
	    var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, props));
	
	    _this.onChange = function (value) {
	      _this.setState({ value: value, isPristine: false }, function () {
	        _this.props.onChange(value, _this.props.ctx.path);
	      });
	    };
	
	    _this.typeInfo = (0, _util.getTypeInfo)(props.type);
	    _this.state = {
	      isPristine: true,
	      hasError: false,
	      value: _this.getTransformer().format(props.value)
	    };
	    return _this;
	  }
	
	  _createClass(Component, [{
	    key: 'getTransformer',
	    value: function getTransformer() {
	      return this.props.options.transformer || this.constructor.transformer;
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      var should = nextState.value !== this.state.value || nextState.hasError !== this.state.hasError || nextProps.options !== this.props.options || nextProps.type !== this.props.type;
	      // console.log(nextState.value !== this.state.value,
	      //   nextState.hasError !== this.state.hasError,
	      //   nextProps.options !== this.props.options,
	      //   nextProps.type !== this.props.type,
	      //   should)
	      return should;
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(props) {
	      if (props.type !== this.props.type) {
	        this.typeInfo = (0, _util.getTypeInfo)(props.type);
	      }
	      var value = this.getTransformer().format(props.value);
	      this.setState({ value: value });
	    }
	  }, {
	    key: 'getValidationOptions',
	    value: function getValidationOptions() {
	      var context = this.props.context || this.props.ctx.context;
	      return {
	        path: this.props.ctx.path,
	        context: _tcombValidation2.default.mixin(_tcombValidation2.default.mixin({}, context), { options: this.props.options })
	      };
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      return this.getTransformer().parse(this.state.value);
	    }
	  }, {
	    key: 'isValueNully',
	    value: function isValueNully() {
	      return Nil.is(this.getValue());
	    }
	  }, {
	    key: 'removeErrors',
	    value: function removeErrors() {
	      this.setState({ hasError: false });
	    }
	  }, {
	    key: 'validate',
	    value: function validate() {
	      var result = _tcombValidation2.default.validate(this.getValue(), this.props.type, this.getValidationOptions());
	      this.setState({ hasError: !result.isValid() });
	      return result;
	    }
	  }, {
	    key: 'getAuto',
	    value: function getAuto() {
	      return this.props.options.auto || this.props.ctx.auto;
	    }
	  }, {
	    key: 'getI18n',
	    value: function getI18n() {
	      return this.props.options.i18n || this.props.ctx.i18n;
	    }
	  }, {
	    key: 'getDefaultLabel',
	    value: function getDefaultLabel() {
	      var label = this.props.ctx.label;
	      if (label) {
	        var suffix = this.typeInfo.isMaybe ? this.getI18n().optional : this.getI18n().required;
	        return label + suffix;
	      }
	    }
	  }, {
	    key: 'getLabel',
	    value: function getLabel() {
	      var label = this.props.options.label || this.props.options.legend;
	      if (Nil.is(label) && this.getAuto() === 'labels') {
	        label = this.getDefaultLabel();
	      }
	      return label;
	    }
	  }, {
	    key: 'getError',
	    value: function getError() {
	      if (this.hasError()) {
	        var error = this.props.options.error || this.typeInfo.getValidationErrorMessage;
	        if (_tcombValidation2.default.Function.is(error)) {
	          var _getValidationOptions = this.getValidationOptions(),
	              path = _getValidationOptions.path,
	              context = _getValidationOptions.context;
	
	          return error(this.getValue(), path, context);
	        }
	        return error;
	      }
	    }
	  }, {
	    key: 'hasError',
	    value: function hasError() {
	      return this.props.options.hasError || this.state.hasError;
	    }
	  }, {
	    key: 'getConfig',
	    value: function getConfig() {
	      return (0, _util.merge)(this.props.ctx.config, this.props.options.config);
	    }
	  }, {
	    key: 'getId',
	    value: function getId() {
	      var attrs = this.props.options.attrs || noobj;
	      if (attrs.id) {
	        return attrs.id;
	      }
	      if (!this.uid) {
	        this.uid = this.props.ctx.uidGenerator.next();
	      }
	      return this.uid;
	    }
	  }, {
	    key: 'getName',
	    value: function getName() {
	      return this.props.options.name || this.props.ctx.name || this.getId();
	    }
	  }, {
	    key: 'getLocals',
	    value: function getLocals() {
	      var options = this.props.options;
	      var value = this.state.value;
	      var isSubmitted = this.props.isSubmitted || false;
	      return {
	        typeInfo: this.typeInfo,
	        path: this.props.ctx.path,
	        isPristine: this.state.isPristine,
	        error: this.getError(),
	        hasError: this.hasError(),
	        label: this.getLabel(),
	        onChange: this.onChange,
	        config: this.getConfig(),
	        value: value,
	        disabled: options.disabled,
	        help: options.help,
	        context: this.props.ctx.context,
	        isSubmitted: isSubmitted
	      };
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var locals = this.getLocals();
	      if (true) {
	        // getTemplate is the only required implementation when extending Component
	        assert(_tcombValidation2.default.Function.is(this.getTemplate), '[' + SOURCE + '] missing getTemplate method of component ' + this.constructor.name);
	      }
	      var template = this.getTemplate();
	      return template(locals);
	    }
	  }]);
	
	  return Component;
	}(_react2.default.Component), _class.transformer = {
	  format: function format(value) {
	    return Nil.is(value) ? null : value;
	  },
	  parse: function parse(value) {
	    return value;
	  }
	}, _temp);
	
	function toNull(value) {
	  return _tcombValidation2.default.String.is(value) && value.trim() === '' || Nil.is(value) ? null : value;
	}
	
	function parseNumber(value) {
	  var n = parseFloat(value);
	  var isNumeric = value - n + 1 >= 0;
	  return isNumeric ? n : toNull(value);
	}
	
	var Textbox = exports.Textbox = (_dec = decorators.attrs, _dec2 = decorators.template('textbox'), _dec(_class2 = _dec2(_class2 = (_temp2 = _class3 = function (_Component) {
	  _inherits(Textbox, _Component);
	
	  function Textbox() {
	    _classCallCheck(this, Textbox);
	
	    return _possibleConstructorReturn(this, (Textbox.__proto__ || Object.getPrototypeOf(Textbox)).apply(this, arguments));
	  }
	
	  _createClass(Textbox, [{
	    key: 'getTransformer',
	    value: function getTransformer() {
	      var options = this.props.options;
	      if (options.transformer) {
	        return options.transformer;
	      } else if (this.typeInfo.innerType === _tcombValidation2.default.Number) {
	        return Textbox.numberTransformer;
	      }
	      return Textbox.transformer;
	    }
	  }, {
	    key: 'getPlaceholder',
	    value: function getPlaceholder() {
	      var attrs = this.props.options.attrs || noobj;
	      var placeholder = attrs.placeholder;
	      if (Nil.is(placeholder) && this.getAuto() === 'placeholders') {
	        placeholder = this.getDefaultLabel();
	      }
	      return placeholder;
	    }
	  }, {
	    key: 'getLocals',
	    value: function getLocals() {
	      var locals = _get(Textbox.prototype.__proto__ || Object.getPrototypeOf(Textbox.prototype), 'getLocals', this).call(this);
	      locals.attrs = this.getAttrs();
	      locals.attrs.placeholder = this.getPlaceholder();
	      locals.type = this.props.options.type || 'text';
	      locals.isSubmitted = this.props.isSubmitted || false;
	      return locals;
	    }
	  }]);
	
	  return Textbox;
	}(Component), _class3.transformer = {
	  format: function format(value) {
	    return Nil.is(value) ? null : value;
	  },
	  parse: toNull
	}, _class3.numberTransformer = {
	  format: function format(value) {
	    return Nil.is(value) ? null : String(value);
	  },
	  parse: parseNumber
	}, _temp2)) || _class2) || _class2);
	
	var Checkbox = exports.Checkbox = (_dec3 = decorators.attrs, _dec4 = decorators.template('checkbox'), _dec3(_class4 = _dec4(_class4 = (_temp3 = _class5 = function (_Component2) {
	  _inherits(Checkbox, _Component2);
	
	  function Checkbox() {
	    _classCallCheck(this, Checkbox);
	
	    return _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
	  }
	
	  _createClass(Checkbox, [{
	    key: 'getLocals',
	    value: function getLocals() {
	      var locals = _get(Checkbox.prototype.__proto__ || Object.getPrototypeOf(Checkbox.prototype), 'getLocals', this).call(this);
	      locals.attrs = this.getAttrs();
	      // checkboxes must always have a label
	      locals.label = locals.label || this.getDefaultLabel();
	      locals.isSubmitted = this.props.isSubmitted || false;
	      return locals;
	    }
	  }]);
	
	  return Checkbox;
	}(Component), _class5.transformer = {
	  format: function format(value) {
	    return Nil.is(value) ? false : value;
	  },
	  parse: function parse(value) {
	    return value;
	  }
	}, _temp3)) || _class4) || _class4);
	
	var Select = exports.Select = (_dec5 = decorators.attrs, _dec6 = decorators.template('select'), _dec5(_class6 = _dec6(_class6 = (_temp4 = _class7 = function (_Component3) {
	  _inherits(Select, _Component3);
	
	  function Select() {
	    _classCallCheck(this, Select);
	
	    return _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).apply(this, arguments));
	  }
	
	  _createClass(Select, [{
	    key: 'getTransformer',
	    value: function getTransformer() {
	      var options = this.props.options;
	      if (options.transformer) {
	        return options.transformer;
	      }
	      if (this.isMultiple()) {
	        return Select.multipleTransformer;
	      }
	      return Select.transformer(this.getNullOption());
	    }
	  }, {
	    key: 'getNullOption',
	    value: function getNullOption() {
	      return this.props.options.nullOption || { value: '', text: '-' };
	    }
	  }, {
	    key: 'isMultiple',
	    value: function isMultiple() {
	      return this.typeInfo.innerType.meta.kind === 'list';
	    }
	  }, {
	    key: 'getEnum',
	    value: function getEnum() {
	      return this.isMultiple() ? (0, _util.getTypeInfo)(this.typeInfo.innerType.meta.type).innerType : this.typeInfo.innerType;
	    }
	  }, {
	    key: 'getOptions',
	    value: function getOptions() {
	      var options = this.props.options;
	      var items = options.options ? options.options.slice() : (0, _util.getOptionsOfEnum)(this.getEnum());
	      if (options.order) {
	        items.sort(getComparator(options.order));
	      }
	      var nullOption = this.getNullOption();
	      if (!this.isMultiple() && options.nullOption !== false) {
	        items.unshift(nullOption);
	      }
	      return items;
	    }
	  }, {
	    key: 'getLocals',
	    value: function getLocals() {
	      var locals = _get(Select.prototype.__proto__ || Object.getPrototypeOf(Select.prototype), 'getLocals', this).call(this);
	      locals.attrs = this.getAttrs();
	      locals.options = this.getOptions();
	      locals.isMultiple = this.isMultiple();
	      locals.isSubmitted = this.props.isSubmitted || false;
	      return locals;
	    }
	  }]);
	
	  return Select;
	}(Component), _class7.transformer = function (nullOption) {
	  return {
	    format: function format(value) {
	      return Nil.is(value) && nullOption ? nullOption.value : value;
	    },
	    parse: function parse(value) {
	      return nullOption && nullOption.value === value ? null : value;
	    }
	  };
	}, _class7.multipleTransformer = {
	  format: function format(value) {
	    return Nil.is(value) ? noarr : value;
	  },
	  parse: function parse(value) {
	    return value;
	  }
	}, _temp4)) || _class6) || _class6);
	
	var Radio = exports.Radio = (_dec7 = decorators.attrs, _dec8 = decorators.template('radio'), _dec7(_class8 = _dec8(_class8 = (_temp5 = _class9 = function (_Component4) {
	  _inherits(Radio, _Component4);
	
	  function Radio() {
	    _classCallCheck(this, Radio);
	
	    return _possibleConstructorReturn(this, (Radio.__proto__ || Object.getPrototypeOf(Radio)).apply(this, arguments));
	  }
	
	  _createClass(Radio, [{
	    key: 'getOptions',
	    value: function getOptions() {
	      var options = this.props.options;
	      var items = options.options ? options.options.slice() : (0, _util.getOptionsOfEnum)(this.typeInfo.innerType);
	      if (options.order) {
	        items.sort(getComparator(options.order));
	      }
	      return items;
	    }
	  }, {
	    key: 'getLocals',
	    value: function getLocals() {
	      var locals = _get(Radio.prototype.__proto__ || Object.getPrototypeOf(Radio.prototype), 'getLocals', this).call(this);
	      locals.attrs = this.getAttrs();
	      locals.options = this.getOptions();
	      locals.isSubmitted = this.props.isSubmitted || false;
	      return locals;
	    }
	  }]);
	
	  return Radio;
	}(Component), _class9.transformer = {
	  format: function format(value) {
	    return Nil.is(value) ? null : value;
	  },
	  parse: function parse(value) {
	    return value;
	  }
	}, _temp5)) || _class8) || _class8);
	
	var defaultDatetimeValue = Object.freeze([null, null, null]);
	
	var Datetime = exports.Datetime = (_dec9 = decorators.attrs, _dec10 = decorators.template('date'), _dec9(_class10 = _dec10(_class10 = (_temp6 = _class11 = function (_Component5) {
	  _inherits(Datetime, _Component5);
	
	  function Datetime() {
	    _classCallCheck(this, Datetime);
	
	    return _possibleConstructorReturn(this, (Datetime.__proto__ || Object.getPrototypeOf(Datetime)).apply(this, arguments));
	  }
	
	  _createClass(Datetime, [{
	    key: 'getOrder',
	    value: function getOrder() {
	      return this.props.options.order || ['M', 'D', 'YY'];
	    }
	  }, {
	    key: 'getLocals',
	    value: function getLocals() {
	      var locals = _get(Datetime.prototype.__proto__ || Object.getPrototypeOf(Datetime.prototype), 'getLocals', this).call(this);
	      locals.attrs = this.getAttrs();
	      locals.order = this.getOrder();
	      locals.isSubmitted = this.props.isSubmitted || false;
	      return locals;
	    }
	  }]);
	
	  return Datetime;
	}(Component), _class11.transformer = {
	  format: function format(value) {
	    if (_tcombValidation2.default.Array.is(value)) {
	      return value;
	    } else if (_tcombValidation2.default.Date.is(value)) {
	      return [value.getFullYear(), value.getMonth(), value.getDate()].map(String);
	    }
	    return defaultDatetimeValue;
	  },
	  parse: function parse(value) {
	    var numbers = value.map(parseNumber);
	    if (numbers.every(_tcombValidation2.default.Number.is)) {
	      return new Date(numbers[0], numbers[1], numbers[2]);
	    } else if (numbers.every(Nil.is)) {
	      return null;
	    }
	    return numbers;
	  }
	}, _temp6)) || _class10) || _class10);
	
	var Struct = exports.Struct = (_dec11 = decorators.templates, _dec11(_class12 = (_temp8 = _class13 = function (_Component6) {
	  _inherits(Struct, _Component6);
	
	  function Struct() {
	    var _ref;
	
	    var _this7, _ret;
	
	    _classCallCheck(this, Struct);
	
	    var _temp7;
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp7 = (_this7 = _possibleConstructorReturn(this, (_ref = Struct.__proto__ || Object.getPrototypeOf(Struct)).call.apply(_ref, [this].concat(args))), _this7), _this7.onChange = function (fieldName, fieldValue, path, kind) {
	      var value = _tcombValidation2.default.mixin({}, _this7.state.value);
	      value[fieldName] = fieldValue;
	      _this7.setState({ value: value, isPristine: false }, function () {
	        _this7.props.onChange(value, path, kind);
	      });
	    }, _temp7), _possibleConstructorReturn(_this7, _ret);
	  }
	
	  _createClass(Struct, [{
	    key: 'isValueNully',
	    value: function isValueNully() {
	      var _this8 = this;
	
	      return Object.keys(this.refs).every(function (ref) {
	        return _this8.refs[ref].isValueNully();
	      });
	    }
	  }, {
	    key: 'removeErrors',
	    value: function removeErrors() {
	      var _this9 = this;
	
	      this.setState({ hasError: false });
	      Object.keys(this.refs).forEach(function (ref) {
	        return _this9.refs[ref].removeErrors();
	      });
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      var value = {};
	      var props = this.getTypeProps();
	      for (var ref in props) {
	        if (this.refs.hasOwnProperty(ref)) {
	          value[ref] = this.refs[ref].getValue();
	        }
	      }
	      return this.getTransformer().parse(value);
	    }
	  }, {
	    key: 'validate',
	    value: function validate() {
	      var value = {};
	      var errors = [];
	      var hasError = false;
	      var result = void 0;
	
	      if (this.typeInfo.isMaybe && this.isValueNully()) {
	        this.removeErrors();
	        return new _tcombValidation2.default.ValidationResult({ errors: [], value: null });
	      }
	
	      var props = this.getTypeProps();
	      for (var ref in props) {
	        if (this.refs.hasOwnProperty(ref)) {
	          result = this.refs[ref].validate();
	          errors = errors.concat(result.errors);
	          value[ref] = result.value;
	        }
	      }
	
	      if (errors.length === 0) {
	        var InnerType = this.typeInfo.innerType;
	        value = new InnerType(value);
	        if (this.typeInfo.isSubtype && errors.length === 0) {
	          result = _tcombValidation2.default.validate(value, this.props.type, this.getValidationOptions());
	          hasError = !result.isValid();
	          errors = errors.concat(result.errors);
	        }
	      }
	
	      this.setState({ hasError: hasError });
	      return new _tcombValidation2.default.ValidationResult({ errors: errors, value: value });
	    }
	  }, {
	    key: 'getTemplate',
	    value: function getTemplate() {
	      return this.props.options.template || this.getTemplates().struct;
	    }
	  }, {
	    key: 'getTypeProps',
	    value: function getTypeProps() {
	      return this.typeInfo.innerType.meta.props;
	    }
	  }, {
	    key: 'getOrder',
	    value: function getOrder() {
	      return this.props.options.order || Object.keys(this.getTypeProps());
	    }
	  }, {
	    key: 'getInputs',
	    value: function getInputs() {
	      var _props = this.props,
	          options = _props.options,
	          ctx = _props.ctx;
	
	      var props = this.getTypeProps();
	      var auto = this.getAuto();
	      var i18n = this.getI18n();
	      var config = this.getConfig();
	      var templates = this.getTemplates();
	      var value = this.state.value;
	      var inputs = {};
	
	      for (var prop in props) {
	        if (props.hasOwnProperty(prop)) {
	          var propValue = value[prop];
	          var propType = getType(props[prop], propValue);
	          var fieldsOptions = options.fields || noobj;
	          var propOptions = getOptions(fieldsOptions[prop], noobj, propValue);
	          inputs[prop] = _react2.default.createElement(getFormComponent(propType, propOptions), {
	            key: prop,
	            ref: prop,
	            type: propType,
	            options: propOptions,
	            value: propValue,
	            onChange: this.onChange.bind(this, prop),
	            ctx: {
	              context: ctx.context,
	              uidGenerator: ctx.uidGenerator,
	              auto: auto,
	              config: config,
	              name: ctx.name ? ctx.name + '[' + prop + ']' : prop,
	              label: (0, _util.humanize)(prop),
	              i18n: i18n,
	              templates: templates,
	              path: ctx.path.concat(prop)
	            }
	          });
	        }
	      }
	      return inputs;
	    }
	  }, {
	    key: 'getLocals',
	    value: function getLocals() {
	      var options = this.props.options;
	      var locals = _get(Struct.prototype.__proto__ || Object.getPrototypeOf(Struct.prototype), 'getLocals', this).call(this);
	      locals.order = this.getOrder();
	      locals.inputs = this.getInputs();
	      locals.className = options.className;
	      locals.isSubmitted = this.props.isSubmitted || false;
	      return locals;
	    }
	  }]);
	
	  return Struct;
	}(Component), _class13.transformer = {
	  format: function format(value) {
	    return Nil.is(value) ? noobj : value;
	  },
	  parse: function parse(value) {
	    return value;
	  }
	}, _temp8)) || _class12);
	
	function toSameLength(value, keys, uidGenerator) {
	  if (value.length === keys.length) {
	    return keys;
	  }
	  var ret = [];
	  for (var i = 0, len = value.length; i < len; i++) {
	    ret[i] = keys[i] || uidGenerator.next();
	  }
	  return ret;
	}
	
	var List = exports.List = (_dec12 = decorators.templates, _dec12(_class14 = (_temp9 = _class15 = function (_Component7) {
	  _inherits(List, _Component7);
	
	  function List(props) {
	    _classCallCheck(this, List);
	
	    var _this10 = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));
	
	    _this10.onChange = function (value, keys, path, kind) {
	      var allkeys = toSameLength(value, keys, _this10.props.ctx.uidGenerator);
	      _this10.setState({ value: value, keys: allkeys, isPristine: false }, function () {
	        _this10.props.onChange(value, path, kind);
	      });
	    };
	
	    _this10.addItem = function (evt) {
	      evt.preventDefault();
	      var value = _this10.state.value.concat(undefined);
	      var keys = _this10.state.keys.concat(_this10.props.ctx.uidGenerator.next());
	      _this10.onChange(value, keys, _this10.props.ctx.path.concat(value.length - 1), 'add');
	    };
	
	    _this10.state.keys = _this10.state.value.map(function () {
	      return props.ctx.uidGenerator.next();
	    });
	    return _this10;
	  }
	
	  _createClass(List, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(props) {
	      if (props.type !== this.props.type) {
	        this.typeInfo = (0, _util.getTypeInfo)(props.type);
	      }
	      var value = this.getTransformer().format(props.value);
	      this.setState({
	        value: value,
	        keys: toSameLength(value, this.state.keys, props.ctx.uidGenerator)
	      });
	    }
	  }, {
	    key: 'isValueNully',
	    value: function isValueNully() {
	      return this.state.value.length === 0;
	    }
	  }, {
	    key: 'removeErrors',
	    value: function removeErrors() {
	      var _this11 = this;
	
	      this.setState({ hasError: false });
	      Object.keys(this.refs).forEach(function (ref) {
	        return _this11.refs[ref].removeErrors();
	      });
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      var value = [];
	      for (var i = 0, len = this.state.value.length; i < len; i++) {
	        value.push(this.refs[i].getValue());
	      }
	      return this.getTransformer().parse(value);
	    }
	  }, {
	    key: 'validate',
	    value: function validate() {
	      var value = [];
	      var errors = [];
	      var hasError = false;
	      var result = void 0;
	
	      if (this.typeInfo.isMaybe && this.isValueNully()) {
	        this.removeErrors();
	        return new _tcombValidation2.default.ValidationResult({ errors: [], value: null });
	      }
	
	      for (var i = 0, len = this.state.value.length; i < len; i++) {
	        result = this.refs[i].validate();
	        errors = errors.concat(result.errors);
	        value.push(result.value);
	      }
	
	      // handle subtype
	      if (this.typeInfo.isSubtype && errors.length === 0) {
	        result = _tcombValidation2.default.validate(value, this.props.type, this.getValidationOptions());
	        hasError = !result.isValid();
	        errors = errors.concat(result.errors);
	      }
	
	      this.setState({ hasError: hasError });
	      return new _tcombValidation2.default.ValidationResult({ errors: errors, value: value });
	    }
	  }, {
	    key: 'onItemChange',
	    value: function onItemChange(itemIndex, itemValue, path, kind) {
	      var value = this.state.value.slice();
	      value[itemIndex] = itemValue;
	      this.onChange(value, this.state.keys, path, kind);
	    }
	  }, {
	    key: 'removeItem',
	    value: function removeItem(i, evt) {
	      evt.preventDefault();
	      var value = this.state.value.slice();
	      value.splice(i, 1);
	      var keys = this.state.keys.slice();
	      keys.splice(i, 1);
	      this.onChange(value, keys, this.props.ctx.path.concat(i), 'remove');
	    }
	  }, {
	    key: 'moveUpItem',
	    value: function moveUpItem(i, evt) {
	      evt.preventDefault();
	      if (i > 0) {
	        this.onChange((0, _util.move)(this.state.value.slice(), i, i - 1), (0, _util.move)(this.state.keys.slice(), i, i - 1), this.props.ctx.path.concat(i), 'moveUp');
	      }
	    }
	  }, {
	    key: 'moveDownItem',
	    value: function moveDownItem(i, evt) {
	      evt.preventDefault();
	      if (i < this.state.value.length - 1) {
	        this.onChange((0, _util.move)(this.state.value.slice(), i, i + 1), (0, _util.move)(this.state.keys.slice(), i, i + 1), this.props.ctx.path.concat(i), 'moveDown');
	      }
	    }
	  }, {
	    key: 'getTemplate',
	    value: function getTemplate() {
	      return this.props.options.template || this.getTemplates().list;
	    }
	  }, {
	    key: 'getItems',
	    value: function getItems() {
	      var _this12 = this;
	
	      var _props2 = this.props,
	          options = _props2.options,
	          ctx = _props2.ctx;
	
	      var auto = this.getAuto();
	      var i18n = this.getI18n();
	      var config = this.getConfig();
	      var templates = this.getTemplates();
	      var value = this.state.value;
	      return value.map(function (itemValue, i) {
	        var itemType = getType(_this12.typeInfo.innerType.meta.type, itemValue);
	        var itemOptions = getOptions(options.item, noobj, itemValue);
	        var ItemComponent = getFormComponent(itemType, itemOptions);
	        var buttons = [];
	        if (!options.disableRemove) {
	          buttons.push({
	            type: 'remove',
	            label: i18n.remove,
	            click: _this12.removeItem.bind(_this12, i)
	          });
	        }
	        if (!options.disableOrder) {
	          buttons.push({
	            type: 'move-up',
	            label: i18n.up,
	            click: _this12.moveUpItem.bind(_this12, i)
	          });
	        }
	        if (!options.disableOrder) {
	          buttons.push({
	            type: 'move-down',
	            label: i18n.down,
	            click: _this12.moveDownItem.bind(_this12, i)
	          });
	        }
	        return {
	          input: _react2.default.createElement(ItemComponent, {
	            ref: i,
	            type: itemType,
	            options: itemOptions,
	            value: itemValue,
	            onChange: _this12.onItemChange.bind(_this12, i),
	            ctx: {
	              context: ctx.context,
	              uidGenerator: ctx.uidGenerator,
	              auto: auto,
	              config: config,
	              i18n: i18n,
	              name: ctx.name ? ctx.name + '[' + i + ']' : String(i),
	              templates: templates,
	              path: ctx.path.concat(i)
	            }
	          }),
	          key: _this12.state.keys[i],
	          buttons: buttons
	        };
	      });
	    }
	  }, {
	    key: 'getLocals',
	    value: function getLocals() {
	      var options = this.props.options;
	      var i18n = this.getI18n();
	      var locals = _get(List.prototype.__proto__ || Object.getPrototypeOf(List.prototype), 'getLocals', this).call(this);
	      locals.add = options.disableAdd ? null : {
	        type: 'add',
	        label: i18n.add,
	        click: this.addItem
	      };
	      locals.items = this.getItems();
	      locals.className = options.className;
	      locals.isSubmitted = this.props.isSubmitted || false;
	      return locals;
	    }
	  }]);
	
	  return List;
	}(Component), _class15.transformer = {
	  format: function format(value) {
	    return Nil.is(value) ? noarr : value;
	  },
	  parse: function parse(value) {
	    return value;
	  }
	}, _temp9)) || _class14);
	
	var Form = exports.Form = function (_React$Component2) {
	  _inherits(Form, _React$Component2);
	
	  function Form() {
	    _classCallCheck(this, Form);
	
	    return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
	  }
	
	  _createClass(Form, [{
	    key: 'validate',
	    value: function validate() {
	      return this.refs.input.validate();
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      var result = this.validate();
	      return result.isValid() ? result.value : null;
	    }
	  }, {
	    key: 'getComponent',
	    value: function getComponent(path) {
	      var points = _tcombValidation2.default.String.is(path) ? path.split('.') : path;
	      return points.reduce(function (input, name) {
	        return input.refs[name];
	      }, this.refs.input);
	    }
	  }, {
	    key: 'getUIDGenerator',
	    value: function getUIDGenerator() {
	      this.uidGenerator = this.uidGenerator || new _util.UIDGenerator(this._reactInternalInstance ? this._reactInternalInstance._rootNodeID : '');
	      return this.uidGenerator;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var i18n = Form.i18n,
	          templates = Form.templates;
	
	
	      if (true) {
	        assert(_tcombValidation2.default.isType(this.props.type), '[' + SOURCE + '] missing required prop type');
	        assert(_tcombValidation2.default.maybe(_tcombValidation2.default.Object).is(this.props.options) || _tcombValidation2.default.Function.is(this.props.options), '[' + SOURCE + '] prop options, if specified, must be an object or a function returning an object');
	        assert(_tcombValidation2.default.Object.is(templates), '[' + SOURCE + '] missing templates config');
	        assert(_tcombValidation2.default.Object.is(i18n), '[' + SOURCE + '] missing i18n config');
	      }
	
	      var value = this.props.value;
	      var type = getType(this.props.type, value);
	      var options = getOptions(this.props.options, noobj, value);
	
	      // this is in the render method because I need this._reactInternalInstance
	      var uidGenerator = this.getUIDGenerator();
	
	      return _react2.default.createElement(getFormComponent(type, options), {
	        ref: 'input',
	        type: type,
	        options: options,
	        value: value,
	        onChange: this.props.onChange || noop,
	        isSubmitted: this.props.isSubmitted || false,
	        ctx: this.props.ctx || {
	          context: this.props.context,
	          uidGenerator: uidGenerator,
	          auto: 'labels',
	          templates: templates,
	          i18n: i18n,
	          path: []
	        }
	      });
	    }
	  }]);
	
	  return Form;
	}(_react2.default.Component);

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_52__;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.UIDGenerator = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.getOptionsOfEnum = getOptionsOfEnum;
	exports.getTypeInfo = getTypeInfo;
	exports.humanize = humanize;
	exports.merge = merge;
	exports.move = move;
	
	var _tcombValidation = __webpack_require__(2);
	
	var _tcombValidation2 = _interopRequireDefault(_tcombValidation);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function getOptionsOfEnum(type) {
	  var enums = type.meta.map;
	  return Object.keys(enums).map(function (value) {
	    return {
	      value: value,
	      text: enums[value]
	    };
	  });
	}
	
	function getTypeInfo(type) {
	  var innerType = type;
	  var isMaybe = false;
	  var isSubtype = false;
	  var kind = void 0;
	  var innerGetValidationErrorMessage = void 0;
	
	  while (innerType) {
	    kind = innerType.meta.kind;
	    if (_tcombValidation2.default.Function.is(innerType.getValidationErrorMessage)) {
	      innerGetValidationErrorMessage = innerType.getValidationErrorMessage;
	    }
	    if (kind === 'maybe') {
	      isMaybe = true;
	      innerType = innerType.meta.type;
	      continue;
	    }
	    if (kind === 'subtype') {
	      isSubtype = true;
	      innerType = innerType.meta.type;
	      continue;
	    }
	    break;
	  }
	
	  var getValidationErrorMessage = innerGetValidationErrorMessage ? function (value, path, context) {
	    var result = _tcombValidation2.default.validate(value, type, { path: path, context: context });
	    if (!result.isValid()) {
	      for (var i = 0, len = result.errors.length; i < len; i++) {
	        if (_tcombValidation2.default.Function.is(result.errors[i].expected.getValidationErrorMessage)) {
	          return result.errors[i].message;
	        }
	      }
	      return innerGetValidationErrorMessage(value, path, context);
	    }
	  } : undefined;
	
	  return {
	    type: type,
	    isMaybe: isMaybe,
	    isSubtype: isSubtype,
	    innerType: innerType,
	    getValidationErrorMessage: getValidationErrorMessage
	  };
	}
	
	// thanks to https://github.com/epeli/underscore.string
	
	function underscored(s) {
	  return s.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
	}
	
	function capitalize(s) {
	  return s.charAt(0).toUpperCase() + s.slice(1);
	}
	
	function humanize(s) {
	  return capitalize(underscored(s).replace(/_id$/, '').replace(/_/g, ' '));
	}
	
	function merge(a, b) {
	  return (0, _tcombValidation.mixin)((0, _tcombValidation.mixin)({}, a), b, true);
	}
	
	function move(arr, fromIndex, toIndex) {
	  var element = arr.splice(fromIndex, 1)[0];
	  arr.splice(toIndex, 0, element);
	  return arr;
	}
	
	var UIDGenerator = exports.UIDGenerator = function () {
	  function UIDGenerator(seed) {
	    _classCallCheck(this, UIDGenerator);
	
	    this.seed = seed;
	    this.counter = 0;
	  }
	
	  _createClass(UIDGenerator, [{
	    key: 'next',
	    value: function next() {
	      return this.seed + this.counter++;
	    }
	  }]);
	
	  return UIDGenerator;
	}();

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _checkbox = __webpack_require__(55);
	
	var _checkbox2 = _interopRequireDefault(_checkbox);
	
	var _date = __webpack_require__(62);
	
	var _date2 = _interopRequireDefault(_date);
	
	var _list = __webpack_require__(64);
	
	var _list2 = _interopRequireDefault(_list);
	
	var _radio = __webpack_require__(67);
	
	var _radio2 = _interopRequireDefault(_radio);
	
	var _select = __webpack_require__(68);
	
	var _select2 = _interopRequireDefault(_select);
	
	var _struct = __webpack_require__(69);
	
	var _struct2 = _interopRequireDefault(_struct);
	
	var _textbox = __webpack_require__(70);
	
	var _textbox2 = _interopRequireDefault(_textbox);
	
	exports['default'] = {
	  checkbox: _checkbox2['default'],
	  date: _date2['default'],
	  list: _list2['default'],
	  radio: _radio2['default'],
	  select: _select2['default'],
	  struct: _struct2['default'],
	  textbox: _textbox2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _tcomb = __webpack_require__(3);
	
	var _tcomb2 = _interopRequireDefault(_tcomb);
	
	var _classnames = __webpack_require__(56);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _Breakpoints = __webpack_require__(57);
	
	var _Breakpoints2 = _interopRequireDefault(_Breakpoints);
	
	var _getError = __webpack_require__(58);
	
	var _getError2 = _interopRequireDefault(_getError);
	
	var _getHelp = __webpack_require__(59);
	
	var _getHelp2 = _interopRequireDefault(_getHelp);
	
	var _renderFormGroup = __webpack_require__(60);
	
	var _renderFormGroup2 = _interopRequireDefault(_renderFormGroup);
	
	var CheckboxConfig = _tcomb2['default'].struct({
	  horizontal: _tcomb2['default'].maybe(_Breakpoints2['default'])
	}, 'CheckboxConfig');
	
	function create() {
	  var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  function checkbox(locals) {
	    locals.config = checkbox.getConfig(locals);
	
	    var children = locals.config.horizontal ? checkbox.renderHorizontal(locals) : checkbox.renderVertical(locals);
	
	    return checkbox.renderFormGroup(children, locals);
	  }
	
	  checkbox.getConfig = overrides.getConfig || function getConfig(locals) {
	    return new CheckboxConfig(locals.config || {});
	  };
	
	  checkbox.getAttrs = overrides.getAttrs || function getAttrs(locals) {
	    var attrs = _tcomb2['default'].mixin({}, locals.attrs);
	    attrs.type = 'checkbox';
	    attrs.disabled = locals.disabled;
	    attrs.checked = locals.value;
	    attrs.onChange = function (evt) {
	      return locals.onChange(evt.target.checked);
	    };
	    if (locals.help) {
	      attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
	    }
	    return attrs;
	  };
	
	  checkbox.renderCheckbox = overrides.renderCheckbox || function renderCheckbox(locals) {
	    var attrs = checkbox.getAttrs(locals);
	    var className = {
	      checkbox: true,
	      disabled: attrs.disabled
	    };
	    return _react2['default'].createElement(
	      'div',
	      { className: _classnames2['default'](className) },
	      _react2['default'].createElement(
	        'label',
	        { htmlFor: attrs.id },
	        _react2['default'].createElement('input', attrs),
	        ' ',
	        locals.label
	      )
	    );
	  };
	
	  checkbox.renderError = overrides.renderError || function renderError(locals) {
	    return _getError2['default'](locals);
	  };
	
	  checkbox.renderHelp = overrides.renderHelp || function renderHelp(locals) {
	    return _getHelp2['default'](locals);
	  };
	
	  checkbox.renderVertical = overrides.renderVertical || function renderVertical(locals) {
	    return [checkbox.renderCheckbox(locals), checkbox.renderError(locals), checkbox.renderHelp(locals)];
	  };
	
	  checkbox.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
	    var className = locals.config.horizontal.getOffsetClassName();
	    return _react2['default'].createElement(
	      'div',
	      { className: _classnames2['default'](className) },
	      checkbox.renderCheckbox(locals),
	      checkbox.renderError(locals),
	      checkbox.renderHelp(locals)
	    );
	  };
	
	  checkbox.renderFormGroup = overrides.renderFormGroup || _renderFormGroup2['default'];
	
	  checkbox.clone = function clone() {
	    var newOverrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    return create(_extends({}, overrides, newOverrides));
	  };
	
	  return checkbox;
	}
	
	exports['default'] = create();
	module.exports = exports['default'];

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */
	
	(function () {
		'use strict';
	
		var hasOwn = {}.hasOwnProperty;
	
		function classNames () {
			var classes = [];
	
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;
	
				var argType = typeof arg;
	
				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}
	
			return classes.join(' ');
		}
	
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _tcomb = __webpack_require__(3);
	
	var _tcomb2 = _interopRequireDefault(_tcomb);
	
	var Positive = _tcomb2['default'].refinement(_tcomb2['default'].Number, function (n) {
	  return n % 1 === 0 && n >= 0;
	}, 'Positive');
	
	var Cols = _tcomb2['default'].tuple([Positive, Positive], 'Cols');
	
	var Breakpoints = _tcomb2['default'].struct({
	  xs: _tcomb2['default'].maybe(Cols),
	  sm: _tcomb2['default'].maybe(Cols),
	  md: _tcomb2['default'].maybe(Cols),
	  lg: _tcomb2['default'].maybe(Cols)
	}, 'Breakpoints');
	
	function getBreakpointsClassName(breakpoints) {
	  var className = {};
	  for (var size in breakpoints) {
	    if (breakpoints.hasOwnProperty(size)) {
	      className['col-' + size + '-' + breakpoints[size]] = true;
	    }
	  }
	  return className;
	}
	
	function getOffsetsClassName(breakpoints) {
	  var className = {};
	  for (var size in breakpoints) {
	    if (breakpoints.hasOwnProperty(size)) {
	      className['col-' + size + '-offset-' + (12 - breakpoints[size])] = true;
	    }
	  }
	  return className;
	}
	
	Breakpoints.prototype.getBreakpoints = function getBreakpoints(colIndex) {
	  var breakpoints = {};
	  for (var size in this) {
	    if (this.hasOwnProperty(size) && !_tcomb2['default'].Nil.is(this[size])) {
	      breakpoints[size] = this[size][colIndex];
	    }
	  }
	  return breakpoints;
	};
	
	Breakpoints.prototype.getLabelClassName = function getLabelClassName() {
	  return getBreakpointsClassName(this.getBreakpoints(0));
	};
	
	Breakpoints.prototype.getInputClassName = function getInputClassName() {
	  return getBreakpointsClassName(this.getBreakpoints(1));
	};
	
	Breakpoints.prototype.getOffsetClassName = function getOffsetClassName() {
	  return _tcomb2['default'].mixin(getOffsetsClassName(this.getBreakpoints(1)), getBreakpointsClassName(this.getBreakpoints(1)));
	};
	
	exports['default'] = Breakpoints;
	module.exports = exports['default'];

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = getError;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	function getError(_ref) {
	  var hasError = _ref.hasError;
	  var error = _ref.error;
	
	  if (hasError && error) {
	    return _react2["default"].createElement(
	      "span",
	      { className: "help-block error-block" },
	      error
	    );
	  }
	}
	
	module.exports = exports["default"];

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = getError;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	function getError(_ref) {
	  var help = _ref.help;
	  var attrs = _ref.attrs;
	
	  if (help) {
	    return _react2["default"].createElement(
	      "span",
	      { className: "help-block", id: attrs.id + "-tip'" },
	      help
	    );
	  }
	}
	
	module.exports = exports["default"];

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = renderFormGroup;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _FormGroup = __webpack_require__(61);
	
	var _FormGroup2 = _interopRequireDefault(_FormGroup);
	
	function renderFormGroup(children, _ref) {
	  var path = _ref.path;
	  var hasError = _ref.hasError;
	
	  var className = 'form-group-depth-' + path.length;
	  if (path.length > 0) {
	    className += ' form-group-' + path.join('-');
	  }
	  return _react2['default'].createElement.apply(null, [_FormGroup2['default'], { className: className, hasError: hasError }].concat(children));
	}
	
	module.exports = exports['default'];

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = FormGroup;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _classnames = __webpack_require__(56);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	function FormGroup(props) {
	  var className = {
	    'form-group': true,
	    'has-error': props.hasError
	  };
	  if (props.className) {
	    className[props.className] = true;
	  }
	  return _react2['default'].createElement(
	    'div',
	    { className: _classnames2['default'](className) },
	    props.children
	  );
	}
	
	module.exports = exports['default'];

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _tcomb = __webpack_require__(3);
	
	var _tcomb2 = _interopRequireDefault(_tcomb);
	
	var _classnames = __webpack_require__(56);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _Breakpoints = __webpack_require__(57);
	
	var _Breakpoints2 = _interopRequireDefault(_Breakpoints);
	
	var _getLabel = __webpack_require__(63);
	
	var _getLabel2 = _interopRequireDefault(_getLabel);
	
	var _getError = __webpack_require__(58);
	
	var _getError2 = _interopRequireDefault(_getError);
	
	var _getHelp = __webpack_require__(59);
	
	var _getHelp2 = _interopRequireDefault(_getHelp);
	
	var _renderFormGroup = __webpack_require__(60);
	
	var _renderFormGroup2 = _interopRequireDefault(_renderFormGroup);
	
	var DateConfig = _tcomb2['default'].struct({
	  horizontal: _tcomb2['default'].maybe(_Breakpoints2['default'])
	}, 'DateConfig');
	
	function range(n) {
	  var result = [];
	  for (var i = 1; i <= n; i++) {
	    result.push(i);
	  }
	  return result;
	}
	
	function padLeft(x, len) {
	  var str = String(x);
	  var times = len - str.length;
	  for (var i = 0; i < times; i++) {
	    str = '0' + str;
	  }
	  return str;
	}
	
	function toOption(value, text) {
	  return _react2['default'].createElement(
	    'option',
	    { key: value, value: value + '' },
	    text
	  );
	}
	
	var nullOption = [toOption('', '-')];
	
	var days = nullOption.concat(range(31).map(function (i) {
	  return toOption(i, padLeft(i, 2));
	}));
	
	var months = nullOption.concat(range(12).map(function (i) {
	  return toOption(i - 1, padLeft(i, 2));
	}));
	
	function create() {
	  var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  function date(locals) {
	    locals.config = date.getConfig(locals);
	    locals.attrs = date.getAttrs(locals);
	
	    var children = locals.config.horizontal ? date.renderHorizontal(locals) : date.renderVertical(locals);
	
	    return date.renderFormGroup(children, locals);
	  }
	
	  date.getConfig = overrides.getConfig || function getConfig(locals) {
	    return new DateConfig(locals.config || {});
	  };
	
	  date.getAttrs = overrides.getAttrs || function getAttrs(locals) {
	    return _tcomb2['default'].mixin({}, locals.attrs);
	  };
	
	  date.renderLabel = overrides.renderLabel || function renderLabel(locals) {
	    return _getLabel2['default']({
	      label: locals.label,
	      breakpoints: locals.config.horizontal
	    });
	  };
	
	  date.renderError = overrides.renderError || function renderError(locals) {
	    return _getError2['default'](locals);
	  };
	
	  date.renderHelp = overrides.renderHelp || function renderHelp(locals) {
	    return _getHelp2['default'](locals);
	  };
	
	  date.renderDate = overrides.renderDate || function renderDate(locals) {
	    var value = locals.value = locals.value.slice();
	
	    function onDayChange(evt) {
	      value[2] = evt.target.value === '-' ? null : evt.target.value;
	      locals.onChange(value);
	    }
	
	    function onMonthChange(evt) {
	      value[1] = evt.target.value === '-' ? null : evt.target.value;
	      locals.onChange(value);
	    }
	
	    function onYearChange(evt) {
	      value[0] = evt.target.value.trim() === '' ? null : evt.target.value.trim();
	      locals.onChange(value);
	    }
	
	    var parts = {
	      D: _react2['default'].createElement(
	        'li',
	        { key: 'D' },
	        _react2['default'].createElement(
	          'select',
	          { disabled: locals.disabled, className: 'form-control', value: value[2], onChange: onDayChange },
	          days
	        )
	      ),
	      M: _react2['default'].createElement(
	        'li',
	        { key: 'M' },
	        _react2['default'].createElement(
	          'select',
	          { disabled: locals.disabled, className: 'form-control', value: value[1], onChange: onMonthChange },
	          months
	        )
	      ),
	      YY: _react2['default'].createElement(
	        'li',
	        { key: 'YY' },
	        _react2['default'].createElement('input', { type: 'text', size: '5', disabled: locals.disabled, className: 'form-control', value: value[0], onChange: onYearChange })
	      )
	    };
	
	    return _react2['default'].createElement(
	      'ul',
	      { className: 'nav nav-pills' },
	      locals.order.map(function (id) {
	        return parts[id];
	      })
	    );
	  };
	
	  date.renderVertical = overrides.renderVertical || function renderVertical(locals) {
	    return [date.renderLabel(locals), date.renderDate(locals), date.renderError(locals), date.renderHelp(locals)];
	  };
	
	  date.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
	    var label = date.renderLabel(locals);
	    var className = label ? locals.config.horizontal.getInputClassName() : locals.config.horizontal.getOffsetClassName();
	    return [label, _react2['default'].createElement(
	      'div',
	      { className: _classnames2['default'](className) },
	      date.renderDate(locals),
	      date.renderError(locals),
	      date.renderHelp(locals)
	    )];
	  };
	
	  date.renderFormGroup = overrides.renderFormGroup || _renderFormGroup2['default'];
	
	  date.clone = function clone() {
	    var newOverrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    return create(_extends({}, overrides, newOverrides));
	  };
	
	  return date;
	}
	
	exports['default'] = create();
	module.exports = exports['default'];

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = getLabel;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _classnames = __webpack_require__(56);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	function getLabel(_ref) {
	  var label = _ref.label;
	  var breakpoints = _ref.breakpoints;
	  var htmlFor = _ref.htmlFor;
	  var id = _ref.id;
	
	  if (label) {
	    var className = breakpoints ? breakpoints.getLabelClassName() : {};
	    className['control-label'] = true;
	    return _react2['default'].createElement(
	      'label',
	      { htmlFor: htmlFor, id: id, className: _classnames2['default'](className) },
	      label
	    );
	  }
	}
	
	module.exports = exports['default'];

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _classnames = __webpack_require__(56);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _getAlert = __webpack_require__(65);
	
	var _getAlert2 = _interopRequireDefault(_getAlert);
	
	var _renderFieldset = __webpack_require__(66);
	
	var _renderFieldset2 = _interopRequireDefault(_renderFieldset);
	
	function getBreakpoints(breakpoints) {
	  var className = {};
	  for (var size in breakpoints) {
	    if (breakpoints.hasOwnProperty(size)) {
	      className['col-' + size + '-' + breakpoints[size]] = true;
	    }
	  }
	  return className;
	}
	
	function getCol(breakpoints, content) {
	  var className = _classnames2['default'](getBreakpoints(breakpoints));
	  return _react2['default'].createElement(
	    'div',
	    { className: className },
	    content
	  );
	}
	
	function create() {
	  var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  function list(locals) {
	    var children = [];
	
	    if (locals.help) {
	      children.push(list.renderHelp(locals));
	    }
	
	    if (locals.error && locals.hasError) {
	      children.push(list.renderError(locals));
	    }
	
	    children = children.concat(locals.items.map(function (item) {
	      return item.buttons.length === 0 ? list.renderRowWithoutButtons(item, locals) : list.renderRow(item, locals);
	    }));
	
	    if (locals.add) {
	      children.push(list.renderAddButton(locals));
	    }
	
	    return list.renderFieldset(children, locals);
	  }
	
	  list.renderHelp = overrides.renderHelp || function renderHelp(locals) {
	    return _getAlert2['default']('info', locals.help);
	  };
	
	  list.renderError = overrides.renderError || function renderError(locals) {
	    return _getAlert2['default']('danger', locals.error);
	  };
	
	  list.renderRowWithoutButtons = overrides.renderRowWithoutButtons || function renderRowWithoutButtons(item /* , locals*/) {
	    return _react2['default'].createElement(
	      'div',
	      { className: 'row', key: item.key },
	      getCol({ xs: 12 }, item.input)
	    );
	  };
	
	  list.renderRowButton = overrides.renderRowButton || function renderRowButton(button) {
	    return _react2['default'].createElement(
	      'button',
	      { key: button.type, type: 'button', className: 'btn btn-default btn-' + button.type, onClick: button.click },
	      button.label
	    );
	  };
	
	  list.renderButtonGroup = overrides.renderButtonGroup || function renderButtonGroup(buttons /* , locals*/) {
	    return _react2['default'].createElement(
	      'div',
	      { className: 'btn-group' },
	      buttons.map(list.renderRowButton)
	    );
	  };
	
	  list.renderRow = overrides.renderRow || function renderRow(row, locals) {
	    return _react2['default'].createElement(
	      'div',
	      { className: 'row' },
	      getCol({ sm: 8, xs: 6 }, row.input),
	      getCol({ sm: 4, xs: 6 }, list.renderButtonGroup(row.buttons, locals))
	    );
	  };
	
	  list.renderAddButton = overrides.renderAddButton || function renderAddButton(locals) {
	    var button = locals.add;
	    return _react2['default'].createElement(
	      'div',
	      { className: 'row' },
	      _react2['default'].createElement(
	        'div',
	        { className: 'col-lg-12' },
	        _react2['default'].createElement(
	          'div',
	          { style: { marginBottom: '15px' } },
	          _react2['default'].createElement(
	            'button',
	            { type: 'button', className: 'btn btn-default btn-' + button.type, onClick: button.click },
	            button.label
	          )
	        )
	      )
	    );
	  };
	
	  list.renderFieldset = overrides.renderFieldset || _renderFieldset2['default'];
	
	  list.clone = function clone() {
	    var newOverrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    return create(_extends({}, overrides, newOverrides));
	  };
	
	  return list;
	}
	
	exports['default'] = create();
	module.exports = exports['default'];

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = getAlert;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	function getAlert(type, message) {
	  return _react2['default'].createElement(
	    'div',
	    { className: 'alert alert-' + type },
	    message
	  );
	}
	
	module.exports = exports['default'];

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = renderFieldset;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _classnames = __webpack_require__(56);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	function getClassName(locals) {
	  var len = locals.path.length;
	  var className = 'fieldset fieldset-depth-' + len;
	  if (len > 0) {
	    className += ' fieldset-' + locals.path.join('-');
	  }
	  if (locals.className) {
	    className += ' ' + _classnames2['default'](locals.className);
	  }
	  return className;
	}
	
	function renderFieldset(children, locals) {
	  var legend = locals.label ? _react2['default'].createElement(
	    'legend',
	    null,
	    locals.label
	  ) : null;
	  var props = {
	    className: getClassName(locals),
	    disabled: locals.disabled
	  };
	  return _react2['default'].createElement.apply(null, ['fieldset', props, legend].concat(children));
	}
	
	module.exports = exports['default'];

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _tcomb = __webpack_require__(3);
	
	var _tcomb2 = _interopRequireDefault(_tcomb);
	
	var _classnames = __webpack_require__(56);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _Breakpoints = __webpack_require__(57);
	
	var _Breakpoints2 = _interopRequireDefault(_Breakpoints);
	
	var _getLabel = __webpack_require__(63);
	
	var _getLabel2 = _interopRequireDefault(_getLabel);
	
	var _getError = __webpack_require__(58);
	
	var _getError2 = _interopRequireDefault(_getError);
	
	var _getHelp = __webpack_require__(59);
	
	var _getHelp2 = _interopRequireDefault(_getHelp);
	
	var _renderFormGroup = __webpack_require__(60);
	
	var _renderFormGroup2 = _interopRequireDefault(_renderFormGroup);
	
	var RadioConfig = _tcomb2['default'].struct({
	  horizontal: _tcomb2['default'].maybe(_Breakpoints2['default'])
	}, 'RadioConfig');
	
	function getRadio(attrs, text, key) {
	  var className = _classnames2['default']({
	    radio: true,
	    disabled: attrs.disabled
	  });
	  return _react2['default'].createElement(
	    'div',
	    { key: key, className: className },
	    _react2['default'].createElement(
	      'label',
	      { htmlFor: attrs.id },
	      _react2['default'].createElement('input', attrs),
	      ' ',
	      text
	    )
	  );
	}
	
	function create() {
	  var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  function radio(locals) {
	    locals.config = radio.getConfig(locals);
	
	    var children = locals.config.horizontal ? radio.renderHorizontal(locals) : radio.renderVertical(locals);
	
	    return radio.renderFormGroup(children, locals);
	  }
	
	  radio.getConfig = overrides.getConfig || function getConfig(locals) {
	    return new RadioConfig(locals.config || {});
	  };
	
	  radio.renderRadios = overrides.renderRadios || function renderRadios(locals) {
	    var id = locals.attrs.id;
	    var onChange = function onChange(evt) {
	      return locals.onChange(evt.target.value);
	    };
	    return locals.options.map(function (option, i) {
	      var attrs = _tcomb2['default'].mixin({}, locals.attrs);
	      attrs.type = 'radio';
	      attrs.checked = option.value === locals.value;
	      attrs.disabled = locals.disabled;
	      attrs.value = option.value;
	      attrs.autoFocus = attrs.autoFocus && i === 0;
	      attrs.id = id + '_' + i;
	      attrs['aria-describedby'] = attrs['aria-describedby'] || (locals.label ? id : null);
	      attrs.onChange = onChange;
	      return getRadio(attrs, option.text, option.value);
	    });
	  };
	
	  radio.renderLabel = overrides.renderLabel || function renderLabel(locals) {
	    return _getLabel2['default']({
	      label: locals.label,
	      htmlFor: locals.attrs.id,
	      breakpoints: locals.config.horizontal
	    });
	  };
	
	  radio.renderError = overrides.renderError || function renderError(locals) {
	    return _getError2['default'](locals);
	  };
	
	  radio.renderHelp = overrides.renderHelp || function renderHelp(locals) {
	    return _getHelp2['default'](locals);
	  };
	
	  radio.renderVertical = overrides.renderVertical || function renderVertical(locals) {
	    return [radio.renderLabel(locals), radio.renderRadios(locals), radio.renderError(locals), radio.renderHelp(locals)];
	  };
	
	  radio.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
	    var label = radio.renderLabel(locals);
	    var className = label ? locals.config.horizontal.getInputClassName() : locals.config.horizontal.getOffsetClassName();
	    return [label, _react2['default'].createElement(
	      'div',
	      { className: _classnames2['default'](className) },
	      radio.renderRadios(locals),
	      radio.renderError(locals),
	      radio.renderHelp(locals)
	    )];
	  };
	
	  radio.renderFormGroup = overrides.renderFormGroup || _renderFormGroup2['default'];
	
	  radio.clone = function clone() {
	    var newOverrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    return create(_extends({}, overrides, newOverrides));
	  };
	
	  return radio;
	}
	
	exports['default'] = create();
	module.exports = exports['default'];

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _tcomb = __webpack_require__(3);
	
	var _tcomb2 = _interopRequireDefault(_tcomb);
	
	var _classnames = __webpack_require__(56);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _Breakpoints = __webpack_require__(57);
	
	var _Breakpoints2 = _interopRequireDefault(_Breakpoints);
	
	var _getLabel = __webpack_require__(63);
	
	var _getLabel2 = _interopRequireDefault(_getLabel);
	
	var _getError = __webpack_require__(58);
	
	var _getError2 = _interopRequireDefault(_getError);
	
	var _getHelp = __webpack_require__(59);
	
	var _getHelp2 = _interopRequireDefault(_getHelp);
	
	var _renderFormGroup = __webpack_require__(60);
	
	var _renderFormGroup2 = _interopRequireDefault(_renderFormGroup);
	
	var SelectConfig = _tcomb2['default'].struct({
	  horizontal: _tcomb2['default'].maybe(_Breakpoints2['default'])
	}, 'SelectConfig');
	
	function getOption(props) {
	  return _react2['default'].createElement(
	    'option',
	    { disabled: props.disabled, value: props.value, key: props.value },
	    props.text
	  );
	}
	
	function getOptGroup(props) {
	  var options = props.options.map(getOption);
	  return _react2['default'].createElement(
	    'optgroup',
	    { disabled: props.disabled, label: props.label, key: props.label },
	    options
	  );
	}
	
	function create() {
	  var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  function select(locals) {
	    locals.config = select.getConfig(locals);
	    locals.attrs = select.getAttrs(locals);
	
	    var children = locals.config.horizontal ? select.renderHorizontal(locals) : select.renderVertical(locals);
	
	    return select.renderFormGroup(children, locals);
	  }
	
	  select.getConfig = overrides.getConfig || function getConfig(locals) {
	    return new SelectConfig(locals.config || {});
	  };
	
	  select.getAttrs = overrides.getAttrs || function getAttrs(locals) {
	    var attrs = _tcomb2['default'].mixin({}, locals.attrs);
	    attrs.className = _classnames2['default'](attrs.className);
	    attrs.className += (attrs.className ? ' ' : '') + 'form-control';
	    attrs.multiple = locals.isMultiple;
	    attrs.disabled = locals.disabled;
	    attrs.value = locals.value;
	    attrs.onChange = function (evt) {
	      var value = locals.isMultiple ? Array.prototype.slice.call(evt.target.options).filter(function (option) {
	        return option.selected;
	      }).map(function (option) {
	        return option.value;
	      }) : evt.target.value;
	      locals.onChange(value);
	    };
	    if (locals.help) {
	      attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
	    }
	    return attrs;
	  };
	
	  select.renderOptions = overrides.renderOptions || function renderOptions(locals) {
	    return locals.options.map(function (x) {
	      return x.label ? getOptGroup(x) : getOption(x);
	    });
	  };
	
	  select.renderSelect = overrides.renderSelect || function renderSelect(locals) {
	    return _react2['default'].createElement(
	      'select',
	      locals.attrs,
	      select.renderOptions(locals)
	    );
	  };
	
	  select.renderLabel = overrides.renderLabel || function renderLabel(locals) {
	    return _getLabel2['default']({
	      label: locals.label,
	      htmlFor: locals.attrs.id,
	      breakpoints: locals.config.horizontal
	    });
	  };
	
	  select.renderError = overrides.renderError || function renderError(locals) {
	    return _getError2['default'](locals);
	  };
	
	  select.renderHelp = overrides.renderHelp || function renderHelp(locals) {
	    return _getHelp2['default'](locals);
	  };
	
	  select.renderVertical = overrides.renderVertical || function renderVertical(locals) {
	    return [select.renderLabel(locals), select.renderSelect(locals), select.renderError(locals), select.renderHelp(locals)];
	  };
	
	  select.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
	    var label = select.renderLabel(locals);
	    var className = label ? locals.config.horizontal.getInputClassName() : locals.config.horizontal.getOffsetClassName();
	    return [label, _react2['default'].createElement(
	      'div',
	      { className: _classnames2['default'](className) },
	      select.renderSelect(locals),
	      select.renderError(locals),
	      select.renderHelp(locals)
	    )];
	  };
	
	  select.renderFormGroup = overrides.renderFormGroup || _renderFormGroup2['default'];
	
	  select.clone = function clone() {
	    var newOverrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    return create(_extends({}, overrides, newOverrides));
	  };
	
	  return select;
	}
	
	exports['default'] = create();
	module.exports = exports['default'];

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _getAlert = __webpack_require__(65);
	
	var _getAlert2 = _interopRequireDefault(_getAlert);
	
	var _renderFieldset = __webpack_require__(66);
	
	var _renderFieldset2 = _interopRequireDefault(_renderFieldset);
	
	function create() {
	  var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  function struct(locals) {
	    var children = [];
	
	    if (locals.help) {
	      children.push(struct.renderHelp(locals));
	    }
	
	    if (locals.error && locals.hasError) {
	      children.push(struct.renderError(locals));
	    }
	
	    children = children.concat(locals.order.map(function (name) {
	      return locals.inputs[name];
	    }));
	
	    return struct.renderFieldset(children, locals);
	  }
	
	  struct.renderHelp = overrides.renderHelp || function renderHelp(locals) {
	    return _getAlert2['default']('info', locals.help);
	  };
	
	  struct.renderError = overrides.renderError || function renderError(locals) {
	    return _getAlert2['default']('danger', locals.error);
	  };
	
	  struct.renderFieldset = overrides.renderFieldset || _renderFieldset2['default'];
	
	  struct.clone = function clone() {
	    var newOverrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    return create(_extends({}, overrides, newOverrides));
	  };
	
	  return struct;
	}
	
	exports['default'] = create();
	module.exports = exports['default'];

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(52);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _tcomb = __webpack_require__(3);
	
	var _tcomb2 = _interopRequireDefault(_tcomb);
	
	var _classnames = __webpack_require__(56);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _Breakpoints = __webpack_require__(57);
	
	var _Breakpoints2 = _interopRequireDefault(_Breakpoints);
	
	var _getLabel = __webpack_require__(63);
	
	var _getLabel2 = _interopRequireDefault(_getLabel);
	
	var _getError = __webpack_require__(58);
	
	var _getError2 = _interopRequireDefault(_getError);
	
	var _getHelp = __webpack_require__(59);
	
	var _getHelp2 = _interopRequireDefault(_getHelp);
	
	var _renderFormGroup = __webpack_require__(60);
	
	var _renderFormGroup2 = _interopRequireDefault(_renderFormGroup);
	
	var TextboxConfig = _tcomb2['default'].struct({
	  addonBefore: _tcomb2['default'].Any,
	  addonAfter: _tcomb2['default'].Any,
	  horizontal: _tcomb2['default'].maybe(_Breakpoints2['default']),
	  buttonBefore: _tcomb2['default'].Any,
	  buttonAfter: _tcomb2['default'].Any
	}, 'TextboxConfig');
	
	function getInputGroupButton(button) {
	  return _react2['default'].createElement(
	    'div',
	    { className: 'input-group-btn' },
	    button
	  );
	}
	
	function getInputGroup(children) {
	  return _react2['default'].createElement.apply(null, ['div', { className: 'input-group' }].concat(children));
	}
	
	function getAddon(addon) {
	  return _react2['default'].createElement(
	    'span',
	    { className: 'input-group-addon' },
	    addon
	  );
	}
	
	function create() {
	  var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  function textbox(locals) {
	    locals.config = textbox.getConfig(locals);
	    locals.attrs = textbox.getAttrs(locals);
	
	    if (locals.type === 'hidden') {
	      return textbox.renderHiddenTextbox(locals);
	    }
	
	    var children = locals.config.horizontal ? textbox.renderHorizontal(locals) : textbox.renderVertical(locals);
	
	    return textbox.renderFormGroup(children, locals);
	  }
	
	  textbox.getConfig = overrides.getConfig || function getConfig(locals) {
	    return new TextboxConfig(locals.config || {});
	  };
	
	  textbox.getAttrs = overrides.getAttrs || function getAttrs(locals) {
	    var attrs = _tcomb2['default'].mixin({}, locals.attrs);
	    attrs.type = locals.type;
	    attrs.className = _classnames2['default'](attrs.className);
	    attrs.className += (attrs.className ? ' ' : '') + 'form-control';
	    attrs.disabled = locals.disabled;
	    if (locals.type !== 'file') {
	      attrs.value = locals.value;
	    }
	    attrs.onChange = locals.type === 'file' ? function (evt) {
	      return locals.onChange(evt.target.files[0]);
	    } : function (evt) {
	      return locals.onChange(evt.target.value);
	    };
	
	    if (locals.help) {
	      attrs['aria-describedby'] = attrs['aria-describedby'] || attrs.id + '-tip';
	    }
	    return attrs;
	  };
	
	  textbox.renderHiddenTextbox = overrides.renderHiddenTextbox || function renderHiddenTextbox(locals) {
	    return _react2['default'].createElement('input', { type: 'hidden', value: locals.value, name: locals.attrs.name });
	  };
	
	  textbox.renderStatic = overrides.renderStatic || function renderStatic(locals) {
	    return _react2['default'].createElement(
	      'p',
	      { className: 'form-control-static' },
	      locals.value
	    );
	  };
	
	  textbox.renderTextbox = overrides.renderTextbox || function renderTextbox(locals) {
	    if (locals.type === 'static') {
	      return textbox.renderStatic(locals);
	    }
	    var ret = locals.type !== 'textarea' ? textbox.renderInput(locals) : textbox.renderTextarea(locals);
	    if (locals.config.addonBefore || locals.config.addonAfter || locals.config.buttonBefore || locals.config.buttonAfter) {
	      ret = textbox.renderInputGroup(ret, locals);
	    }
	    return ret;
	  };
	
	  textbox.renderInputGroup = overrides.renderInputGroup || function renderInputGroup(input, locals) {
	    return getInputGroup([locals.config.buttonBefore ? getInputGroupButton(locals.config.buttonBefore) : null, locals.config.addonBefore ? getAddon(locals.config.addonBefore) : null, input, locals.config.addonAfter ? getAddon(locals.config.addonAfter) : null, locals.config.buttonAfter ? getInputGroupButton(locals.config.buttonAfter) : null]);
	  };
	
	  textbox.renderInput = overrides.renderInput || function renderInput(locals) {
	    return _react2['default'].createElement('input', locals.attrs);
	  };
	
	  textbox.renderTextarea = overrides.renderTextarea || function renderTextarea(locals) {
	    return _react2['default'].createElement('textarea', locals.attrs);
	  };
	
	  textbox.renderLabel = overrides.renderLabel || function renderLabel(locals) {
	    return _getLabel2['default']({
	      label: locals.label,
	      htmlFor: locals.attrs.id,
	      breakpoints: locals.config.horizontal
	    });
	  };
	
	  textbox.renderError = overrides.renderError || function renderError(locals) {
	    return _getError2['default'](locals);
	  };
	
	  textbox.renderHelp = overrides.renderHelp || function renderHelp(locals) {
	    return _getHelp2['default'](locals);
	  };
	
	  textbox.renderVertical = overrides.renderVertical || function renderVertical(locals) {
	    return [textbox.renderLabel(locals), textbox.renderTextbox(locals), textbox.renderError(locals), textbox.renderHelp(locals)];
	  };
	
	  textbox.renderHorizontal = overrides.renderHorizontal || function renderHorizontal(locals) {
	    var label = textbox.renderLabel(locals);
	    var className = label ? locals.config.horizontal.getInputClassName() : locals.config.horizontal.getOffsetClassName();
	    return [label, _react2['default'].createElement(
	      'div',
	      { className: _classnames2['default'](className) },
	      textbox.renderTextbox(locals),
	      textbox.renderError(locals),
	      textbox.renderHelp(locals)
	    )];
	  };
	
	  textbox.renderFormGroup = overrides.renderFormGroup || _renderFormGroup2['default'];
	
	  textbox.clone = function clone() {
	    var newOverrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    return create(_extends({}, overrides, newOverrides));
	  };
	
	  return textbox;
	}
	
	exports['default'] = create();
	module.exports = exports['default'];

/***/ },
/* 71 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  optional: ' (optional)',
	  required: '',
	  add: 'Add',
	  remove: 'Remove',
	  up: 'Up',
	  down: 'Down'
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tcomb-form.js.map