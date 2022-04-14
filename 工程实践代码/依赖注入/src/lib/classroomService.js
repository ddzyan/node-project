const { Service } = require("typedi");

@Service()
class ClassroomService {
  getName() {
    return "一年一班";
  }
}

module.exports = ClassroomService;
