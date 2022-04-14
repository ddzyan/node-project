"use strict";

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var _require = require("typedi"),
    Service = _require.Service;

var ClassroomService = (_dec = Service(), _dec(_class = /*#__PURE__*/function () {
  function ClassroomService() {
    _classCallCheck(this, ClassroomService);
  }

  _createClass(ClassroomService, [{
    key: "getName",
    value: function getName() {
      return "一年一班";
    }
  }]);

  return ClassroomService;
}()) || _class);
module.exports = ClassroomService;