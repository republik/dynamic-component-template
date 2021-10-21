import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import { fontStyles, colors, mediaQueries } from '@project-r/styleguide'
import { Chart } from '@project-r/styleguide/chart'
import { mapData } from './data'

import { csvParse } from 'd3-dsv'

const styles = {
  tabs: css({
    display: 'flex',
    marginTop: 3,
    ...fontStyles.sansSerifRegular21,
    color: colors.text,
    justifyContent: 'center',
    flexWrap: 'wrap',
  }),
  tabContainer: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px',
    padding: '0px 6px',
    [mediaQueries.mUp]: {
      padding: '0px 10px',
    },
  }),
  tab: css({
    textAlign: 'left',
    ...fontStyles.sansSerifRegular21,
    WebkitTapHighlightColor: 'transparent',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    outline: 'none',
    WebkitAppearance: 'none',

    ':last-child': {
      paddingRight: 0,
    },
    ':first-child': {
      paddingLeft: 0,
    },
  }),
  circle: css({
    display: 'inline-block',
    borderRadius: '50%',
    width: '14px',
    height: '14px',
    marginRight: '4px',
    marginTop: '3px',
  }),
}

const Index = () => {
  const [activeTab, setActiveTab] = useState([
    'critically_insufficient',
    'highly_insufficient',
    'insufficient',
    'almost_sufficient',
    'compatible',
  ])
  const [colorMapping, setColorMapping] = useState()
  const chartData = csvParse(mapData)

  const tabsDict = {
    critically_insufficient: '#7f7f7f',
    highly_insufficient: '#d62728',
    insufficient: '#ff7f0e',
    almost_sufficient: '#17becf',
    compatible: '#2ca02c',
  }

  const translationDict = {
    critically_insufficient: 'Kritisch ungenügend',
    highly_insufficient: 'Höchst ungenügend',
    insufficient: 'Ungenügend',
    almost_sufficient: 'Beinahe genügend',
    compatible: '1,5-Grad-Ziel wird erreicht',
  }

  useEffect(() => {
    const colorsObject = {}
    activeTab.forEach((d) => (colorsObject[d] = tabsDict[d]))
    setColorMapping(colorsObject)
  }, [activeTab])

  const handleTabClick = (item) =>
    activeTab.includes(item)
      ? setActiveTab(activeTab.filter((d) => d !== item))
      : setActiveTab((currentArray) => [...currentArray, item])

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
      <div {...styles.tabs}>
        {Object.keys(tabsDict).map((d) => (
          <div {...styles.tabContainer} key={d}>
            <span
              {...styles.circle}
              style={{
                backgroundColor: activeTab.includes(d)
                  ? tabsDict[d]
                  : colors.disabled,
              }}
            />
            <button
              {...styles.tab}
              style={{
                color: activeTab.includes(d) ? '#000' : colors.disabled,
              }}
              onClick={(e) => {
                e.preventDefault()
                handleTabClick(d)
              }}
            >
              {translationDict[d]}
            </button>
          </div>
        ))}
      </div>
      <Chart
        config={{
          type: 'GenericMap',
          colorLegend: false,
          heightRatio: 0.469,
          choropleth: true,
          color: 'category',
          colorMap: colorMapping,
          features: {
            url:
              'https://cdn.repub.ch/s3/republik-assets/dynamic-components/climate-action-tracker-map/assets/static/geo/world-atlas-110m-without-antarctic.json',
            object: 'countries',
          },
          label: 'label',
        }}
        values={chartData.map((d) => {
          return {
            feature: d.feature.trim(),
            category: d.category,
          }
        })}
      />
    </div>
  )
}

export default Index
