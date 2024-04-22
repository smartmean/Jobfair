//import { Link } from "react-router-dom"
//import {FaQuestionCircle, FaTicketAlt} from 'react-icons/fa'
//import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";


function Dashboard(){
    ChartJS.register(ArcElement, Tooltip, Legend);
    return(
        <>
<Line
  datasetIdKey='id'
  data={{
    labels: ['Jun', 'Jul', 'Aug'],
    datasets: [
      {
        id: 1,
        label: '',
        data: [5, 6, 7],
      },
      {
        id: 2,
        label: '',
        data: [3, 2, 1],
      },
    ],
  }}
/>
        </>
    )
}
export default Dashboard;
