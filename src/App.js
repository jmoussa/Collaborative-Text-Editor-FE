import NavBar from './components/NavBar'
import Home from './components/Home'
import Editor from './components/Editor'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

function App() {
    return (
        <Router>
          <div>
            <NavBar/> 
            <hr/> 
            <Switch> 
              <Route exact path="/" component={Home}/>
              <Route path="/editor" component={Editor}/>
            </Switch>
          </div>
        </Router>             
    );
}

export default App;
