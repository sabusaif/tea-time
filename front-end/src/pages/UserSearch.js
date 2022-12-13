import React from 'react';
import Cookies from 'universal-cookie';


function UserSearch() {
    const [userName, setUserName] = React.useState('');
    const [users, setUsers] = React.useState([]);

    function filterUsernames() {
        console.log('Looking for usernames with ' + userName);

        fetch('/getUsers?userNameSearch=' + userName, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(apiRes => {
                console.log(apiRes);
                if (apiRes.status) {
                    setUsers(apiRes.data); // list of users that match the username
                }
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <div>
            <div>
                <h2> User Search</h2>
            </div>
            <div>
                <input value={userName} onChange={(e) => setUserName(e.target.value)} />
                <button onClick={filterUsernames}> Search </button>
            </div>
            <div>
                {users.map(name => (
                    <div>
                        {name}
                    </div>
                ))}
            </div>
        </div>


    )
}
export default UserSearch;