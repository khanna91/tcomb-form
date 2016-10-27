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
exports.getTypeFromUnion = getTypeFromUnion;
exports.getComponentOptions = getComponentOptions;

var _tcombValidation = require('tcomb-validation');

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

    this.seed = 'tfid-' + seed + '-';
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

function containsUnion(type) {
  switch (type.meta.kind) {
    case 'union':
      return true;
    case 'maybe':
    case 'subtype':
      return containsUnion(type.meta.type);
    default:
      return false;
  }
}

function getUnionConcreteType(type, value) {
  var kind = type.meta.kind;
  if (kind === 'union') {
    var concreteType = type.dispatch(value);
    if (process.env.NODE_ENV !== 'production') {
      _tcombValidation2.default.assert(_tcombValidation2.default.isType(concreteType), function () {
        return 'Invalid value ' + _tcombValidation2.default.assert.stringify(value) + ' supplied to ' + _tcombValidation2.default.getTypeName(type) + ' (no constructor returned by dispatch)';
      });
    }
    return concreteType;
  } else if (kind === 'maybe') {
    var maybeConcrete = _tcombValidation2.default.maybe(getUnionConcreteType(type.meta.type, value), type.meta.name);
    maybeConcrete.getValidationErrorMessage = type.getValidationErrorMessage;
    maybeConcrete.getTcombFormFactory = type.getTcombFormFactory;
    return maybeConcrete;
  } else if (kind === 'subtype') {
    var subtypeConcrete = _tcombValidation2.default.subtype(getUnionConcreteType(type.meta.type, value), type.meta.predicate, type.meta.name);
    subtypeConcrete.getValidationErrorMessage = type.getValidationErrorMessage;
    subtypeConcrete.getTcombFormFactory = type.getTcombFormFactory;
    return subtypeConcrete;
  }
}

function getTypeFromUnion(type, value) {
  if (containsUnion(type)) {
    return getUnionConcreteType(type, value);
  }
  return type;
}

function getUnion(type) {
  if (type.meta.kind === 'union') {
    return type;
  }
  return getUnion(type.meta.type);
}

function findIndex(arr, element) {
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === element) {
      return i;
    }
  }
  return -1;
}

function getComponentOptions(options, defaultOptions, value, type) {
  if (_tcombValidation2.default.Nil.is(options)) {
    return defaultOptions;
  }
  if (_tcombValidation2.default.Function.is(options)) {
    return options(value);
  }
  if (_tcombValidation2.default.Array.is(options) && containsUnion(type)) {
    var union = getUnion(type);
    var concreteType = union.dispatch(value);
    var index = findIndex(union.meta.types, concreteType);
    // recurse
    return getComponentOptions(options[index], defaultOptions, value, concreteType);
  }
  return options;
}