/*
 *
 *	ENTRY POINT WEBPACK bundle APP
 *
 */
require('bootstrap');
require('../../scss/custom.scss');
require("../css/app.css");

module.exports = function() {
  /*
   *	Class Bundle App client side
   */
  const App = class App {
    constructor() {
      let selectorLang = global.document.getElementById("lang");
      if (selectorLang) {
        selectorLang.addEventListener("change", (e) => {
          //window.location.href = "?lang=" + this.value;
          this.changeLang()
          e.preventDefault();
        });
      }
    }

    changeLang(query) {
      if (query) {
        return window.location.href = "?lang=" + query;
      }
      let form = global.document.getElementById("formLang");
      if (form) {
        form.submit();
      }
    }
  };
  return new App();
}();

/*
 * HMR
 */
if (module.hot) {
  module.hot.accept((err) => {
    if (err) {
      console.error('Cannot apply HMR update.', err);
    }
  });
}