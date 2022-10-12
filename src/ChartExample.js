import React from 'react'
import {
  ChartTitle,
  ChartLead,
  Chart,
  ChartLegend,
} from '@project-r/styleguide'

export default () => {
  return (
    <>
      <ChartTitle>Zufällige Quote im internationalen Vergleich</ChartTitle>
      <ChartLead>in Prozent des BIP</ChartLead>
      <Chart
        config={{
          type: 'Bar',
          numberFormat: '.0%',
          sort: 'none',
          y: 'country'
        }}
        values={[
          'Frankreich',
          'Österreich',
          'Italien',
          'Deutschland',
          'Schweiz',
          'USA',
          'Irland',
        ].map((country) => ({
          country,
          value: String(Math.random()),
        }))}
      />
      <ChartLegend>Quelle: Math.random()</ChartLegend>
    </>
  )
}
