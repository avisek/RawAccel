'use client'

import { RawAccelParams } from '../types/acceleration'

interface Props {
  params: RawAccelParams
  onChange: (params: RawAccelParams) => void
}

export default function ParameterControls({ params, onChange }: Props) {
  const handleChange = (key: keyof RawAccelParams, value: number) => {
    onChange({ ...params, [key]: value })
  }

  const loadUserSettings = () => {
    const userSettings: RawAccelParams = {
      syncSpeed: 4.0,
      motivity: 2.5,
      gamma: 1.0,
      smooth: 0.5,
      scale: 1.0,
      outputDPI: 1000.0,
    }
    onChange(userSettings)
  }

  return (
    <div className="space-y-6">
      {/* Load User Settings Button */}
      <div>
        <button
          onClick={loadUserSettings}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Load Your Current Settings
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Loads the synchronous settings from your settings.json
        </p>
      </div>

      {/* Sync Speed */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sync Speed: {params.syncSpeed}
        </label>
        <input
          type="range"
          min="0.1"
          max="20"
          step="0.1"
          value={params.syncSpeed}
          onChange={(e) =>
            handleChange('syncSpeed', parseFloat(e.target.value))
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1</span>
          <span>20</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          The central speed around which acceleration is symmetric
        </p>
      </div>

      {/* Motivity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Motivity: {params.motivity}
        </label>
        <input
          type="range"
          min="1.1"
          max="5"
          step="0.1"
          value={params.motivity}
          onChange={(e) => handleChange('motivity', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1.1</span>
          <span>5</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Range of sensitivity change (1/motivity to motivity)
        </p>
      </div>

      {/* Gamma */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gamma: {params.gamma}
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={params.gamma}
          onChange={(e) => handleChange('gamma', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1</span>
          <span>3</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          How fast the sensitivity change occurs
        </p>
      </div>

      {/* Smooth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Smooth: {params.smooth}
        </label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={params.smooth}
          onChange={(e) => handleChange('smooth', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1</span>
          <span>2</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Transition smoothness (0.5 recommended)
        </p>
      </div>

      {/* Scale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Scale: {params.scale}
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={params.scale}
          onChange={(e) => handleChange('scale', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1</span>
          <span>3</span>
        </div>
      </div>

      {/* Output DPI */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Output DPI: {params.outputDPI}
        </label>
        <input
          type="range"
          min="400"
          max="3200"
          step="100"
          value={params.outputDPI}
          onChange={(e) =>
            handleChange('outputDPI', parseFloat(e.target.value))
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>400</span>
          <span>3200</span>
        </div>
      </div>
    </div>
  )
}
