//import '../../../public/css/app.css';
import logo from '../../../public/images/logo.svg';
var React = require('react');

var DefaultLayout = React.createClass({
  render: function() {
    return (
	    <div className="App">
		<div className="App-header">
			<img src="reactBundle/images/logo.svg" className="App-logo" alt="logo" />
			<img src={logo} className="App-logo" alt="logo" />
			<h2>Welcome to React</h2>
		</div>
		<p className="App-intro">
			To get started, edit <code>src/App.js</code> and save to reload.
			<h1>{this.props.title}</h1>
			{this.props.children}
		</p>
      	    </div>
    );
  }
});

module.exports = DefaultLayout;
