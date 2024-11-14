# Car Management Application

This project is a **Car Management Application** that allows users to **create, view, edit, and delete cars**. Each car can contain up to **10 images**, a **title**, a **description**, and **tags** (e.g., car type, company, dealer). The application includes **user authentication** and restricts each user to managing only their own cars. Additionally, users can search through their cars.

### [Live Demo](https://car-management-app-mu.vercel.app/)
### [SWAGGER API DOCS](https://car-management-app-mu.vercel.app/api-doc)
   - Get the cookies from network tab after login and use it as a bearer token directly.
## Features

- **User Authentication**: Users can register, log in, and manage their session securely.
- **Car CRUD Operations**: Users can add, view, update, and delete cars.
- **Image Upload**: Users can upload up to 10 images per car. Images are stored using **Vercel Blob Storage**.
- **Responsive Design**: Built with responsiveness in mind, with support for both mobile and desktop views.

## Tech Stack

- **Frontend**: Next.js, TypeScript, React, Tailwind CSS
- **Backend**: NextAuth for authentication, MongoDB (with Mongoose) for database management
- **Image Storage**: Vercel Blob Storage for image management
- **Validation**: Zod for schema validation
- **Documentation**: Swagger UI for API documentation
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas (or local MongoDB instance)
- Environment variables for `MONGODB_URI` and `NEXTAUTH_SECRET`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/car-management-app.git
   ```
   
2. Install dependencies:
   ```bash
   cd car-management-app
   npm install
   ```

3. Set up environment variables:

   - Create a `.env.local` file in the root of the project.
   - Add the following variables:
     ```
     MONGODB_URI=<Your MongoDB URI>
     NEXTAUTH_SECRET=<Your NextAuth secret>
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```plaintext
src/
├── app/
│   ├── api/                   # API routes
│   │   ├── auth/              # NextAuth setup
│   │   ├── add-car/           # Route to add a new car
│   │   ├── delete-car/        # Route to delete a car by ID
│   │   ├── list-cars/         # Route to list all cars of the user
│   └── components/
│       ├── custom/            # Custom components (CarList, AddCar, etc.)
│       └── ui/                # UI components (Button, Form, etc.)
├── lib/
│   └── dbConnect.ts           # MongoDB connection utility
├── models/
│   ├── User.ts                # User model
│   └── Car.ts                 # Car model
└── types/
    └── ApiResponse.ts         # Types for API responses
```

## API Endpoints

### Authentication

- **`POST /api/signin`**: User login via credentials.

### Car Management

- **`POST /api/add-car`**: Add a new car to the user's collection.
- **`GET /api/list-cars`**: Get a list of all cars owned by the authenticated user.
- **`DELETE /api/delete-car/{id}`**: Delete a specific car by ID along with its associated images from blob storage.

## Swagger API Documentation

The application includes Swagger documentation to describe the available API endpoints. Visit `/api-doc` in your deployed application to view and test the API directly in the browser.

### Example Swagger Comments

Each API route is annotated with Swagger comments to automatically generate the API documentation.

For example, here’s how the `GET /api/list-cars` route is documented:

```typescript
/**
 * @swagger
 * /api/list-cars:
 *   get:
 *     summary: Get all cars for the authenticated user
 *     description: Fetches all cars associated with the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched cars
 */
```

## Usage

1. **Sign Up / Log In**: Register or log in to access the application.
2. **Add a Car**: Use the "Add Car" tab to upload car details, including images.
3. **View Your Cars**: View a list of all cars you have added.
4. **Edit or Delete a Car**: Edit or delete cars from your list as needed.

## Image Upload

- Images are uploaded to Vercel Blob Storage with a maximum of 10 images per car.
- Max image size is 4.5MB.
- Deleting a car also deletes its images from blob storage.

## Important Considerations

- Ensure that all environment variables are correctly configured for MongoDB and NextAuth.
- **Data Validation**: All data is validated using Zod to prevent invalid data from being entered into the database.

## Future Improvements

- **Enhanced Search**: Implement more advanced search filters.
- **User Roles**: Add different roles (e.g., admin, user) for more control.
- **Image Management**: Add image editing capabilities.
- **Search Functionality**: Allows users to search for cars based on title, description, or tags.