# Fullstack Prints - eCommerce Server

## Overview
Node.js/Express eCommerce server with product listing frontend. Lab assignment is complete with all required features working.

## Project Structure
- `app.js` - Main Express server application with route configuration
- `api.js` - Route handler functions for all endpoints
- `products.js` - Product service module with business logic
- `middleware.js` - Custom middleware (CORS, error handling, 404)
- `index.html` - Main HTML page (served from root)
- `public/` - Static files served to the frontend
  - `index.js` - Frontend JavaScript for rendering products
  - `nanohtml.js` - Lightweight HTML templating library
- `data/` - JSON data files containing product information
  - `full-products.json` - Complete product catalog
  - `products.json` - Product data subset
- `lib/` - Utility modules
  - `auto-catch.js` - Middleware wrapper for automatic error catching

## Technology Stack
- **Backend**: Node.js with Express 4.21.1
- **Development**: Nodemon for auto-reloading
- **Frontend**: Vanilla JavaScript with nanohtml templating
- **Styling**: Tachyons CSS framework (loaded via CDN)

## Configuration
- **Port**: 5000 (configured for Replit deployment)
- **Host**: 0.0.0.0 (allows external connections)
- **Development**: Uses nodemon for automatic server restart on file changes

## API Endpoints
- `GET /` - Serves the main HTML page
- `GET /products` - Returns products with optional filtering and pagination
  - Query parameters:
    - `limit` (default: 25) - Maximum number of products to return
    - `offset` (default: 0) - Number of products to skip
    - `tag` - Filter products by tag name (case-insensitive)
- `GET /products/:id` - Returns a single product by ID (404 if not found)
- `POST /products` - Create a new product (logs to console, returns request body)
- `PUT /products/:id` - Update a product by ID (logs to console)
- `DELETE /products/:id` - Delete a product by ID (logs to console, returns 202)

## Running the Application

### Development Mode (Workflow)
The application runs in development mode via the "Express Server" workflow:
```
npm start
```
which executes `nodemon app.js` for automatic server restart on file changes.

### Production Deployment
The application can be deployed on Replit using the autoscale deployment option:
- **Recommended target**: autoscale (for stateless web applications)
- **Recommended run command**: `node app.js` (use Node directly without nodemon for production)
- **Port**: The app uses environment variable `PORT` or defaults to 5000
- The server is configured to bind to `0.0.0.0` for external access
- Deployment settings can be configured through Replit's deployment UI

## Recent Changes (November 17, 2025)
- Configured for Replit (port 5000, 0.0.0.0 binding)
- Completed lab requirements:
  - Modular code (api.js, products.js, middleware.js)
  - Filtering by tags
  - Pagination (limit/offset)
  - Get product by ID
  - POST/PUT/DELETE endpoints
  - CORS and error handling

## Notes
Lab assignment complete. All features tested and working.
