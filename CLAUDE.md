# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Install dependencies**: `yarn`
- **Start development server**: `yarn start`
- **Build for production**: `yarn build` (includes JavaScript obfuscation)
- **Run tests**: `yarn test`

## Project Architecture

This is a React application that integrates with the Vapi AI voice assistant platform. The app creates a customizable voice call interface with dynamic branding and configuration.

### Key Components

- **App.jsx**: Main application component that handles Vapi integration, URL parameter parsing, and call state management
- **Button.jsx**: Customizable call button with dynamic images and pressed states
- **ActiveCallDetail.jsx**: Displays call status, volume levels, and speaking indicators
- **VideoBackground.jsx**: Optional background video component
- **LottiePlayer.jsx**: Animation player for Lottie/GIF animations

### URL Configuration System

The app is designed to be highly configurable through URL parameters:
- `id`, `name`, `project`, `assistant_id` - Required for call functionality
- `phase_id`, `context` - Sent as system messages to the AI assistant
- `img_url`, `animation_url`, `video`, `button_url` - Visual customization
- `bk_color`, `tap_text`, `tap_text_color` - UI theming

### Vapi Integration

The app uses the `@vapi-ai/web` SDK to handle voice calls. Key integration points:
- Call lifecycle management (start, end, error handling)
- Real-time volume level and speech state updates
- System message injection for context and phase information
- Assistant override metadata for user identification

### Build Process

The build process includes JavaScript obfuscation using `javascript-obfuscator` for code protection in production builds.