import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import carIcon from '../src/assets/car.svg';

const mapContainerStyle = { width: '100%', height: '500px' };

const CarTracker = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, speed: 0 });
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "API",
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('http://localhost:3000/get-location');
        const data = await response.json();
        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
        });
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    const intervalId = setInterval(fetchLocation, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current && markerRef.current) {

      const map = mapRef.current;
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: { lat: location.latitude, lng: location.longitude },
        title: 'Car Location',
        icon: {
          url: carIcon,
          scaledSize: new window.google.maps.Size(40, 40),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(20, 20),
        },
      });

      markerRef.current = marker;

      return () => {
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
      };
    }
  }, [isLoaded, location]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <h1>Car Tracker</h1>
      <div style={{ marginBottom: '20px' }}>
        <p>Latitude: {location.latitude}</p>
        <p>Longitude: {location.longitude}</p>
        <p>Speed: {location.speed} km/h</p>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: location.latitude, lng: location.longitude }}
        zoom={15}
        onLoad={(map) => (mapRef.current = map)}
      >
      </GoogleMap>
    </div>
  );
};

export default CarTracker;
