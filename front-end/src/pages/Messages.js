import React from 'react';
import Cookies from 'universal-cookie';
import './Messages.css';
import './Design.css';

function Messages(props) {
  const [toUser, setToUser] = React.useState('');
  const [text, setText] = React.useState('');
  const [error, setError] = React.useState('');

  // search will be passed to the back-end
  const [search, setSearch] = React.useState('');

  // conversation logic
  // current conversation Im in
  const [conversationId, setConversationId] = React.useState('');
  // full list of messages
  const [conversation, setConversation] = React.useState([]);

  function sendMessage(){
    console.log('Sending ' + text + 'to ' + toUser);
    const messageDto = {
      fromId: props.loggedInUser,
      toId: toUser,
      message: text,
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

  return (
    <div>
      <h1 class="header">Messages Page</h1>
      <h2>Welcome {props.loggedInUser}</h2>
      <div id="search-bar">
        <input value={search} onChange={(e) => setSearch(e.target.value)}/>
        <button onClick={filterMessage}>Search</button>
      </div>
      <div>
        <div>
          To:
          <input value={toUser} onChange={(e) => setToUser(e.target.value)}/>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)}/>
        <div>
            <button onClick={sendMessage}>Send</button>
        </div>
        {error}

        <div>
          {conversation.map(convo => (
            <div>
              {convo.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Messages;