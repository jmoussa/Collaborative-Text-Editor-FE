import React from 'react'
import {Link} from 'react-router-dom'


class NavBar extends React.Component {
    render() {
      return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
            <li><Link to={'/'} className="nav-link">Home</Link></li>
            <li><Link to={'/editor'} className="nav-link">Text Editor</Link></li>
          </ul>
        </nav>
      );
    }
}

export default NavBar;
