# JellyGit 📊

Full Disclaimer - I went a little outside the line with this one but I really wanted to showcase React Native work. I kept the work to under 2 hours as per the instructions. 

JellyGit is a React Native application that provides insights into GitHub user activity. Built with Expo, it helps track development trends across projects by analyzing public GitHub activity.

## Features

- View GitHub user activity across their repositories
- Analyze top 3 most common activity types per repository
- Identify repositories owned by the user
- Clean, modern UI with intuitive navigation

## Demo

The app includes several key screens:

1. User Search - Find GitHub users to analyze
2. Activity Overview - See total activity across repositories
3. Repository Details - View specific repository activity
4. Activity Breakdown - Analyze activity types and patterns

<img src="assets/demo/1.png" alt="Demo 1" width="300"/>
<img src="assets/demo/2.png" alt="Demo 2" width="300"/>
<img src="assets/demo/3.png" alt="Demo 3" width="300"/>
<img src="assets/demo/4.png" alt="Demo 4" width="300"/>

## Technical Details

- Built with React Native and Expo
- Uses GitHub's public API (no authentication required)
- Implements file-based routing

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn start
   ```

3. Run on your preferred platform:
   - iOS Simulator
   - Android Emulator
   - Physical device using Expo Go

## Project Structure

- `/app` - Main application code
- `/assets` - Images and other static assets
- `/components` - Reusable React components
- `/services` - API integration and data processing

## Technical Architecture

### API Integration
The app uses GitHub's public API through a dedicated route at `/app/api/github/route.ts`. This route handles:
- Fetching user activity data
- Processing repository contributions
- Calculating activity type frequencies
- Identifying owned repositories

### State Management
The `/app/state` directory contains our state management logic:
- User activity state
- Repository data
- Loading and error states
- Activity type aggregations

### Components
Key components are organized in the `/app/components` directory:
- User search interface
- Activity visualization
- Repository list
- Activity type breakdown

### Testing
The project includes comprehensive tests in the `/__tests__` directory:
- Unit tests for API integration
- Component rendering tests
- State management tests
- Integration tests for the full user flow

## Development

The project uses Expo's file-based routing system. You can start developing by editing files in the `app` directory.

## Requirements

- Node.js v20.19.0
- Yarn (recommended) or npm
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## License

This project was created as part of a technical interview for Jellyvision.
