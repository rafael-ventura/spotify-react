import './App.css';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

function App() {
  const CLIENT_ID = "68d1b43e09794d51b64ad4083e57429f"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [topTracks, setTopTracks] = useState([])
  const [topArtists, setTopArtists] = useState([])
  const [me, setMe] = useState("")
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
        type: "artist",
        limit: 5,
        market: "BR"
      }
    })

    setArtists(data.artists.items)
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        {artist.images.length ? <img width={"50%"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
        {artist.name}
      </div>
    ))
  }

  const getTopTracks = async () => {
    const data = await axios.get("https://api.spotify.com/v1/me/top/tracks?limit=50", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        type: "tracks",
        time_range: 'medium_term',
        limit: 3
      }
    })

    setTopTracks(data.items)
  }

  const getTopArtists = async () => {
    const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          time_range: 'short_term',
          limit: 10
        }
      })

    setTopArtists(data.items)
  }

  const getMe = async () => {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })

    setMe(data)
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
        <br />
        <br />
        <Button variant="contained" color="primary" onClick={getTopTracks}> Most Listen Tracks </Button>
        <br />
        <br />
        <Button variant="contained" color="primary" onClick={getTopArtists}>  Most Listen Artists </Button>
        <br />
        <br />
      </header>

      <form onSubmit={searchArtists}>
        <input type="text" onChange={e => setSearchKey(e.target.value)} />
        <button type={"submit"}>Search</button>
      </form>
      <br />
      <br />
      {renderArtists()}
      {/* {getMe()} */}
      {me ?
        <div>
          <p>{me.display_name} </p>
          <p>{me.email} </p>
          <p>{me.followers.total} </p>
          <img src={me.images[0].url} alt="" />
        </div>
        :
        <p> No info</p>
      }
      <Button variant="contained" color="primary" onClick={getMe}>  Get Information </Button>
    </div >
  );
}

export default App;
