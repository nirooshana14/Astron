import { useState, useEffect } from "react";
import { db } from '../../firebase-config.js';
import { onValue, ref } from '@firebase/database';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import { useContext } from "react";
import { BookingContext } from "../../context/BookingContext.jsx";

const PlaceSelection = (props) => {
    const { currentPage, setCurrentPage } = props;
    const [place, setPlace] = useState([]);
    const [placeIndex, setPlaceIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { getBookingContext, setBookingContext } = useContext(BookingContext);

    const booking = BookingContext.planet;
    const selectedPlanet = booking.name;   //this value should be dynamically changed

    useEffect(() => {
        const getPlaces = async () => {
            try {
                const placesRef = ref(db, "places");
                
                onValue(placesRef, (snapshot) => {
                    const data = [];
                    snapshot.forEach((childSnapshot) => {
                        const placeData = childSnapshot.val();
                        if (placeData.planet === selectedPlanet) {
                            data.push({ ...placeData, id: childSnapshot.key });
                        }
                    });
                    setPlace(data);
                    setIsLoading(false);
                });

                setIsLoading(false);

            } catch (error) {
                setIsLoading(false);
                alert("Error fetching data");

            }
        };
        getPlaces();
    }, []);


    const goToNextPlace = () => {
        if (placeIndex < place.length - 1) {
            setPlaceIndex(placeIndex + 1);
        }
        else {
            setPlaceIndex(0);
        }
    };

    const goToPreviousPlace = () => {
        if (placeIndex > 0) {
            setPlaceIndex(placeIndex - 1);
        }
        else {
            setPlaceIndex(place.length - 1);
        }
    };


    const iconsStyle = {
        display: "inline-block",
        background: "transparent",
        border: "none",
        cursor: "pointer",
    }

    const listBorder = {
        border: "2px solid grey",
        borderRadius: "8px",
        background: "transparent",
        width: '300px',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '3%  6%',
        color: 'grey',
        margin: '2% 1%',
    }
    return (
        <>
            {
                isLoading ? ( 
                    <div className="text-center">
                    <div className="spinner-border" role="status">
                    </div>
                    Loading...
                    </div>
                    ) : (
                    <div className="container-fluid" style={{backgroundColor: "black",color:"white",minHeight:'100vh'}}>
    
                            <h2 >Place Selection</h2>
                            <h3 style={{color:"grey"}}>{selectedPlanet}</h3>
                            <img src={require(`../../../site/public/images/planets/${selectedPlanet.toLowerCase()}.png`)} alt={selectedPlanet} width="250" height="250" />

                        {place.length > 0 && (
                            <div>
                                <div>
                                    <button onClick={goToPreviousPlace} style={iconsStyle}><BsArrowLeftCircleFill size={30} color="white" /></button>
                                    <h3 style={{ display: "inline-block", width: '300px' }}>{place[placeIndex].place}</h3>
                                    <button style={iconsStyle} onClick={goToNextPlace}><BsFillArrowRightCircleFill size={30} color="white" /></button>
                                </div>

                                <div>
                                    <button onClick={goToPreviousPlace} style={iconsStyle}><BsArrowLeftCircleFill size={30} color="white" /></button>
                                    <h3 style={{ display: "inline-block", width: '300px' }}>{place[placeIndex].place}</h3>
                                    <button style={iconsStyle} onClick={goToNextPlace}><BsFillArrowRightCircleFill size={30} color="white" /></button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <ul className="list-group">
                                        <h5 style={listBorder}><span>Area</span><span style={{ textAlign: 'right' }}>{place[placeIndex].area.toLocaleString()} km</span></h5>
                                        <h5 style={listBorder}><span>Temperature</span><span style={{ textAlign: 'right' }}>{place[placeIndex].temperature}&deg;C</span></h5>
                                        <h5 style={listBorder}><span>Gravity</span><span style={{ textAlign: 'right' }}>{place[placeIndex].gravity}g</span></h5>
                                    </ul>
                                </div>
                            </div>
                        )}
                        <div>
                            <button type="button" className="btn btn-primary my-3 mx-1 fs-6" style={{ width: '150px' }} onClick={() => setCurrentPage(currentPage - 1)}>Back</button>
                            <button type="button" className="btn btn-danger my-3 mx-1  fs-6" style={{ width: '150px' }} onClick={() => setCurrentPage(currentPage + 1)}>Continue</button>
                        </div>
                    </div>
                )
            }
        </>

    )
}

export default PlaceSelection;