# Dog Adoption App

This is a frontend application for browsing and finding shelter dogs for adoption. The app allows users to search through a database of dogs, filter by breed, sort results, and generate a match based on their favorites.

## Features

- User authentication with name and email
- Browse available dogs with pagination
- Filter dogs by breed and age
- Sort results alphabetically by breed (ascending or descending)
- Add dogs to favorites
- Generate a match from favorite dogs

## Technologies Used

- React 18
- TypeScript
- React Router for navigation
- Chakra UI for component library
- Axios for API requests
- Vite for build tooling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dog-adoption-app.git
   cd dog-adoption-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the app for production, run:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This application can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

## API Reference

The application uses the Fetch Frontend Take-Home Service API:
- Base URL: `https://frontend-take-home-service.fetch.com`
- Authentication: Cookie-based authentication
- Endpoints:
  - `/auth/login` - User login
  - `/auth/logout` - User logout
  - `/dogs/breeds` - Get all dog breeds
  - `/dogs/search` - Search for dogs with filters
  - `/dogs` - Get details for specific dogs
  - `/dogs/match` - Generate a match from favorite dogs

## License

This project is licensed under the MIT License - see the LICENSE file for details.
