import React, { useState } from 'react';
import { ArcElement } from "chart.js";
import Chart from "chart.js/auto";
import { Pie, Doughnut } from 'react-chartjs-2';
import Grid from '@mui/material/Grid'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { grey } from '@mui/material/colors';

Chart.register(ArcElement)
const data = [
  { id: 1, value: 10, label: 'C' },
  { id: 2, value: 10, label: 'G' },
  { id: 3, value: 10, label: 'D' },
  { id: 4, value: 10, label: 'A' },
  { id: 5, value: 10, label: 'E' },
  { id: 6, value: 10, label: 'B' },
  { id: 7, value: 10, label: 'Gb' },
  { id: 8, value: 10, label: 'Db' },
  { id: 9, value: 10, label: 'Ab' },
  { id: 10, value: 10, label: 'Eb' },
  { id: 11, value: 10, label: 'Bb' },
  { id: 12, value: 10, label: 'F' },
];
const minorKeys = [
  { id: 1, value: 10, label: 'Am' },
  { id: 2, value: 10, label: 'Em' },
  { id: 3, value: 10, label: 'Bm' },
  { id: 4, value: 10, label: 'F#m' },
  { id: 5, value: 10, label: 'C#m' },
  { id: 6, value: 10, label: 'G#m' },
  { id: 7, value: 10, label: 'Ebm' },
  { id: 8, value: 10, label: 'Bbm' },
  { id: 9, value: 10, label: 'Fm' },
  { id: 10, value: 10, label: 'Cm' },
  { id: 11, value: 10, label: 'Gm' },
  { id: 12, value: 10, label: 'Dm' },
];

const defaultColors = Array(data.length).fill(grey[500]);

const hoverColors = ['#b71c1c', '#ff5722', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50', '#26a69a', '#00bcd4', '#03a9f4', '#3f51b5', '#673ab7', '#9c27b0'];

export default function CircleOfFifths({ activeSlice, setActiveSlice }) {
  const chartData = {
    labels: [...data.map(d => d.label), ...minorKeys.map(d => d.label)],
    datasets: [
      {
        // label: "Major Keys",
        data: data.map(d => d.value),
        backgroundColor: data.map((_, index) => activeSlice === data[index].label ? hoverColors[index] : defaultColors[index]),
        hoverBackgroundColor: hoverColors,
        // to make it an inner circle:
        weight: 0.5
      },
      {
        // label: "Minor Keys",
        data: minorKeys.map(d => d.value),
        backgroundColor: minorKeys.map((_, index) => activeSlice === minorKeys[index].label ? hoverColors[index] : defaultColors[index]),
        hoverBackgroundColor: hoverColors
      }
    ]

  };

  const options = {
    plugins: {
      tooltip: {
        enabled: false
      },
      legend: {
        display: false
      },
      datalabels: {
        display: true,
        color: '#fff',
        font: {
          size: 12,
          weight: 'bold',
        },
        anchor: 'center',
        align: 'end',
        offset: (context) => {
          if (context.datasetIndex === 0) {
            return -11;  // offset for major labels
          } else {
            return 3;  // default offset for minor labels
          }
        },

        formatter: (value, context) => {
          // Check if the current slice is from the first dataset (major keys)
          if (context.datasetIndex === 0) {
            return data[context.dataIndex].label;
          }
          // If it's from the second dataset (minor keys)
          else if (context.datasetIndex === 1) {
            return minorKeys[context.dataIndex].label;
          }
        }

      }
    },
    animation: {
      duration: 0 // Set duration to 0 to disable animations
    },
    rotation: '-15',
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className='pie-container'>
      <Grid container spacing={0} sx={{
        height: '300px',
        borderRadius: '5px',
        paddingLeft: 0,
        paddingTop: 0
      }}>
        <Grid item xs={4} sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingLeft: 0, paddingTop: 0
        }}>
          <Box sx={{
            display: 'flex',
            height: '200px',
            alignItems: 'center',
            width: '300px',
            "@media (max-width: 600px)": {
              display: 'flex',
              width: '100px',
              fontSize: '12px'
            }
          }}>
            <Typography className='song-sub-info' variant="h4" color="white" component="div" sx={{
              fontSize: '25px',
              display: 'flex',
              textAlign: 'center',
              // textShadow:'5px 8px 5px rgba(0, 0, 0, 0.9)',
              "@media (max-width: 600px)": {
                fontSize: '12px'
              }
            }}
            >
              FILTER YOUR FAVORTIES BY KEY
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={4} sx={{
          height: '270px',
          paddingLeft: 0, paddingTop: 0,
          marginTop: '10px',

        }}>
          <Pie
            data={chartData}
            plugins={[ChartDataLabels]}
            height={350}
            width={350}
            options={{
              ...options,
              onClick: (evt, elements) => {
                if (elements.length) {
                  const clickedElement = elements[0];
                  let label;
                  if (clickedElement.datasetIndex === 0) {
                    label = data[clickedElement.index].label;
                  } else if (clickedElement.datasetIndex === 1) {
                    label = minorKeys[clickedElement.index].label;
                  }
                  setActiveSlice(prev => prev === label ? null : label);
                }
              }
            }}
          />
        </Grid>
      </Grid>

    </div>
  );
}







