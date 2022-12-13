import React from 'react';
import Cookies from 'universal-cookie';
import './Messages.css';
import './Design.css';

import AES from 'crypto-js/aes';

function Messages(props) {
  const [toUser, setToUser] = React.useState('');
  const [text, setText] = React.useState('');
  const [error, setError] = React.useState('');

  // search will be passed to the back-end
  const [search, setSearch] = React.useState('');

  // this will be used to add the people the user has messaged
  const [friends, setFriends] = React.useState([]);

  const [doEncrypt, setDoEncrypt] = React.useState('');
  const [decryptPassword, setDecryptPassword] = React.useState('');
  const [encryptPassword, setEncryptPassword] = React.useState('');
  const [encryptedMessage, setEncryptedMessage] = React.useState('');
  const [decryptedMessage, setDecryptedMessage] = React.useState('');

  const encryptConst = 'wFKOuajQbjBYwbKX'

  // conversation logic
  // current conversation Im in
  const [conversationId, setConversationId] = React.useState('');
  // full list of messages
  const [conversation, setConversation] = React.useState([]);

  function sendMessage(){
    console.log('Sending ' + text + 'to ' + toUser);

    var rMessage = text
    if (doEncrypt && text.length > 0) {
      rMessage = encryptConst + encryptMessage(text)
    }

    const messageDto = {
      fromId: props.loggedInUser,
      toId: toUser,
      message: rMessage,
    };
    console.log(messageDto); // to java side
    const cookies = new Cookies();
    fetch('/createMessage', {
      method: 'POST',
      body: JSON.stringify(messageDto),
      headers: {
        auth: cookies.get('auth'), // makes the call authorized
      }
    })
      .then(res => res.json())
      .then(apiRes => {
        console.log(apiRes);
        if(apiRes.status){
          // message was added
          setText('');
          setError('');
          setConversationId(apiRes.data[0].conversationId); // from java
          getConversation();
        } else {
          setError(apiRes.message);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  // Fetch conversations anytime the conversationId is updated
  React.useEffect(getConversation, [conversationId]);

  // Use to refresh current list of conversations
  function getConversation(){
    if(!conversationId) return; // skip if no conversation selected
    const cookies = new Cookies();
    fetch('/getConversation?conversationId=' + conversationId, {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // makes the call authorized
      }
    })
      .then(res => res.json())
      .then(apiRes => {
        console.log(apiRes);
        if(apiRes.status){
          setConversation(apiRes.data); // list of convos
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  // this function will only return messages that contains the word the user inputted
  function filterMessage() {
    if(!conversationId) return; // skip if no conversation selected
    // if the user searches nothing, then it will just show the whole conversation
    if(!search) {
      getConversation();
      return;
    }
    const cookies = new Cookies();
    // it will look at one specific conversation
    fetch('/getMessages?conversationId=' + conversationId + '&search=' + search, {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // makes the call authorized
      }
    })
      .then(res => res.json())
      .then(apiRes => {
        console.log(apiRes);
        if(apiRes.status){
          setConversation(apiRes.data); // list of convos
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  // this function will show the user a list of people they have already messaged
  function listOfFriends() {
    const cookies = new Cookies();
    // it will send the currentUser to the back-end
    fetch('/getFriends?currentUser=' + props.loggedInUser, {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // makes the call authorized
      }
    })
      .then(res => res.json())
      .then(apiRes => {
        console.log(apiRes);
        if(apiRes.status){
          setFriends(apiRes.data); // list of friends
        }
      })
      .catch(e => {
        console.log(e);
      });
      showOrHide();
  }


  // the user can toggle the button to hide and show friends
  function showOrHide() {
    // if friend list is showing
    if (document.getElementById("show_friends").innerText === "Hide Friends") {
      document.getElementById("click").style.display = "none";
      // since everything is now hidden, they will be able to show 
      document.getElementById("show_friends").innerText = "Show Friends";
    // if friend list isn't showing  
    } else {
      document.getElementById("click").style.display = "block";
      // since the list is now visible, the user can hide it
      document.getElementById("show_friends").innerText = "Hide Friends";
    }
  }

  function decryptMessage() {
    var message = encryptedMessage
    if (message.length > encryptConst.length) {
      var encMes = message.substring(encryptConst.length, message.length);

      try {
        var bytes = AES.decrypt(encMes, decryptPassword);
        var decimals = bytes.toString().match(/.{1,2}/g);
        setDecryptedMessage(String.fromCharCode(...decimals.map(v => parseInt(v, 16))));
      } catch (e) {
        console.error("error", e);
      }
    }
  }

  function encryptMessage(message) {
    return AES.encrypt(message, encryptPassword).toString();
  }

  function renderMessage(convo) {
    var message = convo.message
    var timestamp = new Date(convo.timestamp)

    var t = <label>{timestamp.getHours().toString() + ":" + 
      (timestamp.getMinutes().toString().length === 1 ?
        "0" + timestamp.getMinutes().toString() :
        timestamp.getMinutes().toString())} </label>
    var i = null

    if (message.length >= encryptConst.length && message.substring(0, encryptConst.length) === encryptConst) {
      i = <label> Encrypted: <button onClick={() => setEncryptedMessage(message)}>Decrypt</button></label>
    } else {
      i = message
    }

    if (message.length > 0)
      return <div>
        {t}
        {i}
      </div>
  }

  return (
    <div>
      <h1 class="header">Messages Page</h1>
      <h2 class="text" id="title">Welcome {props.loggedInUser}</h2>
      <div class="flex-container">
        <div id="search-bar">
          <h2 class="text">Search</h2>
          <input placeholder="filter message" class="info message_box" value={search} onChange={(e) => setSearch(e.target.value)}/>
          <button onClick={filterMessage} class="text" id="submit_message">Search</button>
          <div>
            <button onClick={listOfFriends} class="text" id="show_friends">Show Friends</button>
            <div id="click">
              {friends.map(friend => (
              <div>
                {friend.userName}
              </div>
              ))}
            </div>
          </div>
        </div>
        <div id="message-bar">
          <h2 class="text">Message</h2>
          <div class="text" id="to_message">
            To:
            <input placeholder="enter user" class="info message_box" id="blank" value={toUser} onChange={(e) => setToUser(e.target.value)}/>
          </div>
          <textarea class="info" id="blank_box" value={text} onChange={(e) => setText(e.target.value)}/>
          <br />
          <br />
          <div>
            <label class="text">Encrypt: <input value={doEncrypt} onChange={(e) => {setDoEncrypt(e.target.checked)}} type="checkbox"></input></label>
            {doEncrypt && 
              (<div>
                <br />
                <label class="text">Password: <input class="info message_box" placeholder="password"
                  value={encryptPassword} onChange={(e) => setEncryptPassword(e.target.value)}></input></label>
              </div>)}
          </div>
          <br />
          <div>
              <button onClick={sendMessage} class="text" id="submit_message">Send</button>
          </div>
          {error}

          <div id="messages">
            {conversation.map(convo => (
              <div class="text">
                {renderMessage(convo)}
              </div>
            ))}
          </div>
        </div>
        <div id="decrypt-bar">
          <h2 class="text">Decrypt</h2>
          <p class="text">Encrypted Message: <label id="encMessage">
              {encryptedMessage.substring(encryptConst.length + 10, 
                (encryptedMessage.length >= encryptConst.length + 20) ? 
                  encryptConst.length + 20 :
                  encryptedMessage.length)}
            </label>
          </p>
          <label class="text">Password: </label>
          <input class="info message_box" placeholder="password" 
            value={decryptPassword} onChange={(e) => setDecryptPassword(e.target.value)}/>
          <br />
          <button onClick={decryptMessage} class="text" id="submit_message">Decrypt</button>
          <p class="text">Message: <label>{decryptedMessage}</label></p>
        </div>
      </div>
    </div>
  );
}

export default Messages;