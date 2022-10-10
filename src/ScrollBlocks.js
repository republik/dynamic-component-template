import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import {
  Center,
  mediaQueries,
  Editorial,
  createFormatter,
  Label,
  ChartTitle,
  ChartLead,
} from '@project-r/styleguide'
import { withColorScheme } from './index'
import ContextBox, { ContextBoxValue } from './ContextBox'
import { formatLocale } from 'd3'
import ColorLegend from './ColorLegend'

const colorItems = ['CP045', 'CP072', 'CP011', 'CP112', 'CP041', 'CP082_083']

import Plot from './Plot'

export const swissNumbers = formatLocale({
  decimal: ',',
  grouping: [3],
  minus: '\u2212',
  percent: '\u2009%',
})

const format = (number) => {
  return swissNumbers.format('.1%')(number)
}

const ARTBOARD_SIZE = [360, 500]
const ARTBOARD_BUFFER = 100
const ARTBOARD_BUFFER_SMALL = 25
const DEFAULT_MARGIN_LEFT = 10

const styles = {
  area: css({
    maxWidth: 890,
    margin: '0 auto',
  }),
  anchor: css({
    display: 'block',
    visibility: 'hidden',
    position: 'relative',
    top: -100,
    [mediaQueries.mUp]: {
      top: -100,
    },
  }),
  inner: css({
    position: 'relative',
    marginTop: '20px',
  }),
  scrollBlock: css({
    position: 'relative',
    padding: '20px 15px',
    [mediaQueries.mUp]: {
      marginLeft: ARTBOARD_SIZE[0] + 30,
      paddingLeft: 0,
      paddingRight: 0,
      width: 695 - ARTBOARD_SIZE[0] + 10, // make text box little bit wider than usual text flow
    },
  }),
  artboard: css({
    // border: '1px solid black', // enable for measurement in dev
    display: 'block',
    maxWidth: ARTBOARD_SIZE[0],
    height: ARTBOARD_SIZE[1],
    [mediaQueries.onlyS]: {
      margin: '0 auto',
    },
  }),
  spacer: css({
    pointerEvents: 'none',
    height: '80vh',
  }),
  onlyS: css({
    display: 'none',
    [mediaQueries.onlyS]: {
      display: 'block',
    },
  }),
  mUp: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'block',
    },
  }),
  highlight: css({
    whiteSpace: 'nowrap',
    margin: '-1px 0 1px 0',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0.8em 0.3em',
    padding: '0.1em 0.1em 0.1em 0.2em',
    lineHeight: '20px',
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

const Spacer = ({ height, mediaQuery }) => (
  <div {...styles.spacer} {...styles[mediaQuery]} style={{ height: height }} />
)

class Story extends Component {
  constructor(props, ...args) {
    super(props, ...args)

    this.state = {
      position: 'before',
      buffer: ARTBOARD_BUFFER,
      phaseIndex: 0,
    }
    this.refs = {}
    this.blocks = {}

    this.refKeys = props.phases.map((phase, i) => `p${i}`)
    this.refKeys.map((key) => {
      this.blocks[key] = {
        setRef: (ref) => {
          this.blocks[key].ref = ref
        },
      }
    })

    this.setInnerRef = (ref) => {
      this.innerRef = ref
    }
    this.setPlotRef = (ref) => {
      this.plotRef = ref
    }

    this.setPhaseState = (phaseState) =>
      this.setState((state) => ({
        phaseState: {
          ...state.phaseState,
          ...phaseState,
        },
      }))

    this.setHoverPoint = (hoverPoint) => {
      console.log({ hoverPoint })
      if (!hoverPoint) {
        this.setState(() => ({ hoverPoint: null }))
        return
      }
      this.setState(() => ({
        hoverPoint,
      }))
    }

    this.onScroll = () => {
      const y = window.pageYOffset
      const cx = y + window.innerHeight / 2
      const calcDistance = (block) =>
        Math.min(Math.abs(block.y0 - cx), Math.abs(block.y1 - cx))
      const activeBlock = this.refKeys.reduce((active, key) => {
        if (
          calcDistance(this.blocks[key]) < calcDistance(this.blocks[active])
        ) {
          return key
        }
        return active
      })
      const phaseIndex = activeBlock ? this.refKeys.indexOf(activeBlock) : 0
      if (this.state.phaseIndex !== phaseIndex) {
        this.setState({ phaseIndex, phaseState: {} })
      }

      const { innerY0, innerY1, buffer, height } = this.state
      let position = 'before'
      if (y + buffer + height > innerY1) {
        position = 'after'
      } else if (y + buffer >= innerY0) {
        position = 'fixed'
      }
      if (this.state.position !== position) {
        this.setState({ position })
      }
    }

    this.measure = () => {
      const y = window.pageYOffset
      this.refKeys.forEach((key) => {
        const block = this.blocks[key]
        const { top, height } = block.ref.getBoundingClientRect()
        block.y0 = y + top
        block.y1 = block.y0 + height
      })

      const windowHeight = window.innerHeight

      const { height } = this.plotRef.getBoundingClientRect()

      let buffer = ARTBOARD_BUFFER
      if (windowHeight < height + ARTBOARD_BUFFER) {
        buffer = ARTBOARD_BUFFER_SMALL
      }

      const innerRect = this.innerRef.getBoundingClientRect()
      const { left, width: innerWidth } = innerRect
      const innerY0 = y + innerRect.top
      const innerY1 = innerY0 + innerRect.height
      const heightRatio = Math.min(
        1,
        Math.max(0.6, (windowHeight - buffer - 200) / innerWidth)
      )

      if (
        this.state.heightRatio !== heightRatio ||
        this.state.innerWidth !== innerWidth ||
        this.state.height !== height ||
        this.state.buffer !== buffer ||
        this.state.left !== left ||
        this.state.innerY0 !== innerY0 ||
        this.state.innerY1 !== innerY1
      ) {
        this.setState(
          {
            innerWidth,
            heightRatio,
            height,
            buffer,
            left,
            innerY0,
            innerY1,
          },
          this.onScroll
        )
      } else {
        this.onScroll()
      }
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate() {
    this.measure()
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }

  render() {
    const {
      left,
      position,
      phaseIndex,
      phaseState,
      buffer,
      height,
      heightRatio,
      hoverPoint,
    } = this.state
    const isFixed = position === 'fixed'
    const isAfter = position === 'after'

    const scaleFactor =
      innerWidth < 375 ? innerWidth / (ARTBOARD_SIZE[0] + 10) : 1

    const marginLeft =
      innerWidth < 375 &&
      left + (Math.abs(innerWidth - ARTBOARD_SIZE[0]) / 2) * scaleFactor

    const { phases, anchor, colorScheme, translations } = this.props

    const t = createFormatter(translations)
    const phase = phases[phaseIndex] || phases[0]

    return (
      <div {...styles.area}>
        <Center>
          <ChartTitle>{this.props.title}</ChartTitle>
          <ChartLead>{this.props.lead}</ChartLead>
          {/* <ColorLegend items={colorItems} labels={this.props.labels} /> */}
          <div ref={this.setInnerRef} {...styles.inner}>
            <a {...styles.anchor} id={anchor} />
            <div
              style={{
                marginLeft: -marginLeft || -DEFAULT_MARGIN_LEFT,
                position: isFixed ? 'fixed' : 'absolute',
                top: isAfter ? undefined : isFixed ? buffer : 0,
                left: isFixed ? left : 0,
                right: isFixed ? left : 0,
                bottom: isAfter ? 0 : undefined,
              }}
              ref={this.setPlotRef}
            >
              <div>
                <div
                  {...styles.artboard}
                  style={{ transform: 'scale(' + scaleFactor + ')' }}
                >
                  <Plot
                    {...phaseState}
                    phase={phase}
                    onPhaseState={this.setPhaseState}
                    size={ARTBOARD_SIZE[0]}
                    innerWidth={innerWidth}
                    heightRatio={heightRatio}
                    labels={this.props.labels}
                    setHoverPoint={this.setHoverPoint}
                  />
                  {hoverPoint && (
                    <ContextBox
                      yOrientation={hoverPoint.y < 150 ? 'below' : 'top'}
                      xOrientation={hoverPoint.x > 160 ? 'right' : 'left'}
                      x={hoverPoint.x + 15}
                      y={
                        hoverPoint.y < 150
                          ? hoverPoint.y - 10
                          : hoverPoint.y - 30
                      }
                    >
                      <ContextBoxValue
                        label={this.props.labels[hoverPoint.COICOP]}
                      >
                        {this.props.labels['toolTipLabelInflation']}:
                        {' ' + format(hoverPoint.inflation)}
                      </ContextBoxValue>
                    </ContextBox>
                  )}
                  <Label style={{ marginLeft: '10px' }}>
                    {this.props.labels.source}
                    <Link
                      href={this.props.labels.href}
                      text={this.props.labels.sourceText}
                    />
                  </Label>
                </div>
              </div>
            </div>
            {phases.map((phase, i) => {
              const key = `p${i}`
              return (
                <Fragment key={key}>
                  <Spacer />
                  <div
                    {...colorScheme.set('backgroundColor', 'scrollBlockBg')}
                    {...styles.scrollBlock}
                    ref={this.blocks[key].setRef}
                  >
                    <a {...styles.anchor} id={`${anchor}-${i + 1}`} />
                    {phase.title && <ChartTitle>{phase.title}</ChartTitle>}
                    {phase.step &&
                      [].concat(phase.step + '/text').map((text, i) => (
                        <ChartLead key={i}>
                          {t.elements(text, {
                            CP011: (
                              <Highlight
                                key={`CP011-${i}`}
                                colorScheme={colorScheme}
                                color={'CP011'}
                                text={t(phase.step + '/CP011')}
                              />
                            ),
                            CP045: (
                              <Highlight
                                key={`CP045-${i}`}
                                colorScheme={colorScheme}
                                color={'CP045'}
                                text={t(phase.step + '/CP045')}
                              />
                            ),
                            CP072: (
                              <Highlight
                                key={`CP072-${i}`}
                                colorScheme={colorScheme}
                                color={'CP072'}
                                text={t(phase.step + '/CP072')}
                              />
                            ),
                            CP112: (
                              <Highlight
                                key={`CP112-${i}`}
                                colorScheme={colorScheme}
                                color={'CP112'}
                                text={t(phase.step + '/CP112')}
                              />
                            ),
                            CP041: (
                              <Highlight
                                key={`CP041-${i}`}
                                colorScheme={colorScheme}
                                color={'CP041'}
                                text={t(phase.step + '/CP041')}
                              />
                            ),
                            CP082_083: (
                              <Highlight
                                key={`CP082_083-${i}`}
                                colorScheme={colorScheme}
                                color={'CP082_083'}
                                text={t(phase.step + '/CP082_083')}
                              />
                            ),
                            8.9: (
                              <span style={{ whiteSpace: 'nowrap' }}>
                                (–8,9 Prozent)
                              </span>
                            ),
                            6.3: (
                              <span style={{ whiteSpace: 'nowrap' }}>
                                (–6,3 Prozent)
                              </span>
                            ),
                            3.2: (
                              <span style={{ whiteSpace: 'nowrap' }}>
                                (–3,2 Prozent)
                              </span>
                            ),
                            2: (
                              <span style={{ whiteSpace: 'nowrap' }}>
                                (+2 Prozent)
                              </span>
                            ),
                            8.1: (
                              <span style={{ whiteSpace: 'nowrap' }}>
                                (+8,1 Prozent)
                              </span>
                            ),
                            1.5: (
                              <span style={{ whiteSpace: 'nowrap' }}>
                                (+1,5 Prozent)
                              </span>
                            ),
                            0.6: (
                              <span style={{ whiteSpace: 'nowrap' }}>
                                (–0,6 Prozent)
                              </span>
                            ),
                            14: (
                              <span style={{ whiteSpace: 'nowrap' }}>
                                (+14 Prozent)
                              </span>
                            ),
                          })}
                        </ChartLead>
                      ))}
                  </div>
                </Fragment>
              )
            })}
            <Spacer height={height} />
          </div>
        </Center>
      </div>
    )
  }
}

export default withColorScheme(Story)

const Highlight = (props) => {
  const { color, text, colorScheme } = props
  return (
    <span style={{ display: 'inline-block', verticalAlign: 'text-top' }}>
      <span
        {...styles.highlight}
        {...colorScheme.set('backgroundColor', color + '-background')}
      >
        <span
          {...styles.circle}
          {...colorScheme.set('backgroundColor', color)}
        />
        {text}
      </span>
    </span>
  )
}

const Link = (props) => {
  const { href, text } = props
  return <Editorial.A href={href}>{text}</Editorial.A>
}
