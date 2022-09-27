import './App.css';
import { useEffect, useState } from 'react';
import { Button, Link } from '@mui/material';
import axios from 'axios';

function App() {
  const CLIENT_ID = "68d1b43e09794d51b64ad4083e57429f"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState("")
  const [serachKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])

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
  const searchArtists = async (e) => {
    e.preventDefault()
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })

    setArtists(data.artists.items)
  }
  return (
    <div className="App">
      <header className='App=header'>
        <h1>Spotify React App</h1>
        {!token ?
          <Button variant="contained" color="success" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>  Conectar no Spotify  </Button>
          :
          <Button variant="contained" color="error" onClick={logout}> Logout </Button>
        }
      </header>
    </div >
  );
}

export default App;
