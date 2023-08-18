import React, {useState} from 'react';
import { ArcElement } from "chart.js";
import Chart from "chart.js/auto";
import { Pie } from 'react-chartjs-2';
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

export default function CircleOfFifths() {
  const [activeSlice, setActiveSlice] = useState(null);

  
  const chartColors = defaultColors.map((color, index) => index === activeSlice ? hoverColors[index] : color);

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      data: data.map(d => d.value),
      backgroundColor: chartColors,
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
          size: 16,
          weight: 'bold',
        },
        anchor: 'center',
        align: 'end',
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className = 'pie'>
      <Pie 
      
        data={chartData} 
        plugins={[ChartDataLabels]} 
        options={{
          ...options,
          onClick: (evt, elements) => {
            if (elements.length) {
              const index = elements[0].index;
              console.log("Clicked on Key:", chartData.labels[index]);
              setActiveSlice(prev => prev === index ? null : index);
            }
          }
        }}
      />
    </div>
  );
}









// import React from 'react';
// import { ArcElement } from "chart.js";
// import Chart from "chart.js/auto";
// import { Pie } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.register(ArcElement)


// const CircleOfFifths = () => {
//   const data = {
//     labels: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'],
//     datasets: [
//       {
//         data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
//         backgroundColor: [
//           'lightblue',
//           'lightgreen',
//           'lightpink',
//           'lightyellow',
//           'lightpurple',
//           'lightorange',
//           'lightbrown',
//           'lightgrey',
//           'lightcyan',
//           'lightmagenta',
//           'lightcoral',
//           'lightsalmon',
//         ],
//       },
//     ],
//   };

//   const options = {
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//         position: 'right',
//       },
//       datalabels: {
//         color: 'blue',
//         labels: {
//           title: {
//             font: {
//               weight: 'bold',
//             },
//           },
//           value: {
//             color: 'green',
//           },
//           callback: (value, context) => {
//             // Get the index of the current data point
//             const index = context.dataIndex;
            
//             // Use the index to retrieve the corresponding label from your labels array
//             const label = data.labels[index];
            
//             // Return the custom label
//             return label;
//           },
//         },
//       },
//     },
//   };
  

//   return (
//     <div className="circle-container">
//       <Pie data={data} options={options} plugins={[ChartDataLabels]} width={"30%"} />
//     </div>
//   );
// };

// export default CircleOfFifths;



// import * as React from 'react';
// import { PieChart, pieArcLabelClasses, PiePlot, PieArcProps } from '@mui/x-charts/PieChart';

// const data = [
//   { id: 1, value: 10, label: 'C' },
//   { id: 2, value: 10, label: 'G' },
//   { id: 3, value: 10, label: 'D' },
//   { id: 4,value: 10, label: 'A' },
//   { id: 5,value: 10, label: 'E' },
//   { id: 6,value: 10, label: 'B' },
//   { id: 7,value: 10, label: 'Gb' },
//   { id: 8,value: 10, label: 'Db' },
//   { id: 9,value: 10, label: 'Ab' },
//   { id: 10,value: 10, label: 'Eb' },
//   { id: 11,value: 10, label: 'Bb' },
//   { id: 12,value: 10, label: 'F' },
// ];

// const size = {
//   width: 400,
//   height: 400,
// };



// export default function CircleOfFifths() { 

//   return (
//     <div>
//     <PieChart
//       series={[
//         {
//           arcLabel: (item) => `${item.label}`, 
//           data,
//           innerRadius: 21,
//           outerRadius: 100,
//           highlightScope: { faded: 'global', highlighted: 'item' },
//           faded: { innerRadius: 30, additionalRadius: -30 },
//           // paddingAngle: 2,
//           // cornerRadius: 5,
//           startAngle: -180,
//           endAngle: 180,
//           cx: 150,
//           cy: 150,
//         },
//       ]}
//       sx={{
//         [`& .${pieArcLabelClasses.root}`]: {
//           fill: 'white',
//           fontSize: '15px',
//           fontWeight: 'bold',
//           marginBottom: '100px',

//         },
//       }}
//       {...size}
//     />
//     </div>
//   );
// }
