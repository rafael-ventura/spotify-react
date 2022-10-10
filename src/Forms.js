import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Radio, Card, Col, Row, Space, Divider } from 'antd';
import React from 'react';
const { Meta } = Card;


function Forms(props) {
    const [type, setType] = useState('')
    const [period, setPeriod] = useState('')
    const [topsTracks, setTopTracks] = useState([])
    const [topsArtists, setTopArtists] = useState([])
    const [isTrackCard, setIsTrackCard] = useState(true)

    useEffect(() => {
        if (type && period) {
            console.log(type);
            console.log(period);
            console.log(props.token);
            getTop()
        }
    }, [props.token, period]);

    const setTypeButton = (e) => {
        console.log(e.target.value);
        setType(e.target.value)
        if (e.target.value === 'artists') {
            setIsTrackCard(false)
        } else if (e.target.value === 'tracks') {
            setIsTrackCard(true)
        }

    }
    const setPeriodButton = (e) => {
        console.log(e.target.value);
        setPeriod(e.target.value)
    }
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
        },)
        if (type === 'artists') {
            setTopArtists(data.items)
            renderArtists()

        } else if (type === 'tracks') {
            setTopTracks(data.items)
            renderTracks()
        }

    }


    const renderTracks = () => {
        if (topsTracks) {
            return topsTracks.map((track, index) => (
                <Col span={3}>
                    <div className="site-card-wrapper">
                        <Card
                            hoverable
                            style={{
                                width: 200,

                            }}
                            cover={
                                < img alt='track' src={track.album.images[0].url} />}>
                            <Meta title={track.name} description={track.artists[0].name} />

                        </Card >

                        <br />
                    </div >
                </Col>

            ))
        }
    }
    const renderArtists = () => {
        if (topsArtists) {
            return topsArtists.map((artist) => (
                <Col span={3}>
                    <div className="site-card-wrapper">
                        <Card
                            hoverable
                            style={{
                                width: 200,

                            }}
                            cover={
                                < img alt='artist' src={artist.images[0].url} />}>
                            <Meta title={artist.name} />
                        </Card >
                        <br />
                    </div >
                </Col>
            ))
        }
    }

    return (
        <div>
            <Form
                name='form'
                autoComplete="off"
            >
                <Form.Item
                    onChange={setTypeButton}
                    name="type">
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
                        // defaultValue={'short_term'}
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
            {isTrackCard
                ?
                <Row gutter={[16, 24]}>
                    {renderTracks()}
                </Row>
                :
                <Row gutter={[16, 24]}>
                    {renderArtists()}
                </Row>
            }


        </div >
    );
}

export default Forms;