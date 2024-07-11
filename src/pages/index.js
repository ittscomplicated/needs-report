import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import styles from '../styles/Home.module.css';

const HomePage = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setError(null);
          setLoading(false);
        },
        (error) => {
          setError(error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lat = parseFloat(e.target.latitude.value);
    const lng = parseFloat(e.target.longitude.value);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid numerical coordinates.');
      return;
    }

    setLatitude(lat);
    setLongitude(lng);
    setLoading(false);

    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      alert('Coordinates stored successfully');
    } catch (error) {
      console.error('Error storing coordinates:', error);
      alert('Failed to store coordinates');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Enter Coordinates</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="latitude">Latitude:</label>
          <input type="text" id="latitude" name="latitude" className={styles.input} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="longitude">Longitude:</label>
          <input type="text" id="longitude" name="longitude" className={styles.input} required />
        </div>
        <button type="submit" className={styles.button}>Submit</button>
      </form>
      <button onClick={getUserLocation} className={styles.button}>Reset to Current Location</button>
      {error && <p>Error: {error}</p>}
      {loading ? <p>Loading...</p> : <Map lat={latitude} lng={longitude} />}
    </div>
  );
};

export default HomePage;
