'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

var _tcombFormTemplatesBootstrap = require('tcomb-form-templates-bootstrap');

var _tcombFormTemplatesBootstrap2 = _interopRequireDefault(_tcombFormTemplatesBootstrap);

var _en = require('./i18n/en');

var _en2 = _interopRequireDefault(_en);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.form.Form.templates = _tcombFormTemplatesBootstrap2.default; /*! @preserve
                                                                              *
                                                                              * The MIT License (MIT)
                                                                              *
                                                                              * Copyright (c) 2014 Giulio Canti
                                                                              *
                                                                              */

_index2.default.form.Form.i18n = _en2.default;

exports.default = _index2.default;