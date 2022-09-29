const withTM = require('next-transpile-modules')([
  '@project-r/styleguide',
])

module.exports = withTM({
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.md/,
        use: 'raw-loader'
      }
    )
    return config
  }
})
