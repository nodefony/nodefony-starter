/*
 *
 *	ENTRY POINT WEBPACK bundle APP
 *
 */
require("../css/app.css");

module.exports = function () {
  /*
   *	Class Bundle App client side
   */
  const App = class App {
    constructor() {
      this.selectorLang = global.document.getElementById("langs");
      if (this.selectorLang) {
        this.selectorLang.addEventListener("change", function (e) {
          window.location.href = "?lang=" + this.value;
          e.preventDefault();
        });
      }
    }
  };
  return new App();
}();
