# API Documentation

## Base URL

The base URL for accessing the API is `https://adv-backend.vercel.app`.

## Endpoints
- /api/user/register (POST)
- /api/user/login  (POST)
- /api/user/userprofile   (GET)
- /api/user/postad (POST)
- /api/user/getads (GET)
- /api/user/ad/{id} (PATCH)
- /api/user/ad/{id} (DELETE)
- /api/user/admetric  (POST)
- /api/user/uploadmedia (POST)
- /api/user/allmedia (GET)
- /api/user/usersearch?search={search_query} (GET)
- /api/user/updaterole/{userid} (POST)

### User Registration

Endpoint: `POST /api/user/register`

## Authentication

No authentication is required for accessing the registration endpoint.

This endpoint allows users to register with the platform.

#### Request Body

The request body should be a JSON object with the following fields:

- `name` (string, required): The name of the user.
- `email` (string, required): The email address of the user.
- `password` (string, required): The password for the user.
- `type` (string, required): The type of user (Client, Content Creator, Advertiser).
- `location` (string, optional): The location of the user (required only for Client type).

#### Response

- Success Response: Status 200 OK
 
```json
{
    "status": "success",
    "message": "Registration successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NWJhNjRhYjkzNGRlYmFkZTE4NThkZWIiLCJpYXQiOjE3MDY3MTQyODMsImV4cCI6MTcwNzMxOTA4M30.JyAS7TqsoB8fSMb2EkX0XJkE-3EERiwER3mhdlm_IR0" 

}
```

- Error Response: Status 400 FAILED

```json
{
    "status": "failed",
    "message": "Email already exists"
}
```


