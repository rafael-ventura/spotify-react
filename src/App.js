import './App.css';
import { useEffect, useState } from 'react';
import Forms from './Forms';
import React from 'react';
import 'antd/dist/antd.min.css';
import { Button } from 'antd';


function App() {
  const CLIENT_ID = "03a01dce5b7a46fc9b62cb8a7542d35b"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState("")

  const SCOPES = [
    "user-top-read",
    "user-read-recently-played",
    "user-read-private",
    "user-read-email"
  ]

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const loginSpotify = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`
  }

  return (
    <div className="App">
      <header className='App-header'>
        <h1 className='title' > Spotify Account Info </h1>

        {!token ?
          <Button type="primary" onClick={loginSpotify}>   Login     </Button>
          :
          <Button style={{ background: "#b23b3b", borderColor: "#6b1d1d" }} type="primary" onClick={logout}>   Logout     </Button>
        }
        <br />

        <Forms token={token} />

      </header >

    </div >
  );
}

export default App;
