'use client'

import { useState } from 'react'
import { LibinputPoint } from '../types/acceleration'

interface Props {
  points: LibinputPoint[]
}

export default function LibinputOutput({ points }: Props) {
  const [copied, setCopied] = useState(false)
  const [numPoints, setNumPoints] = useState(20)

  const generateLibinputFunction = () => {
    if (points.length === 0) return []

    const maxInput = Math.max(...points.map((p) => p.input))
    const step = maxInput / (numPoints - 1)

    const result: number[] = []

    for (let i = 0; i < numPoints; i++) {
      const targetInput = i * step

      // Find closest points for interpolation
      let closestIndex = 0
      let minDistance = Math.abs(points[0].input - targetInput)

      for (let j = 1; j < points.length; j++) {
        const distance = Math.abs(points[j].input - targetInput)
        if (distance < minDistance) {
          minDistance = distance
          closestIndex = j
        }
      }

      // Use exact point or interpolate
      if (closestIndex === 0) {
        result.push(points[0].output)
      } else if (closestIndex === points.length - 1) {
        result.push(points[points.length - 1].output)
      } else {
        // Linear interpolation
        const p1 = points[closestIndex - 1]
        const p2 = points[closestIndex + 1]
        const t = (targetInput - p1.input) / (p2.input - p1.input)
        const interpolated = p1.output + t * (p2.output - p1.output)
        result.push(interpolated)
      }
    }

    return result
  }

  const libinputFunction = generateLibinputFunction()
  const step =
    points.length > 0
      ? Math.max(...points.map((p) => p.input)) / (numPoints - 1)
      : 1

  const libinputCommand = `libinput debug-events --set-custom-accel-function-fallback="${libinputFunction
    .map((v) => v.toFixed(3))
    .join(',')}" --set-custom-accel-function-step=${step.toFixed(3)}`

  const configFileContent = `# libinput custom acceleration configuration
# Add this to your input configuration file

Section "InputClass"
    Identifier "Mouse Accel"
    MatchIsPointer "on"
    Option "AccelProfile" "custom"
    Option "AccelPointsFallback" "${libinputFunction
      .map((v) => v.toFixed(3))
      .join(',')}"
    Option "AccelStep" "${step.toFixed(3)}"
EndSection`

  const hyprlandConfig = `# Hyprland configuration
# Add this to your hyprland.conf

input {
    accel_profile = custom
    # Note: Hyprland doesn't directly support libinput custom acceleration
    # You may need to set this via libinput tools or xinput
}

# Alternative: Use libinput command in startup
exec-once = ${libinputCommand}`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuration Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number of libinput points: {numPoints}
        </label>
        <input
          type="range"
          min="10"
          max="50"
          step="1"
          value={numPoints}
          onChange={(e) => setNumPoints(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10</span>
          <span>50</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          More points = higher accuracy, but may be limited by libinput
        </p>
      </div>

      {/* Function Values */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            libinput Function Values
          </h3>
          <button
            onClick={() =>
              copyToClipboard(
                libinputFunction.map((v) => v.toFixed(3)).join(','),
              )
            }
            className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Values'}
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto">
          <pre className="text-sm text-gray-800 dark:text-gray-200">
            Step: {step.toFixed(3)}
            <br />
            Values: [{libinputFunction.map((v) => v.toFixed(3)).join(', ')}]
          </pre>
        </div>
      </div>

      {/* Command Line */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            libinput Command
          </h3>
          <button
            onClick={() => copyToClipboard(libinputCommand)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Command'}
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto">
          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {libinputCommand}
          </pre>
        </div>
      </div>

      {/* X11 Config */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            X11 Configuration File
          </h3>
          <button
            onClick={() => copyToClipboard(configFileContent)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Config'}
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto">
          <pre className="text-sm text-gray-800 dark:text-gray-200">
            {configFileContent}
          </pre>
        </div>
      </div>

      {/* Hyprland Note */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Hyprland Configuration
          </h3>
          <button
            onClick={() => copyToClipboard(hyprlandConfig)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Config'}
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto">
          <pre className="text-sm text-gray-800 dark:text-gray-200">
            {hyprlandConfig}
          </pre>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          Usage Instructions
        </h4>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>
            • For Hyprland: Custom acceleration support may be limited. Try the
            libinput command approach.
          </li>
          <li>
            • For X11: Save the config to
            `/etc/X11/xorg.conf.d/50-mouse-accel.conf`
          </li>
          <li>
            • Test with: `libinput debug-events` to verify the acceleration is
            applied
          </li>
          <li>
            • You may need to restart your session for changes to take effect
          </li>
        </ul>
      </div>
    </div>
  )
}
