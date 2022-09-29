import React from 'react'

import { parse } from '@orbiting/remark-preset'
import { createArticleSchema } from '@project-r/styleguide'
import { createRequire } from '@project-r/styleguide'

import {
  graphql,
  withApollo,
  withMutation,
  withQuery,
  withSubscription,
} from '@apollo/client/react/hoc'
import { Mutation, Query, Subscription } from '@apollo/client/react/components'
import { ApolloConsumer, ApolloProvider, gql } from '@apollo/client'
import compose from 'lodash/flowRight'

import Render from '../components/Render'
// import md from '../../../../Articles/article-x/article.md'
import md from '../article.md'

import { withRouter } from 'next/router'

const schema = createArticleSchema({
  dynamicComponentRequire: createRequire().alias({
    'react-apollo': {
      // Reexport react-apollo
      // (work around until all dynamic components are updated)
      // ApolloContext is no longer available but is exported in old versions of react-apollo
      ApolloConsumer,
      ApolloProvider,
      Query,
      Mutation,
      Subscription,
      graphql,
      withQuery,
      withMutation,
      withSubscription,
      withApollo,
      compose,
    },
    // Reexport graphql-tag to be used by dynamic-components
    'graphql-tag': gql,
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
