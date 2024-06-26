import './App.css';
import React from 'react';
import Cookies from 'universal-cookie';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import CreateAccount from './pages/CreateAccount';
import Home from './pages/Home';
import Login from './pages/Login';
import Messages from './pages/Messages';
import UserSearch from './pages/UserSearch';
import AccountSettings from './pages/AccountSettings';

const cookies = new Cookies();

function App() {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  React.useEffect(() => {
    // can do stuff here on startup
    console.log(cookies.get('auth'));
  }, []);

  return (
    <div className="App">
      <Router>
        <div className='nav'>
          <nav>
            <ul>
              <li class="home">
                <Link to="/">
                  <img src="https://images.vexels.com/media/users/3/215480/isolated/preview/7e94d464b2285ac152b2a6721306001e-coffee-cup-saucer-stroke.png"
                    alt="Home" height="40vmin"/>
                </Link>
              </li>
              {!isLoggedIn && (
                <li id="other">
                  <Link to="/createAccount" id="other">Create Account</Link>
                </li>
              )}
              {!isLoggedIn && (
                <li id="other">
                  <Link to="/login" id="other">Login</Link>
                </li>
              )}
              {isLoggedIn && (
                <li id="other">
                  <Link to="/messages" id="other">Messages</Link>
                </li>
              )}
              {isLoggedIn && (
                <li id="other">
                  <Link to="/accountSettings" id="other">Account Settings</Link>
                </li>
              )}
              {isLoggedIn && (
                <li id="other">
                  <Link to="/userSearch" id="other">User Search</Link>
                </li>
              )}
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Routes>
            <Route 
              path="/messages" 
              element={<Messages 
                setIsLoggedIn={setIsLoggedIn} 
                isLoggedIn={isLoggedIn} 
                loggedInUser={loggedInUser}
                setLoggedInUser={setLoggedInUser}
                />}
              />
            <Route 
              path="/login" 
              element={<Login 
                setIsLoggedIn={setIsLoggedIn} 
                isLoggedIn={isLoggedIn} 
                setLoggedInUser={setLoggedInUser}
                loggedInUser={loggedInUser}
                />} 
              />
            <Route 
              path="/accountSettings" 
              element={<AccountSettings
                setIsLoggedIn={setIsLoggedIn} 
                isLoggedIn={isLoggedIn} 
                setLoggedInUser={setLoggedInUser}
                loggedInUser={loggedInUser}
                />} 
              />
            <Route path="/createAccount" element={<CreateAccount />} />
            <Route path="/" element={<Home setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
            <Route path="/userSearch" element={<UserSearch />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
