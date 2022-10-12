import React from 'react'
import { css } from 'glamor'
import { mediaQueries } from '@project-r/styleguide'
import ChartExample from './ChartExample'
import Query from './Query'

// const ASSETS_BASE_URL = 'https://cdn.repub.ch/s3/republik-assets/dynamic-components/REPOSLUG/assets'

const Index = ({ type, text }) => {
  if (type === 'ChartExample') {
    return <ChartExample />
  }
  if (type === 'Query') {
    return <Query />
  }
  return (
    <div
      {...css({
        textAlign: 'center',
        fontSize: '1rem',
        [mediaQueries.mUp]: {
          fontSize: '2rem',
        },
      })}
    >
      {text || 'Hello World'}
    </div>
  )
}

export default Index
