import React from 'react';
import Cookies from 'universal-cookie';
import './Messages.css';

import AES from 'crypto-js/aes';

function Messages(props) {
  const [toUser, setToUser] = React.useState('');
  const [text, setText] = React.useState('');
  const [error, setError] = React.useState('');

  const [search, setSearch] = React.useState('');

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

  function filterMessage() {
    if(!conversationId) return; // skip if no conversation selected
    if(!search) {
      getConversation();
      return;
    }
    const cookies = new Cookies();
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

  function renderMessage(message) {
    if (message.length >= encryptConst.length && message.substring(0, encryptConst.length) == encryptConst) {
      return <label>Encrypted: <button onClick={() => setEncryptedMessage(message)}>Decrypt</button></label>
    } else {
      return message;
    }
  }

  return (
    <div>
      <h1>Messages Page</h1>
      <h2>Welcome {props.loggedInUser}</h2>
      <div class="flex-container">
        <div id="search-bar">
          <h2>Search</h2>
          <input value={search} onChange={(e) => setSearch(e.target.value)}/>
          <button onClick={filterMessage}>Search</button>
        </div>
        <div id="message-bar">
          <h2>Message</h2>
          <div>
            To:
            <input value={toUser} onChange={(e) => setToUser(e.target.value)}/>
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)}/>
          <br />
          <br />
          <div>
            <label>Encrypt: <input value={doEncrypt} onChange={(e) => {setDoEncrypt(e.target.checked)}} type="checkbox"></input></label>
            {doEncrypt && 
              (<div>
                <br />
                <label>Password: <input value={encryptPassword} onChange={(e) => setEncryptPassword(e.target.value)}></input></label>
              </div>)}
          </div>
          <br />
          <div>
              <button onClick={sendMessage}>Send</button>
          </div>
          {error}

          <div>
            {conversation.map(convo => (
              <div>
                {renderMessage(convo.message)}
              </div>
            ))}
          </div>
        </div>
        <div id="decrypt-bar">
          <h2>Decrypt</h2>
          <p>Encrypted Message: <label id="encMessage">
              {encryptedMessage.substring(encryptConst.length + 10, 
                (encryptedMessage.length >= encryptConst.length + 20) ? 
                  encryptConst.length + 20 :
                  encryptedMessage.length)}
            </label>
          </p>
          <label>Password: </label>
          <input value={decryptPassword} onChange={(e) => setDecryptPassword(e.target.value)}/>
          <br />
          <button onClick={decryptMessage}>Decrypt</button>
          <p>Message: <label>{decryptedMessage}</label></p>
        </div>
      </div>
    </div>
  );
}

export default Messages;