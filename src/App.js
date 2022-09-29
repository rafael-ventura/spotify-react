import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const CLIENT_ID = "68d1b43e09794d51b64ad4083e57429f"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState("")
  const [tops, setTop] = useState([])
  const [limit, setLimit] = useState()
  const [type, setType] = useState()
  const [period, setPeriod] = useState()

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

  const getTop = async (e) => {
    e.preventDefault()
    const { data } = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        time_range: period,
        limit: limit
      }
    })

    setTop(data.items)
    console.log(data.items)
  }


  const setTypeButton = (e) => {
    setType(e.target.value)
  }
  const setPeriodButton = (e) => {
    setPeriod(e.target.value)
  }
  const setLimitButton = (e) => {
    setLimit(e.target.value)
  }

  return (
    <div className="App">
      <header className='App-header'>
        <h1 > Spotify React App </h1>

        {!token ?
          <button> <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`}>  Conectar no Spotify</a>  </button>
          :
          <button onClick={logout}> Logout </button>
        }
        <br />

        <form onSubmit={getTop}>
          <h3> Choose the type </h3>
          <div onChange={setTypeButton}>
            <input type="radio"
              name="type"
              value={"tracks"}
            /> Tracks

            <input
              type="radio"
              name="type"
              value={"artists"}
            /> Artists

          </div>
          <h3> Choose the time period </h3>
          <div onChange={setPeriodButton}>
            <input type="radio"
              name="period"
              id="short_term"
              value={"short_term"} /> 1 Month
            <input type="radio"
              name="period"
              id="medium_term"
              value={"medium_term"} /> 6 Months
            <input type="radio"
              name="period"
              id="long_term"
              value={"long_term"} /> All Time
          </div>
          <h3>Choose the frame limit </h3>

          <input type="number" name="frame_limit" id="frame_limit" min={1} max={30}
            onChange={setLimitButton} /> (between 1 and 30)
          <br />
          <button type={"submit"}> Most Listen  </button>
        </form>
        <br />

        <div>

          {type === 'artists' ?
            tops.map((artist) => (
              <div key={artist.id}>
                <h2> {artist.name} </h2>
                <h4> {artist.followers.total} Fans </h4>
                <ul> {artist.genres.map((genre) => <li>  {genre}   </li>)}</ul>
                <img width={"50%"} src={artist.images[0].url} alt="" />
              </div>
            ))
            :
            <ul>
              {tops.map((track) => (
                <div key={track.id}>
                  <li> <p> <b> {track.name} </b> -  {track.artists[0].name} </p> </li>
                  <li> <p> {track.album.name} </p> </li>
                  <img width={'20%'} src={track.album.images[0].url} alt="" />
                  <p> ______________________________________</p>
                </div>
              ))}
            </ul>
          }
        </div >
      </header >

    </div >
  );
}

export default App;
