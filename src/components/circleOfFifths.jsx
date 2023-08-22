import React, { useState } from 'react';
import { ArcElement } from "chart.js";
import Chart from "chart.js/auto";
import { Pie } from 'react-chartjs-2';
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

const defaultColors = Array(data.length).fill(grey[500]);

const hoverColors = ['#FF6384', '#36A2EB', '#FFCE56', '#ADF8FA', '#FF6347', '#4CAF50', '#FFD700', '#E6E6FA', '#D2691E', '#722CF8', '#FF4500', '#9ACD32'];

export default function CircleOfFifths({ activeSlice, setActiveSlice }) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      data: data.map(d => d.value),
      backgroundColor: data.map((_, index) => activeSlice === data[index].label ? hoverColors[index] : defaultColors[index]),
      hoverBackgroundColor: hoverColors
    }]
  };

  const options = {
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        display: true,
        color: '#fff',
        font: {
          size: 15,
          weight: 'bold',
        },
        anchor: 'center',
        align: 'end',

        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className='pie-container'>
      <Grid container spacing={2}sx ={{
        height:'283px',
        margin:'0',
          // marginBottom:'10px',
        }}>
        <Grid item xs={4}>
        {/* <Box sx={{
          display: 'flex',
          justifyContent:'center',
          backgroundColor:'rgba(129, 212, 250, 0.3)',
          height:'200px',
          alignItems:'center',
          // textAlign:'center',
          borderRadius:'5px',
          boxShadow:'5',
        }}>
          <Typography className='song-sub-info' variant="h4" color="text.priimary" component="div" sx={{
            fontSize: '25px'
          }}
          >
            Filter by key
          </Typography>
        </Box> */}
        </Grid>

        <Grid item xs={4}>
        <Pie
          data={chartData}
          plugins={[ChartDataLabels]}
          height={300}
          width={300}
          options={{
            ...options,
            onClick: (evt, elements) => {
              if (elements.length) {
                const label = chartData.labels[elements[0].index];
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







