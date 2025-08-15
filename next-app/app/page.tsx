'use client'

import { useState, useEffect } from 'react'
import AccelerationChart from './components/AccelerationChart'
import ParameterControls from './components/ParameterControls'
import LibinputOutput from './components/LibinputOutput'
import { RawAccelParams, LibinputPoint } from './types/acceleration'

export default function Home() {
  const [params, setParams] = useState<RawAccelParams>({
    syncSpeed: 4.0,
    motivity: 2.5,
    gamma: 1.0,
    smooth: 0.5,
    scale: 1.0,
    outputDPI: 1000.0,
  })

  const [libinputPoints, setLibinputPoints] = useState<LibinputPoint[]>([])
  const [chartData, setChartData] = useState<{
    input: number[]
    output: number[]
    sensitivity: number[]
  }>({
    input: [],
    output: [],
    sensitivity: [],
  })

  useEffect(() => {
    calculateCurves()
  }, [params])

  const calculateSynchronousAcceleration = (inputSpeed: number): number => {
    const { syncSpeed, motivity, gamma, smooth } = params

    if (inputSpeed <= 0) return 1.0
    if (inputSpeed === syncSpeed) return 1.0

    // Calculate sharpness from smooth parameter
    const sharpness = smooth <= 0 ? 16 : 0.5 / smooth

    // Calculate log space
    const logMotivity = Math.log(motivity)
    const gammaConst = gamma / logMotivity
    const logSyncSpeed = Math.log(syncSpeed)
    const logX = Math.log(inputSpeed)
    const logDiff = logX - logSyncSpeed

    let activation: number

    // Apply activation function
    if (sharpness >= 16) {
      // Linear clamp
      const logSpace = gammaConst * logDiff
      activation = Math.max(-1, Math.min(1, logSpace))
    } else {
      // Tanh-based activation
      const logSpace = Math.abs(gammaConst * logDiff)
      const tanhResult = Math.tanh(Math.pow(logSpace, sharpness))
      activation = Math.sign(logDiff) * Math.pow(tanhResult, 1 / sharpness)
    }

    // Calculate final sensitivity
    return Math.pow(motivity, activation)
  }

  const calculateCurves = () => {
    const maxSpeed = 50 // Maximum input speed to calculate
    const numPoints = 200 // Number of points for smooth curve
    const step = maxSpeed / numPoints

    const inputSpeeds: number[] = []
    const outputSpeeds: number[] = []
    const sensitivities: number[] = []

    for (let i = 0; i <= numPoints; i++) {
      const inputSpeed = i * step + 0.1 // Start from 0.1 to avoid log(0)
      const sensitivity = calculateSynchronousAcceleration(inputSpeed)
      const outputSpeed = inputSpeed * sensitivity

      inputSpeeds.push(inputSpeed)
      outputSpeeds.push(outputSpeed)
      sensitivities.push(sensitivity)
    }

    setChartData({
      input: inputSpeeds,
      output: outputSpeeds,
      sensitivity: sensitivities,
    })

    // Generate libinput points (uniform spacing)
    const libinputNumPoints = 20
    const libinputMaxSpeed = 20
    const libinputStep = libinputMaxSpeed / (libinputNumPoints - 1)
    const points: LibinputPoint[] = []

    for (let i = 0; i < libinputNumPoints; i++) {
      const inputSpeed = i * libinputStep
      const outputSpeed =
        inputSpeed * calculateSynchronousAcceleration(inputSpeed)
      points.push({ input: inputSpeed, output: outputSpeed })
    }

    setLibinputPoints(points)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            RawAccel to libinput Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Convert your Windows RawAccel synchronous-mode mouse acceleration
            settings to libinput custom acceleration for Linux/Hyprland.
            Visualize the curve and get the exact libinput configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Parameter Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                RawAccel Parameters
              </h2>
              <ParameterControls params={params} onChange={setParams} />
            </div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Acceleration Curves
              </h2>
              <AccelerationChart chartData={chartData} />
            </div>
          </div>
        </div>

        {/* libinput Output */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              libinput Configuration
            </h2>
            <LibinputOutput points={libinputPoints} />
          </div>
        </div>
      </div>
    </div>
  )
}
