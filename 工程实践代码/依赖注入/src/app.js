require("reflect-metadata");

const { Container } = require("typedi");

const UserService = require("./lib/userService");
const ClassroomService = require("./lib/classroomService");

const main = () => {
  const userService = Container.get(UserService);
  const classroomService = Container.get(ClassroomService);

  console.log(userService.getName());
  console.log(classroomService.getName());
};

main();
