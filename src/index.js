import React, { Fragment } from 'react'
import { css } from 'glamor'
import { mediaQueries } from '@project-r/styleguide'

// const ASSETS_BASE_URL = 'https://cdn.repub.ch/s3/republik-assets/dynamic-components/REPOSLUG/asserts'

const Index = ({ text }) => {
  return <div {...css({
    textAlign: 'center',
    fontSize: '1rem',
    [mediaQueries.mUp]: {
      fontSize: '2rem'
    }
  })}>
    {text || 'Hello World'}
  </div>
}

export default Index
