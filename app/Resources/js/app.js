/*
 *
 *	ENTRY POINT
 *  WEBPACK bundle APP
 *  client side
 */

// javascript bootstrap library
import 'bootstrap';

// bootstrap scss framework
import '../scss/custom.scss';

/*
 *	Class Bundle App
 */
class App {
  constructor() {
    this.addEvents();
  }

  addEvents() {
    let selectorLang = global.document.getElementById("language");
    if (selectorLang) {
      selectorLang.addEventListener("change", (e) => {
        //window.location.href = "?lang=" + this.value;
        this.changeLang();
        e.preventDefault();
      });
    }
  }

  changeLang(query) {
    if (query) {
      return window.location.href = "?language=" + query;
    }
    let form = global.document.getElementById("formLang");
    if (form) {
      form.submit();
    }
  }
}

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

export default new App();