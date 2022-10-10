import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Radio } from 'antd';
import React from 'react';


function Forms(props) {
    const [type, setType] = useState('tracks')
    const [period, setPeriod] = useState('short_term')
    const [topsTracks, setTopTracks] = useState([])
    const [topsArtists, setTopArtists] = useState([])

    useEffect(() => {
        // Atualiza o título do documento usando a API do browser
        if (props.token) {
            console.log(type);
            console.log(period);
            console.log(props.token);
            getTop()
        }
    }, [props.token, type, period]);

    const getTop = async (e) => {
        const { data } = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
            headers: {
                Authorization: `Bearer ${props.token}`,
                'Content-Type': 'application/json'
            },
            params: {
                time_range: period,
                limit: 30
            }
        })
        if (type == 'artists') {
            setTopArtists(data.items)
        } else if (type == 'tracks') {
            setTopTracks(data.items)
        }
        console.log(data.items)
    }
    const setTypeButton = (e) => {
        console.log(e.target.value);
        setType(e.target.value)
    }
    const setPeriodButton = (e) => {
        console.log(e.target.value);
        setPeriod(e.target.value)
    }

    return (
        <div>
            <Form
                name='form'
                onFinish={getTop}
                autoComplete="off"
                initialValues={{
                    'inputNumberValues': 5
                }}
            >
                <Form.Item
                    onChange={setTypeButton}
                    name="Type">
                    <Radio.Group

                        buttonStyle="solid"
                        style={{
                            marginTop: 16,
                        }}
                    >
                        <Radio.Button value="tracks">Tracks</Radio.Button>
                        <Radio.Button value="artists"> Artists </Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    onChange={setPeriodButton}
                    name="period"

                >
                    <Radio.Group

                        buttonStyle="solid"
                        style={{
                            marginTop: 16,
                        }}
                    >
                        <Radio.Button value="short_term">1 Month</Radio.Button>
                        <Radio.Button value="medium_term"> 6 Months </Radio.Button>
                        <Radio.Button value="long_term"> All Time </Radio.Button>
                    </Radio.Group>
                </Form.Item>

            </Form>

            <div>

                {type === 'artists'
                    ?
                    topsArtists.map((artist) => (
                        <div key={artist.id}>
                            <h2> {artist.name} </h2>
                            {/* <h4> {artist.followers.total} Fans </h4> */}
                            <ul> {artist.genres.map((genre) => <li>  {genre}   </li>)}</ul>
                            <img width={"50%"} src={artist.images[0].url} alt="" />
                        </div>

                    ))
                    :
                    <ul>
                        {topsTracks.map((track) => (
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
        </div >
    );
}

export default Forms;