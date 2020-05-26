import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from './components/Main';
import Chat from './components/Chat';

const App = () => (
  <div className="App">
    <Router>
      <div className="Auth">
      <Route path="/" exact component={Main} />
      </div>
      <Route path="/chat-app" component={Chat} />
    </Router>
  </div>
)

export default App;