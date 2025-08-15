# RawAccel to libinput Converter

This Next.js web application converts Windows RawAccel synchronous-mode mouse acceleration settings to libinput custom acceleration format for use with Linux/Hyprland.

## Features

- **Interactive Parameter Controls**: Adjust RawAccel synchronous mode parameters in real-time
- **Visual Charts**: See both velocity curves and sensitivity curves
- **libinput Output**: Generate exact libinput configuration and commands
- **Multiple Formats**: X11 config files, libinput commands, and Hyprland configurations

## RawAccel Synchronous Mode Implementation

The converter implements the exact synchronous acceleration algorithm from RawAccel:

```
1. Calculate log space: gamma * log(inputSpeed / syncSpeed) / log(motivity)
2. Apply activation function:
   - If sharpness >= 16: clamp(logSpace, -1, 1)
   - Otherwise: sign(logSpace) * tanh(|logSpace|^sharpness)^(1/sharpness)
3. Final sensitivity: motivity^activation
```

Where `sharpness = smooth <= 0 ? 16 : 0.5 / smooth`

## Usage

1. **Load Your Settings**: Click "Load Your Current Settings" to use the parameters from your RawAccel settings.json
2. **Adjust Parameters**: Use the sliders to fine-tune:
   - **Sync Speed**: The central speed around which acceleration is symmetric
   - **Motivity**: Range of sensitivity change (curve goes from 1/motivity to motivity)
   - **Gamma**: How fast the sensitivity change occurs
   - **Smooth**: Transition smoothness (0.5 recommended)
3. **View Charts**: Monitor how your changes affect the acceleration curves
4. **Copy Configuration**: Use the generated libinput commands or configuration files

## libinput Integration

### Command Line Usage

```bash
libinput debug-events --set-custom-accel-function-fallback="0.400,0.425,0.451,..." --set-custom-accel-function-step=1.053
```

### X11 Configuration

Save to `/etc/X11/xorg.conf.d/50-mouse-accel.conf`:

```
Section "InputClass"
    Identifier "Mouse Accel"
    MatchIsPointer "on"
    Option "AccelProfile" "custom"
    Option "AccelPointsFallback" "0.400,0.425,0.451,..."
    Option "AccelStep" "1.053"
EndSection
```

### Hyprland

Add to `hyprland.conf`:

```
input {
    accel_profile = custom
}

exec-once = libinput debug-events --set-custom-accel-function-fallback="..."
```

## Development

```bash
pnpm install
pnpm dev
```

## Technical Details

- Built with Next.js 15, React 19, TypeScript, and Tailwind CSS
- Charts powered by Chart.js and react-chartjs-2
- Implements the exact RawAccel synchronous acceleration algorithm
- Generates uniform libinput points with configurable density
- Supports real-time parameter adjustment and visualization
