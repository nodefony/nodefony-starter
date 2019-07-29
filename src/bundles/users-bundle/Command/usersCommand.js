const usersTask = require(path.resolve(__dirname, "usersTask.js"));

class usersCommand extends nodefony.Command {
  constructor(cli, bundle) {
    super("users", cli, bundle);
    this.setTask("task", usersTask);
  }
}
module.exports = usersCommand;
