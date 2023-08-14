import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import logo from '../styles/KotaPermaiLogo.png'; 
import '../styles/css/LandingPage.css';

const LandingPage = () => {
    const history = useHistory();

    const { receipt } = useParams();
    const formattedReceiptNumber = receipt ? receipt.replace(/(\d{2})(\d{8})/, '$1 $2') : '';

    const [caddies, setCaddies] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    const handleRateNowClick = (ChitID, caddyNo) => {
        console.log('Rate Now button clicked for caddy:', caddyNo);
        history.push(`/rating/${receipt}/${ChitID}/${caddyNo}`); // Navigate to the rating page
    };

    useEffect(() => {
        if (formattedReceiptNumber && !dataFetched) {
            fetchCaddies(formattedReceiptNumber);
            setDataFetched(true);
        }
    }, [formattedReceiptNumber, dataFetched]);

    const fetchCaddies = async (receiptNumber) => {
        const apiUrl = '/ClubApp/Json/Default.aspx';

        const requestBody = {
            Type: 'GolfGetRegisterFlightCaddy',
            Input: {
                ChitID: receiptNumber,
            },
        };

        try {
            const response = await axios.post(apiUrl, requestBody);
            setCaddies(response.data.Result);
        } catch (error) {
            console.error('Error fetching caddies:', error);
        }
    };

    return (
        <div className="landing-page">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="title">Caddie List for Receipt: {receipt}</h1>
            <ul className="caddies-list">
                {caddies.map((caddie) => (
                    <li className="caddie-item" key={caddie.CaddyNo}>
                        <span className="caddie-name">{caddie.Name}</span>
                        <span className={`assessment ${caddie.Assessment === 0 ? 'no-rating' : 'rating-given'}`}>
                            {caddie.Assessment === 0 ? (
                                <button onClick={() => handleRateNowClick(caddie.ChitID, caddie.CaddyNo)}>Rate Now</button>
                            ) : (
                                <span>Rating Given</span>
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LandingPage;
