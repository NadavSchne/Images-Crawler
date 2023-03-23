import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

// USED PARAMETERS FOR CURRENT CLIENT:https://translate.google.com/?hl=iw&tab=TT&sl=en&tl=iw&op=translate
// Depth = 1

function App() {
  const [url, setUrl] = useState('');                                  //react hooks to manage variables states
  const [depth, setDepth] = useState('');

  const handleSubmit = async (e) => {                                 // POST request to the server in an async way
    e.preventDefault();                                                // so the app continues to run
    try {
      const response = await axios.post('/api/crawl', { url, depth });  //wait for the response from the server
      console.log(response.data);                                       //before continuing with the function execution.
    } catch (error) {
      console.error(error);
    }
  };
                                                                        // on change to update variables starte
                                                                        // submit to call a post request
  return (
    <form onSubmit={handleSubmit}> 
      <label>
        URL:
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />        
      </label>
      <br />
      <label>
        Depth:
        <input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
      </label>
      <br />
      <button type="submit">Crawl</button>
    </form>
  );

}

export default App;
