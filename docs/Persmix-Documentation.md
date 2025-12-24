# Persmix Elite Module Documentation

## Overview

The Persmix Elite Module is a collection of state-of-the-art React components designed for high-performance, adaptive, and self-aware applications.

## Components

### Persmix

**File:** `src/Persmix/Persmix.jsx`

The main elite module component featuring:

- Ultra-fast rendering
- Elite customization options
- Seamless integration capabilities
- Cutting-edge design with gradient backgrounds and glowing effects

**Props:**

- `title` (string): Module title (default: "Persmix Elite Module")
- `description` (string): Module description
- `features` (array): List of feature strings

**Usage:**

```jsx
<Persmix
  title="Custom Title"
  description="Custom description"
  features={["Feature 1", "Feature 2"]}
/>
```

### PersmixOpenAIChat

**File:** `src/Persmix/PersmixOpenAIChat.jsx`

AI-powered chat component with adaptive conversation capabilities.

**Features:**

- Real-time messaging with GPT-4
- Message history
- Error handling
- Loading states

**Dependencies:**

- Requires backend API at `/api/openai`
- OpenAI API key in environment

### EliteTerminal

**File:** `src/Persmix/EliteTerminal.jsx`

Secure terminal emulator with backend command execution.

**Features:**

- Command history with arrow key navigation
- Real-time command execution via backend
- Security-focused (no direct shell access)
- Terminal-style UI with green-on-black theme

**Commands Supported:**

- `ls`, `pwd`, `date`, `whoami` - Basic system info
- Custom commands executed on backend

### SystemStatus

**File:** `src/Persmix/SystemStatus.jsx`

Self-aware system monitoring component.

**Features:**

- Real-time system metrics
- Auto-updating every 5 seconds
- Memory usage tracking
- Uptime monitoring
- Platform information

**API:** Connects to `/api/status` endpoint

## Styling

**File:** `src/Persmix/Persmix.css`

Elite styling with:

- Gradient backgrounds
- Glowing borders
- Modern typography
- Responsive design

## Module Exports

**File:** `src/Persmix/index.js`

Central export file for all Persmix components:

```javascript
export { Persmix, PersmixOpenAIChat, EliteTerminal, SystemStatus };
export { fetchOpenAIChat };
```

## Integration

Import components in your app:

```jsx
import {
  Persmix,
  PersmixOpenAIChat,
  EliteTerminal,
  SystemStatus,
} from "./Persmix";
```

## Backend Requirements

- Node.js server with OpenAI integration
- Terminal command execution endpoint
- System status API
- Proper CORS configuration
