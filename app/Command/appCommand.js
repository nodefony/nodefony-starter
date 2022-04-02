const appTask = require(path.resolve(__dirname, "appTask.js"));

class appCommand extends nodefony.Command {
  constructor(cli, bundle) {
    super("app", cli, bundle);
    this.setTask("task", appTask);
  }
}
module.exports = appCommand;
