"use strict";

require("reflect-metadata");

var _require = require("typedi"),
    Container = _require.Container;

var UserService = require("./lib/userService");

var ClassroomService = require("./lib/classroomService");

var main = function main() {
  var userService = Container.get(UserService);
  var classroomService = Container.get(ClassroomService);
  console.log(userService.getName());
  console.log(classroomService.getName());
};

main();