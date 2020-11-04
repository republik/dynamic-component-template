import React from 'react'
import { css } from 'glamor'

import { fontFamilies, ColorContextProvider } from '@project-r/styleguide'

import 'glamor/reset'

css.global('html', { boxSizing: 'border-box' })
css.global('*, *:before, *:after', { boxSizing: 'inherit' })

css.global('body', {
  width: '100%',
  fontFamily: fontFamilies.sansSerifRegular,
})

// avoid gray rects over links and icons on iOS
css.global('*', {
  WebkitTapHighlightColor: 'transparent',
})
// avoid orange highlight, observed around full screen gallery, on Android
css.global('div:focus', {
  outline: 'none',
})

// 'light' or 'dark' modes are available
const Index = ({ children }) => (
  <ColorContextProvider root colorSchemeKey='dark'>
    {children}
  </ColorContextProvider>
)

export default Index
