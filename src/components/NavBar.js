import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
        <header className="inner-header">
          <Link to='/' id='navbar-logo'>
            <h1 href=''>Spotifake</h1>
          </Link>
          <nav>
            <Link to='/'>Home</Link>
            <Link to='/library'>Library</Link>
          </nav>
        </header>
    );
  }
}

export default NavBar
