import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import styles from '../styles/Home.module.css';


const Reports = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [categoryNeed, setCategoryNeed] = useState(null);
  const [needMessage, setNeedMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // const getUserLocation = () => {
  //   setLoading(true);
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLatitude(position.coords.latitude);
  //         setLongitude(position.coords.longitude);
  //         setError(null);
  //         setLoading(false);
  //       },
  //       (error) => {
  //         setError(error.message);
  //         setLoading(false);
  //       }
  //     );
  //   } else {
  //     setError('Geolocation is not supported by this browser.');
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const name = e.target.userName.value;
  const email = e.target.userEmail.value; 
  const phone = e.target.userPhone.value;
  const location = e.target.userLocation.value;
  const categoryNeed = [
    e.target.userCategoryNeed.checked && e.target.userCategoryNeed.value,
    e.target.userCategoryNeed2.checked && e.target.userCategoryNeed2.value,
    e.target.userCategoryNeed3.checked && e.target.userCategoryNeed3.value,
    e.target.userCategoryNeed4.checked && e.target.userCategoryNeed4.value,
    e.target.userCategoryNeed5.checked && e.target.userCategoryNeed5.value,
    e.target.userCategoryNeed6.checked && e.target.userCategoryNeed6.value,
    e.target.userCategoryNeed7.checked && e.target.userCategoryNeed7.value,
    e.target.userCategoryNeed8.checked && e.target.userCategoryNeed8.value,
  ].filter(Boolean);
  const needMessage = e.target.userNeedMessage.value;

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude, name, email, phone, location, categoryNeed, needMessage }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    alert('Data stored successfully');
  } catch (error) {
    console.error('Error storing data:', error);
    alert('Failed to store data');
  }
};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Report A Need</h1>
      <form onSubmit={handleSubmit} className={styles.form}>

    
        <div className={styles.inputGroup}>
          {/* NAME INPUT */}
           <label htmlFor="Name">Name:</label>
          <input type="text" id="name" name="userName" className={styles.input} required />

          {/* EMAIL INPUT */}
          <label htmlFor="Email">Email:</label>
          <input type="text" id="email" name="userEmail" className={styles.input} required />
          
          {/* PHONE INPUT */}
          <label htmlFor="Phone">Phone:</label>
          <input type="text" id="phone" name="userPhone" className={styles.input} required />
          
          {/* LOCATION INPUT */}
          {/* <label htmlFor="Location">Location:</label><br></br>
          <button onClick={getUserLocation} className={styles.button}>Get Current Location</button> */}

          <input type="text" id="location" name="userLocation" className={styles.input} required />

          {/* CATEGORY INPUT */}
          {/* Education, Energy, Equality, Financial, Food, Health, Infrastructure, Other */}
           <h4>CategoryNeed:</h4>
            <input type="checkbox" id="categoryNeed" name="userCategoryNeed" value="Education"/>
            <label htmlFor="categoryNeed">Education</label> <br></br>

            <input type="checkbox" id="categoryNeed2" name="userCategoryNeed2" value="Energy"/>
            <label htmFor="categoryNeed2">Energy</label><br></br>

            <input type="checkbox" id="categoryNeed3" name="userCategoryNeed3" value="Equality"/>
            <label htmFor="categoryNeed3">Equality</label><br></br>

            <input type="checkbox" id="categoryNeed4" name="userCategoryNeed4" value="Financial"/>
            <label htmFor="categoryNeed4">Financial</label><br></br>

            <input type="checkbox" id="categoryNeed5" name="userCategoryNeed5" value="Food"/>
            <label htmFor="categoryNeed5">Food</label><br></br>

            <input type="checkbox" id="categoryNeed6" name="userCategoryNeed6" value="Health"/>
            <label htmFor="categoryNeed6">Health</label><br></br>

            <input type="checkbox" id="categoryNeed7" name="userCategoryNeed7" value="Infrastructure"/>
            <label htmFor="categoryNeed7">Infrastructure</label><br></br>

            <input type="checkbox" id="categoryNeed8" name="userCategoryNeed8" value="Other"/>
            <label htmFor="categoryNeed8">Other</label><br></br>


          {/* MESSAGE INPUT */}
          <br></br>
          <label htmlFor="NeedMessage">NeedMessage:</label>
          <input type="text" id="needMessage" name="userNeedMessage" className={styles.input} required />

        </div>
        <button type="submit" className={styles.button}>Submit</button>

      </form>
      {error && <p>Error: {error}</p>}
      {loading ? <p>Loading...</p> : <Map lat={latitude} lng={longitude} />}
    </div>
  );
};


export default Reports;
