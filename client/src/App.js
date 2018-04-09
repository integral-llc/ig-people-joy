import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux';
import {Security, ImplicitCallback} from '@okta/okta-react';
import initializerStore from './reducers';


import Home from './components/Home';

const config = {
  issuer: 'https://dev-489128.oktapreview.com/oauth2/default',
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id: '0oaelzwp8nxI7vkfL0h7'
}

const store = initializerStore();


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Security issuer={config.issuer} client_id={config.client_id}
                    redirect_uri={config.redirect_uri}>
            <div className="container">
              <Route path='/' exact={true} component={Home}/>
              <Route path='/implicit/callback' component={ImplicitCallback}/>
            </div>
          </Security>
        </Router>
      </Provider>
    );
  }
}

export default App;
