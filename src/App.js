import './App.css';
import { useEffect, useState } from 'react';
import { Button, Typography, TextField, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { inputLabelClasses } from "@mui/material/InputLabel";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

function App() {
  const theme = createTheme({
    palette: {
      background: {
        paper: '#fff',
      }
    }
  });
  const CLIENT_ID = "68d1b43e09794d51b64ad4083e57429f"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [topTracks, setTopTracks] = useState([])
  const [topArtists, setTopArtists] = useState([])
  const [userInfo, setUserInfo] = useState("")

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
  const searchArtists = async (e) => {
    e.preventDefault()
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist",
        limit: 2,
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
    const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        type: "tracks",
        time_range: 'short_term',
        limit: 3
      }
    })

    setTopTracks(data.items)
    console.log(data.items)
  }

  const getTopArtists = async () => {
    const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          time_range: 'short_term',
          limit: 10
        }
      })

    setTopArtists(data.items)
    console.log(data.items)
  }

  const getUserInfo = async () => {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })

    setUserInfo(data)
  }

  return (
    <div className="App">
      <header className='App-header'>
        <Typography variant='h1'
          sx={{ color: "#1ed760" }}> Spotify React App </Typography>

        {!token ?
          <Button variant="contained" color="success" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`}>  Conectar no Spotify  </Button>
          :
          <Button variant="contained" color="error" onClick={logout}> Logout </Button>
        }
        <br />
        <Button variant="contained" color="primary" onClick={getTopTracks}> Most Listen Tracks </Button>
        <br />
        <Button variant="contained" color="primary" onClick={getTopArtists}>  Most Listen Artists </Button>
        <br />

        <div>
          {topArtists.map((artist) => (
            <div key={artist.id}>
              <Typography variant='h2'> {artist.name} </Typography>
              <Typography variant='h4'> {artist.followers.total} Fans </Typography>
              <ul> {artist.genres.map((genre) => <li> <Typography variant='subtitle'> {genre} </Typography>  </li>)}</ul>
              <img width={"50%"} src={artist.images[0].url} alt="" />
            </div>
          ))
          }
        </div >

        <form onSubmit={searchArtists} >
          <Grid container spacing={1}>
            <Grid xs={2}></Grid>
            <Grid xs={4}>
              <TextField id="outlined-basic"
                label="Digite um Artista"
                variant="outlined"
                size='small'
                sx={{
                  input: {
                    color: "#1ed760",
                    borderRadius: "6%",
                    borderColor: "#fff"

                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: "#1ed760",
                    [`&.${inputLabelClasses.shrink}`]: {
                      // set the color of the label when shrinked (usually when the TextField is focused)
                      color: "#1ed760"
                    }
                  }
                }}
                onChange={e => setSearchKey(e.target.value)} />
            </Grid>

            <Button type={"submit"} variant="contained" color="primary">  Get Information </Button>

            <Grid xs={1}>
              <Button> <CloseOutlinedIcon sx={{ color: "red" }} ></CloseOutlinedIcon> </Button>
            </Grid>
          </Grid>
        </form>

        {renderArtists()}

        {
          userInfo ?
            <div>
              < p > {userInfo.display_name} </p>
              <p>{userInfo.email} </p>
              <p>{userInfo.followers.total} followers</p>
              <img src={userInfo.images[0].url} alt="" />
            </div>
            :
            <p> No info</p>
        }
        <Button variant="contained" color="primary" onClick={getUserInfo}>  Get Information </Button>

      </header >

    </div >
  );
}

export default App;
