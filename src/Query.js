import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Interaction, Button, Loader } from '@project-r/styleguide'

const MeStatus = graphql(
  gql`
    query {
      me {
        id
        name
      }
    }
  `
)(({ data }) => (
  <>
    <Loader
      loading={data.loading}
      error={data.error}
      render={() => (
        <Interaction.P>
          {data.me ? (
            <>
              Angemeldet als <strong>{data.me.name}</strong>
            </>
          ) : (
            'Nicht angemeldet'
          )}
        </Interaction.P>
      )}
    />

    <Button onClick={() => data.refetch()}>Erneut laden</Button>
  </>
))

const LiveQuery = () => {
  const [live, setLive] = useState()

  return (
    <>
      <Interaction.P>
        Man kann GraphQL Abfragen in dynamischen Komponeten machen. Damit es hier funktioniert muss `test/.env` auf ein lokales Backend zeigen und dieses den Host hier auf der `CORS_ALLOWLIST_URL` zulassen.
      </Interaction.P>
      {live ? (
        <MeStatus />
      ) : (
        <Button
          onClick={() => {
            setLive(true)
          }}
        >
          Los
        </Button>
      )}
    </>
  )
}

export default LiveQuery
