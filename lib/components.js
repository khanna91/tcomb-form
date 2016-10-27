'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = exports.List = exports.Struct = exports.Datetime = exports.Radio = exports.Select = exports.Checkbox = exports.Textbox = exports.Component = exports.decorators = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _dec, _dec2, _class2, _class3, _temp2, _dec3, _dec4, _class4, _class5, _temp3, _dec5, _dec6, _class6, _class7, _temp4, _dec7, _dec8, _class8, _class9, _temp5, _dec9, _dec10, _class10, _class11, _temp6, _dec11, _class12, _class13, _temp8, _dec12, _class14, _class15, _temp9;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombValidation = require('tcomb-validation');

var _tcombValidation2 = _interopRequireDefault(_tcombValidation);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Nil = _tcombValidation2.default.Nil;
var assert = _tcombValidation2.default.assert;
var SOURCE = 'tcomb-form';
var noobj = Object.freeze({});
var noarr = Object.freeze([]);
var noop = function noop() {};

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
    case 'interface':
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
        context: this.props.ctx.context
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var locals = this.getLocals();
      if (process.env.NODE_ENV !== 'production') {
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
      return locals;
    }
  }]);

  return Textbox;
}(Component), _class3.transformer = {
  format: function format(value) {
    return Nil.is(value) ? '' : value;
  },
  parse: toNull
}, _class3.numberTransformer = {
  format: function format(value) {
    return Nil.is(value) ? '' : String(value);
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

    var _temp7, _this7, _ret;

    _classCallCheck(this, Struct);

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
    key: 'validate',
    value: function validate() {
      var value = {};
      var errors = [];
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
        value = this.getTransformer().parse(value);
        value = new InnerType(value);
        if (this.typeInfo.isSubtype) {
          result = _tcombValidation2.default.validate(value, this.props.type, this.getValidationOptions());
          errors = result.errors;
        }
      }

      this.setState({ hasError: errors.length > 0 });
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
          var type = props[prop];
          var propValue = value[prop];
          var propType = (0, _util.getTypeFromUnion)(type, propValue);
          var fieldsOptions = options.fields || noobj;
          var propOptions = (0, _util.getComponentOptions)(fieldsOptions[prop], noobj, propValue, type);
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

    _this10.addItem = function () {
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
    key: 'validate',
    value: function validate() {
      var value = [];
      var errors = [];
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
        value = this.getTransformer().parse(value);
        result = _tcombValidation2.default.validate(value, this.props.type, this.getValidationOptions());
        errors = result.errors;
      }

      this.setState({ hasError: errors.length > 0 });
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
    value: function removeItem(i) {
      var value = this.state.value.slice();
      value.splice(i, 1);
      var keys = this.state.keys.slice();
      keys.splice(i, 1);
      this.onChange(value, keys, this.props.ctx.path.concat(i), 'remove');
    }
  }, {
    key: 'moveUpItem',
    value: function moveUpItem(i) {
      if (i > 0) {
        this.onChange((0, _util.move)(this.state.value.slice(), i, i - 1), (0, _util.move)(this.state.keys.slice(), i, i - 1), this.props.ctx.path.concat(i), 'moveUp');
      }
    }
  }, {
    key: 'moveDownItem',
    value: function moveDownItem(i) {
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
        var type = _this12.typeInfo.innerType.meta.type;
        var itemType = (0, _util.getTypeFromUnion)(type, itemValue);
        var itemOptions = (0, _util.getComponentOptions)(options.item, noobj, itemValue, type);
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
    key: 'getSeed',
    value: function getSeed() {
      var rii = this._reactInternalInstance;
      if (rii) {
        if (rii._hostContainerInfo) {
          return rii._hostContainerInfo._idCounter;
        }
        if (rii._nativeContainerInfo) {
          return rii._nativeContainerInfo._idCounter;
        }
        if (rii._rootNodeID) {
          return rii._rootNodeID;
        }
      }
      return '0';
    }
  }, {
    key: 'getUIDGenerator',
    value: function getUIDGenerator() {
      this.uidGenerator = this.uidGenerator || new _util.UIDGenerator(this.getSeed());
      return this.uidGenerator;
    }
  }, {
    key: 'render',
    value: function render() {
      var i18n = Form.i18n,
          templates = Form.templates;


      if (process.env.NODE_ENV !== 'production') {
        assert(_tcombValidation2.default.isType(this.props.type), '[' + SOURCE + '] missing required prop type');
        assert(_tcombValidation2.default.maybe(_tcombValidation2.default.Object).is(this.props.options) || _tcombValidation2.default.Function.is(this.props.options) || _tcombValidation2.default.list(_tcombValidation2.default.maybe(_tcombValidation2.default.Object)).is(this.props.options), '[' + SOURCE + '] prop options, if specified, must be an object, a function returning the options or a list of options for unions');
        assert(_tcombValidation2.default.Object.is(templates), '[' + SOURCE + '] missing templates config');
        assert(_tcombValidation2.default.Object.is(i18n), '[' + SOURCE + '] missing i18n config');
      }

      var value = this.props.value;
      var type = (0, _util.getTypeFromUnion)(this.props.type, value);
      var options = (0, _util.getComponentOptions)(this.props.options, noobj, value, this.props.type);

      // this is in the render method because I need this._reactInternalInstance._rootNodeID in React ^0.14.0
      // and this._reactInternalInstance._nativeContainerInfo._idCounter in React ^15.0.0
      var uidGenerator = this.getUIDGenerator();

      return _react2.default.createElement(getFormComponent(type, options), {
        ref: 'input',
        type: type,
        options: options,
        value: value,
        onChange: this.props.onChange || noop,
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