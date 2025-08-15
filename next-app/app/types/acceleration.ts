export interface RawAccelParams {
  syncSpeed: number
  motivity: number
  gamma: number
  smooth: number
  scale: number
  outputDPI: number
}

export interface LibinputPoint {
  input: number
  output: number
}

export interface ChartData {
  input: number[]
  output: number[]
  sensitivity: number[]
}
