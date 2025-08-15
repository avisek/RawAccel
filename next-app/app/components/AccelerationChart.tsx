'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartConfiguration,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

interface Props {
  chartData: {
    input: number[]
    output: number[]
    sensitivity: number[]
  }
}

export default function AccelerationChart({ chartData }: Props) {
  const velocityData = {
    labels: chartData.input.map((x) => x.toFixed(1)),
    datasets: [
      {
        label: 'Input Velocity',
        data: chartData.input,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Output Velocity',
        data: chartData.output,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
    ],
  }

  const sensitivityData = {
    labels: chartData.input.map((x) => x.toFixed(1)),
    datasets: [
      {
        label: 'Sensitivity Multiplier',
        data: chartData.sensitivity,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
    ],
  }

  const velocityOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Input vs Output Velocity',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Input Speed (counts/ms)',
        },
        type: 'linear',
        min: 0,
        max: Math.max(...chartData.input),
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Speed (counts/ms)',
        },
        min: 0,
      },
    },
  }

  const sensitivityOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sensitivity Curve',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Input Speed (counts/ms)',
        },
        type: 'linear',
        min: 0,
        max: Math.max(...chartData.input),
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Sensitivity Multiplier',
        },
        min: 0,
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Velocity Chart */}
      <div className="h-80">
        <Line data={velocityData} options={velocityOptions} />
      </div>

      {/* Sensitivity Chart */}
      <div className="h-80">
        <Line data={sensitivityData} options={sensitivityOptions} />
      </div>
    </div>
  )
}
