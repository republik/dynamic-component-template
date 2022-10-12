import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

/* libraries */
import * as flubber from 'flubber'

const PathComponent = (props) => {
  const { d, fill, visible, style } = props
  const prevD = useRef({ d }).current
  const pathRef = useRef()

  useEffect(() => {
    const interpolator = flubber.interpolate(prevD, d)
    d3.select(pathRef.current)
      .transition()
      .duration(500)
      .attrTween('d', () => interpolator)
  }, [d])

  return <path ref={pathRef} fill={fill} {...props} />
}

export default PathComponent
