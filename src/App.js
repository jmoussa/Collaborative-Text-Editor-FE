import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

function App() {
    return (
        <Router>
          <div>
            <NavBar/> 
            <Switch> 
              <Route exact path="/" component={HomePage}/>
              <Route path="/editor" component={EditorPage}/>
            </Switch>
          </div>
        </Router>             
    );
}

export default App;
