# KidsMindful Backend API Documentation

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```
Request body:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "gender": "string",
  "age": "number"
}
```

#### Login
```http
POST /api/auth/login
```
Request body:
```json
{
  "email": "string",
  "password": "string"
}
```

### Mood Tracking

#### Save Mood Entry
```http
POST /api/moods
Authorization: Bearer <token>
```
Request body:
```json
{
  "mood": "string",
  "note": "string",
  "date": "string"
}
```

#### Get User's Mood History
```http
GET /api/moods
Authorization: Bearer <token>
```

## Testing the API

### Prerequisites
- Node.js and npm installed
- Postman or similar API testing tool

### Local Testing Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
PORT=3000
JWT_SECRET=your-test-secret
NODE_ENV=test
```

3. Run tests:
```bash
npm test
```

### Manual API Testing with Postman

1. Start the server:
```bash
npm run dev
```

2. Import the Postman collection:
   - Open Postman
   - Import the `KidsMindful.postman_collection.json` file
   - Set up environment variables:
     - `BASE_URL`: `http://localhost:3000`
     - `TOKEN`: (after login, set the JWT token here)

3. Test Flow:
   1. Register a new user (POST /api/auth/register)
   2. Login (POST /api/auth/login)
   3. Copy the token from the login response
   4. Set the token in your environment variables
   5. Test protected endpoints

### Environment Variables

```env
PORT=3000                    # Server port
JWT_SECRET=your-secret-key   # JWT signing key
NODE_ENV=development         # Environment (development/test/production)
DATABASE_URL=                # Database URL (for production)
```

### Error Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Rate Limiting

- 100 requests per IP per 15 minutes
- Applies to all endpoints

### Database Schema

#### User
```sql
CREATE TABLE Users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  gender TEXT,
  age INTEGER,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

#### MoodEntry
```sql
CREATE TABLE MoodEntries (
  id INTEGER PRIMARY KEY,
  userId INTEGER NOT NULL,
  mood TEXT NOT NULL,
  note TEXT,
  date DATETIME NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES Users(id)
);
``` 