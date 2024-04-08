# Cats management system (Nest.js + PostgreSQL)

## Key Features:
#### Cat Profiles: Create, read, update, and delete profiles for cats available for adoption.

#### User Authentication: Secure user registration and login functionality.

#### Favorites: Allow authenticated users to mark cats as favorites.

## Technical Specifications:

#### Implement TypeORM with a PostgreSQL database for data persistence.

#### Utilize Passport.js for user authentication with JWT tokens.

#### Apply class-validator and class-transformer for input validation and serialization.

## Endpoints to Implement:
#### POST /auth/register: Register a new user.

#### POST /auth/login: Authenticate a user and return a JWT.

#### GET /cats: Retrieve a list of all cats.

#### POST /cats: Create a new cat profile (admin only).

#### GET /cats/{id}: Retrieve a cat profile by ID.

#### PUT /cats/{id}: Update a cat profile by ID (admin only).

#### DELETE /cats/{id}: Delete a cat profile by ID (admin only).


## Installation

Provide instructions on how to install and set up your project locally. Include any prerequisites, dependencies, or configuration steps necessary for installation.

```bash
# Clone the repository
git clone https://github.com/Tundrax-Dex/nestjs-assignment

# Navigate to the project directory
cd nestjs-assignment

# Install dependencies
npm install

```

Set necessary environments variables.

```bash
POSTGRES_HOST=
POSTGRES_PORT=5432
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
PRIVATE_KEY=
```

## Execution
```bash
npm run seed
npm run start:dev
```

