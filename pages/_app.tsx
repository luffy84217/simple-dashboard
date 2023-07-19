import React from 'react';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import Layout from '../components/Layout';

import '@fortawesome/fontawesome-svg-core/styles.css';
import initFontAwesome from '../utils/initFontAwesome';
import '../styles/globals.css';

initFontAwesome();

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <title>Simple User Dashboard App</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}
