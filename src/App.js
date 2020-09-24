import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpIn from './Components/SignUpIn';
import Sucessfull from './Components/Sucessfull';

library.add(fab, fas);

function App() {
  return (
    <Router>
      <Route path="/" exact component={SignUpIn} />
      <Route path="/sucessfull" component={Sucessfull} />
    </Router>
  );
}

export default App;
