import {routerReducer} from 'react-router-redux';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import messages from './messages';

const reducer = combineReducers({
  messages,
  routing: routerReducer
})

export default function () {
  return createStore(reducer, compose(applyMiddleware(thunk)));
}





