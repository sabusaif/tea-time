import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Design.css';

function Login(props) {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  //const [status, setStatus] = React.useState(false);

  function handleSubmit() {
    const userDto = {
      userName: userName,
      password: password,
    };
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify(userDto),
    })
      //.then(res => res.json())
      .then(apiRes => {
        console.log(apiRes);
        if(apiRes.status === 200){
          // todo login logic
          props.setIsLoggedIn(true);
          props.setLoggedInUser(userName);
          navigate('/messages');
        } else if(apiRes.status === 401) {
          setError('Invalid Username or password.');
        }
      })
      .catch(e => {
        console.log(e);
      })
  }

  return (
    <div>
      <h1 class="header">Login Page</h1>
      <div class="input">
        <input placeholder="Username" class="info" 
          value={userName} onChange={(e) => setUserName(e.target.value)} />
        <input placeholder="Password" class="info" 
          value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        <button onClick={handleSubmit} id="submit">Login</button>
      </div>
      <div>{error}</div>
    </div>
  );
}

export default Login;