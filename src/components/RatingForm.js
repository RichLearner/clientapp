import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import logo from '../styles/KotaPermaiLogo.png';
import '../styles/css/RatingForm.css';

const RatingForm = ({ match }) => {
    const history = useHistory();
    const { receipt, chitId, caddyId } = useParams();

    const [assessmentData, setAssessmentData] = useState([]);
    const [ratings, setRatings] = useState({});
    const [remarks, setRemarks] = useState('');

    const handleRemarksChange = (e) => {
        setRemarks(e.target.value);
    };

    const assessmentValueMap = {
        poor: 1,
        average: 2,
        good: 3,
        excellent: 4,
    };

    useEffect(() => {
        // Call API using chitId and caddyId
        const fetchCaddyAssessment = async () => {
            const apiUrl = '/ClubApp/Json/Default.aspx';
            const requestBody = {
                Type: 'GolfGetCaddyAssessment',
                Input: {
                    ChitID: chitId,
                    CaddyID: caddyId,
                },
            };

            try {
                const response = await axios.post(apiUrl, requestBody);
                // Assuming the response contains assessment data
                setAssessmentData(response.data.Result); // Update the assessment data
                console.log(response.data.Result);
            } catch (error) {
                console.error('Error fetching caddy assessment:', error);
            }
        };

        fetchCaddyAssessment();
    }, [chitId, caddyId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const assessmentList = assessmentData.map((assessment) => ({
            ...assessment,
            Assessment: assessmentValueMap[ratings[assessment.AssessID]],
        }));

        // const formData = {
        //     caddyId,
        //     caddyAssessment: assessmentList,
        //     Remarks: remarks,
        // };

        const apiUrl = '/ClubApp/Json/Default.aspx';

        const requestParam = {
            Type: 'GolfUpdateCaddyAssessment',
            Input: {
                ChitID: chitId,
                CaddyID: caddyId,
                CaddyAssessment: assessmentList,
                Remarks: remarks,
            },
        };

        console.log(requestParam);

        axios
            .post(apiUrl, requestParam)
            .then((response) => {
                console.log('Assessment data updated successfully!', response.data);

                // After successful submission, check if all caddies have been rated
                axios
                    .post('/ClubApp/Json/Default.aspx', {
                        Type: 'GolfGetRegisterFlightCaddy',
                        Input: {
                            ChitID: receipt,
                        },
                    })
                    .then((response) => {
                        console.log(response.data);
                        const unratedCaddies = response.data.Result.filter(caddie => caddie.Assessment === 0);

                        if (unratedCaddies.length === 0) {
                            // All caddies have been rated, navigate to Thank You page
                            history.push('/thank-you'); // Change this path according to your route setup
                        } else {
                            // There are still unrated caddies, navigate back to Landing Page
                            history.push(`/landing/${receipt}`); // Change this path according to your route setup
                        }
                    })
                    .catch((error) => {
                        console.error('Error checking unrated caddies:', error);
                    });
            })
            .catch((error) => {
                console.error('Error while updating assessment data:', error);
                // Handle errors here, show an error message, etc.
            });
    };


    const handleRatingChange = (assessID, rating) => {
        setRatings((prevRatings) => ({ ...prevRatings, [assessID]: rating }));
    };

    return (
        <div className="container">
            <img src={logo} alt="Logo" className="logo" />
            <h1>Caddie Rating</h1>
            <form onSubmit={handleSubmit}>
                {/* Display Assessment Categories and Radio Buttons */}
                <h4>Caddie's Number: {chitId}</h4>
                <h4>Caddie's Name: {caddyId}</h4>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Excellent</th>
                            <th>Good</th>
                            <th>Average</th>
                            <th>Poor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assessmentData.map((assessment) => (
                            <tr key={assessment.AssessID}>
                                <td>{assessment.Description}</td>
                                {['excellent', 'good', 'average', 'poor'].map((rating) => (
                                    <td key={rating}>
                                        <input
                                            type="radio"
                                            name={assessment.AssessID}
                                            value={rating}
                                            checked={ratings[assessment.AssessID] === rating}
                                            onChange={() => handleRatingChange(assessment.AssessID, rating)}
                                            required
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Remark input */}
                <div className="input-group">
                    <label htmlFor="remarks">Remarks:</label>
                    <textarea
                        id="remarks"
                        value={remarks}
                        onChange={handleRemarksChange}
                        rows="4"
                        cols="50"
                        placeholder="Enter your remarks..."
                    ></textarea>
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default RatingForm;