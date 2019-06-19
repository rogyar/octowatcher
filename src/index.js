import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './app';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Provider} from "react-redux";
import store from './store/index';


ReactDOM.render(

    <Provider store={store}>
      <AppContainer/>
    </Provider>,
    document.getElementById('root')
  );