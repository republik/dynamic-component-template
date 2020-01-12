import React from 'react'

import { renderMdast } from 'mdast-react-render'
import visit from 'unist-util-visit'

import Frame from './Frame'

const Render = ({ mdast, schema }) => {
  const indexUrl = require('file-loader!../../build/index.js')

  visit(mdast, 'zone', node => {
    if (node.identifier === 'DYNAMIC_COMPONENT' && node.data.src.match(/dynamic-components\/[^\/]+\/index\.js/)) {
      node.data.src = '/build/index.js' +
        '?u=' + encodeURIComponent(indexUrl)
    }
  })

  const dark =
    mdast &&
    mdast.meta &&
    mdast.meta.darkMode

  return <Frame dark={dark}>
    <div key={indexUrl}>
      {renderMdast(mdast, schema)}
    </div>
  </Frame>
}

export default Render
