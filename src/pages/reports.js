import React, { useEffect, useState } from 'react';


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
    <div>

<section class="w-full lg:h-screen flex items-center justify-center">
  {/* Parent Container of DIVS */}
  <div class="max-w-4xl w-full rounded-lg shadow-2xl p-6 hover:shadow-[8px_8px_24px_rgba(0,0,0,0.3)] transition-shadow grid grid-cols-1 sm:grid-cols-2 gap-4">

  {/* Left Side */}
  <div class="max-w-lg w-full bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div class="mx-auto max-w-lg text-center">

      <p class="mt-4 text-gray-500">
       "Every shared need plants the seed for a stronger, more caring community to grow"
      </p>
      <br></br>
    </div>

  <form class="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
      <div class="flex items-center">
        <label class="text-black-400 w-36 text-sm">Name</label>
        <input type="text" placeholder="Enter your name"
          class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
      </div>

      <div class="flex items-center">
        <label class="text-black-400 w-36 text-sm">Email</label>
        <input type="email" placeholder="Enter your email"
          class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
      </div>

      <div class="flex items-center">
        <label class="text-black-400 w-36 text-sm">Phone No.</label>
        <input type="number" placeholder="Enter your phone number"
          class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
      </div>

      <div class="flex items-center">
        <label class="text-black-400 w-36 text-sm">Location</label>
        <input type="text" placeholder="Enter your location"
          class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
      </div>

     <div class="flex items-center space-x-4">
      <label for="report-message" class="text-black-400 w-36 text-sm">Report Message</label>
      <textarea id="report-message" placeholder="Type your message here..."
          class="px-3 py-2 w-full h-32 border-2 rounded-md focus:border-[#333] outline-none text-sm bg-white resize-none"></textarea>
      </div>

   <div class="flex items-center space-x-4">
  <label for="category" class="text-black-400 w-36 text-sm">
    Select Category
  </label>

  <select id="category"
    class="px-3 py-2 w-full text-sm font-medium border-2 border-black-300 rounded-md shadow-md h-10 focus:border-blue-600 focus:ring-2 focus:ring-inset focus:ring-blue-600 bg-white">
    <option value="education">Education</option>
    <option value="energy">Energy</option>
    <option value="equality">Equality</option>
    <option value="financial">Financial</option>
    <option value="food">Food</option>
    <option value="health">Health</option>
    <option value="infrastructure">Infrastructure</option>
    <option value="other">Other</option>
  </select>
</div>


      <button type="button"
        class="!mt-8 px-6 py-2 w-full bg-[#064E65] text-sm text-white mx-auto block">Submit</button>
    </form>

  </div>

{/* Left Side */}
  <div class="flex items-center rounded-lg p-6" >
    <img
      alt=""
      src="/images/handsDraw.png"
    />
  </div>

</div>

</section>
      {/* {error && <p>Error: {error}</p>}
      {loading ? <p>Loading...</p> : <Map lat={latitude} lng={longitude} />} */}
    </div>
  );
};


export default Reports;