import React from 'react'
import { ApolloProvider } from '@apollo/client'
import Head from 'next/head'

import initApollo from '../lib/apollo/initApollo'

const WebApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={initApollo()}>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default WebApp
