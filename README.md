# RentNest

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/parety308/RentNest_A4)

RentNest is a comprehensive backend system for a property rental platform. It provides a robust set of APIs to manage users (tenants, landlords, admins), properties, rental requests, payments, and reviews. The platform is built with Node.js, Express, and Prisma, featuring JWT-based authentication, Stripe for payments, and Cloudinary for image hosting.

## Core Features

-   **Role-Based User Management**: Three distinct user roles: `TENANT`, `LANDLORD`, and `ADMIN`, each with specific permissions.
-   **Authentication & Authorization**: Secure user registration and login using JWT with access and refresh tokens. Middleware protects routes based on user roles.
-   **Property Management**: Landlords can create, read, update, and delete their property listings. Properties include extensive details like address, pricing, amenities, and images.
-   **Advanced Property Search**: Publicly accessible endpoints to search and filter properties by location, price range, category, and sorting preferences.
-   **Rental Request System**: Tenants can submit rental requests for available properties. Landlords can view and manage these requests by approving or rejecting them.
-   **Saved Properties**: Users can save their favorite properties for later viewing.
-   **Payment Integration**: Secure payment processing is handled through Stripe, with a dedicated webhook to confirm payment success and update rental statuses.
-   **Review System**: Tenants can post reviews and ratings for properties they have successfully rented.
-   **Image Uploads**: Supports multiple image uploads for property listings, handled via Multer and hosted on Cloudinary.
-   **Admin Dashboard**: Admins have oversight of the platform, with capabilities to manage all users (e.g., banning), properties, and view all rental requests.

## Technology Stack

-   **Backend**: Node.js, Express.js
-   **Database ORM**: Prisma with PostgreSQL
-   **Authentication**: JSON Web Tokens (JWT), bcrypt
-   **Payments**: Stripe
-   **Image Storage**: Cloudinary
-   **Language**: TypeScript
-   **Bundler**: `tsup`
-   **Development**: `tsx` for live-reloading

## Prisma Schema Overview

The database schema is defined using Prisma and is organized into several related models:

-   `User`: Stores user information including `name`, `email`, `password`, and `role` (`TENANT`, `LANDLORD`, `ADMIN`).
-   `Property`: Contains all details for a property listing, such as `title`, `description`, `address`, `price`, `images`, and `amenities`. It is linked to a `User` (the landlord) and a `Category`.
-   `Category`: Used to classify properties (e.g., "Apartment", "House").
-   `RentalRequest`: Represents a tenant's request to rent a property, linking a `User` to a `Property` with a specific `status` (e.g., `PENDING`, `APPROVED`).
-   `Review`: A tenant's review of a property, containing a `rating` and a `comment`.
-   `Payment`: Tracks payment transactions made via Stripe for a `RentalRequest`.
-   `SavedProperty`: A join table that links users to the properties they have saved.

## API Endpoints

The application exposes a set of RESTful APIs for various functionalities:

| Method | Endpoint                       | Role(s)                   | Description                                          |
| :----- | :----------------------------- | :------------------------ | :--------------------------------------------------- |
| `POST` | `/api/auth/register`           | Public                    | Register a new user.                                 |
| `POST` | `/api/auth/login`              | Public                    | Log in a user and receive JWTs.                      |
| `GET`  | `/api/auth/me`                 | `ADMIN`, `TENANT`, `LANDLORD` | Get the profile of the currently logged-in user.     |
| `POST` | `/api/auth/refresh-token`      | Authenticated             | Get a new access token using a refresh token.        |
| `GET`  | `/api/properties`              | Public                    | Get a paginated and filterable list of all properties. |
| `GET`  | `/api/properties/:id`          | Public                    | Get details for a single property.                   |
| `POST` | `/api/properties/:id/save`     | `ADMIN`, `TENANT`, `LANDLORD` | Save a property to the user's list.                  |
| `DELETE` | `/api/properties/:id/save`   | `ADMIN`, `TENANT`, `LANDLORD` | Remove a property from the user's saved list.        |
| `GET`  | `/api/properties/saved`        | `ADMIN`, `TENANT`, `LANDLORD` | Get all properties saved by the user.                |
| `POST` | `/api/rentals`                 | `TENANT`, `ADMIN`         | Create a new rental request for a property.          |
| `GET`  | `/api/rentals`                 | `TENANT`, `ADMIN`         | Get all rental requests submitted by the tenant.     |
| `POST` | `/api/landlord/properties`     | `LANDLORD`, `ADMIN`       | Create a new property listing.                       |
| `GET`  | `/api/landlord/properties`     | `LANDLORD`, `ADMIN`       | Get all properties owned by the landlord.            |
| `GET`  | `/api/landlord/requests`       | `LANDLORD`, `ADMIN`       | Get all rental requests for the landlord's properties. |
| `PATCH`| `/api/landlord/requests/:id`   | `LANDLORD`, `ADMIN`       | Update the status of a rental request.               |
| `GET`  | `/api/admin/users`             | `ADMIN`                   | Get a list of all users on the platform.             |
| `PATCH`| `/api/admin/users/:id`         | `ADMIN`                   | Ban or unban a user.                                 |
| `POST` | `/api/payments/create`         | `TENANT`, `ADMIN`         | Create a Stripe payment session for a rental.        |
| `POST` | `/api/payments/confirm`        | Webhook                   | Stripe webhook to confirm a successful payment.      |
| `POST` | `/api/uploads/images`          | `LANDLORD`, `ADMIN`       | Upload property images to Cloudinary.                |

## Setup and Installation

Follow these steps to get the development environment running.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/parety308/RentNest_A4.git
cd rentnest_a4
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Now, fill in the required values in the `.env` file.

### 4. Run database migrations

Apply the Prisma schema to your database:

```bash
npx prisma migrate dev
```

### 5. Generate Prisma Client

Ensure the Prisma client is up-to-date with your schema:

```bash
npx prisma generate
```

### 6. Run the development server

Start the server with live-reloading:

```bash
npm run dev
```

The application will be running at `http://localhost:5000` (or the port specified in your `.env` file).

### 7. Build for production

To create an optimized production build:

```bash
npm run build
```

Then, start the production server:

```bash
npm start
```

## Environment Variables

The following environment variables are required for the application to run correctly. These should be defined in a `.env` file at the root of the project.

```env
# Database
DATABASE_URL= # PostgreSQL connection string (e.g., postgresql://user:password@localhost:5432/rentnest)

# Server
PORT=5000
APP_URL= # Frontend application URL (e.g., http://localhost:3000)
SERVER_URL= # Backend server URL (e.g., http://localhost:5000)

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# JWT
JWT_ACCESS_TOKEN_SECRET= # Secret for access tokens
JWT_REFRESH_TOKEN_SECRET= # Secret for refresh tokens
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Stripe
STRIPE_SECRET_KEY= # Your Stripe secret key
STRIPE_WEBHOOK_SECRET= # Your Stripe webhook signing secret

# Cloudinary
CLOUDINARY_CLOUD_NAME= # Your Cloudinary cloud name
CLOUDINARY_API_KEY= # Your Cloudinary API key
CLOUDINARY_API_SECRET= # Your Cloudinary API secret
