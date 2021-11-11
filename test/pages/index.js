import React from 'react'

import { parse } from '@orbiting/remark-preset'
import { createArticleSchema } from '@project-r/styleguide'
import { createRequire } from '@project-r/styleguide'

import * as reactApollo from 'react-apollo'
import * as graphqlTag from 'graphql-tag'

import Render from '../components/Render'
// import md from '../../../../Articles/article-x/article.md'
import md from '../article.md'

import { withRouter } from 'next/router'

const schema = createArticleSchema({
  dynamicComponentRequire: createRequire().alias({
    'react-apollo': reactApollo,
    'graphql-tag': graphqlTag
  })
})
const mdast = parse(md)

export default withRouter(({ router }) => {
  return (
    <Render mdast={router.query.extract
      ? {...mdast, children: mdast.children.slice(+router.query.extract, +router.query.extract + 1)}
      : mdast
    } schema={schema} />
  )
})
