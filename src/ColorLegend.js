import React from 'react'
import { css } from 'glamor'

import { Label, useColorContext } from '@project-r/styleguide'

const styles = {
  legendEntry: css({
    display: 'flex',
    marginTop: '5px',
    alignItems: 'center',
    paddingRight: '10px',
  }),
  circle: css({
    display: 'inline-block',
    borderRadius: '50%',
    width: '10px',
    height: '10px',
    marginRight: '3px',
    marginTop: '0.1em',
  }),
}

const ColorLegend = (props) => {
  const { items, labels } = props
  const [colorScheme] = useColorContext()

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {items.map((item, index) => (
        <div key={index} {...styles.legendEntry}>
          <span
            {...styles.circle}
            {...colorScheme.set('backgroundColor', item)}
          ></span>
          <Label>{labels[item]}</Label>
        </div>
      ))}
    </div>
  )
}

export default ColorLegend
