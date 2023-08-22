
//old chart code

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
