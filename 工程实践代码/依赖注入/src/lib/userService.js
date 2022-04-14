const { Service } = require("typedi");

@Service()
class UserService {
  getName() {
    return "apple";
  }
}

module.exports = UserService;
