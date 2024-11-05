import React from 'react';
import Layout from '../components/Layout.js';
import '../styles/global.css'; // Import global CSS


const MyApp = ({ Component, pageProps }) => {
  return (
<Layout>  
  <Component {...pageProps} />
</Layout>

);
};

export default MyApp;