import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Design.css';

function AccountSettings() {
    const navigate = useNavigate();
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');

    function changePassword() {
        const userDto = {
            userName: userName,
            password: newPassword,
          };
          if (confirmPassword === password) {
            fetch('/changePassword', {
              method: 'POST',
              body: JSON.stringify(userDto),
            })
                .then(res => res.json())
                .then(apiRes => {
                  console.log(apiRes);
                  if (!apiRes.status) {
                    setError(apiRes.message);
                  } else {
                    navigate('/login');
                  }
                })
                .catch(e => {
                  console.log(e);
                })
          }
    }

    return (
    <div>
      <h1 class="header">Account Settings</h1>
      <div class="input">
      <input placeholder="UserName" class="info" 
          value={userName} onChange={(e) => setUserName(e.target.value)} />
        <input placeholder="New Password" class="info" 
          value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password"/>
        <input placeholder="Password" class="info" 
          value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        <input placeholder="Confirm Password" class="info"
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" />
        <button onClick={changePassword} id="submit">Change Password</button>
      </div>
      <div>{error}</div>
    </div>
  );
}

export default AccountSettings;