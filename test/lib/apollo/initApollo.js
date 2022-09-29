import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'

import { API_URL, API_WS_URL } from '../constants'
import possibleTypes from './possibleTypes.json'

let apolloClient = null

const hasSubscriptionOperation = ({ query: { definitions } }) =>
  definitions.some(
    ({ kind, operation }) =>
      kind === 'OperationDefinition' && operation === 'subscription'
  )

function create (initialState = {}, headers = {}) {
  const http = new HttpLink({
    uri: API_URL,
    credentials: 'include',
    headers: {
      cookie: headers.cookie,
      accept: headers.accept
    }
  })

  const link = process.browser
    ? ApolloLink.split(
      hasSubscriptionOperation,
      new WebSocketLink({
        uri: API_WS_URL,
        options: {
          lazy: true,
          reconnect: true,
          timeout: 50000
        }
      }),
      http
    )
    : http

  return new ApolloClient({
    connectToDevTools: process.browser,
    cache: new InMemoryCache({
      typePolicies: {
        Meta: {
          merge: true,
        },
        Discussion: {
          fields: {
            userPreference: {
              merge: true,
            },
          },
        },
      },
      possibleTypes,
    }).restore(initialState || {}),
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link
  })
}

export default function initApollo (initialState, headers) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, headers)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, headers)
  }

  return apolloClient
}