require('normalize.css/normalize.css');
require('styles/App.css');
import Components from '../pages/Components/index.js'
import React from 'react';
import { Router, IndexRoute, Route, Link, browserHistory,hashHistory} from 'react-router'

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
        <div>
            <Router history={hashHistory}>
                <Route path="/components"/>
                <Route path="/" component={Components} />
            </Router>
        </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
