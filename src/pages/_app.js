import React from 'react';
import '../styles/global.css';  // Import global CSS

const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;