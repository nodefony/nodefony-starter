class appTask extends nodefony.Task {

  constructor(name, command) {
    super(name, command);
  }

  showHelp() {
    this.setHelp("app:task:action myarg1 myarg2",
      "nodefony app:task:action myarg1 myarg2"
    );
  }

  action(arg1, arg2){
    this.log(arg1);
    this.log(arg2);
  }

}

module.exports = appTask;
