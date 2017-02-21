var React = require('react');
var DefaultLayout = require('./layouts/default');


// Contrived example to show how one might use Flow type annotations
function countTo(n:number):string {
  var a = [];
  for (var i = 0; i < n; i++ ) {
    a.push(i + 1);
  }
  return a.join(', ');
}


var HelloMessage = React.createClass({
  propTypes: {
    title: React.PropTypes.string
  },
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>Hello {this.props.name}</div>
	<p>
          I can count to 10:
          {countTo(10)}
        </p>
      </DefaultLayout>
    );
  }
});

module.exports = HelloMessage;

