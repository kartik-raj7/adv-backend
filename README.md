# Backend Setup Guide

To run the backend of this project, follow the steps outlined below:

## Prerequisites

- Install MongoDB and MongoDB Compass.
- Ensure you have Node.js and npm installed on your machine.

## Installation

1. Clone the project from GitHub:
   ```bash
   git clone https://github.com/kartik-raj7/adv-backend.git
   ```
2. Navigate into the project directory:
   ```bash
   cd adv-backend
   ```
3. Install project dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file at the root of the project directory.

Add the following environment variables to the `.env` file:

```plaintext
DATABASE_URL="mongodb://localhost:27017"
JWT_SECRET_KEY="jfds6532d9dx3ddsdf93v5"  // add any random key here for secret key generation
EMAIL_HOST='smtp.gmail.com'
EMAIL_PORT=587
EMAIL_USER='youremail@gmail.com'  // add your email here
EMAIL_PASS='your email password'  // add your email password here
EMAIL_FROM='youremail@gmail.com'  // add your email here
API_KEY='YOUR_CLOUDINARY_API_KEY'
API_SECRET='YOUR_CLOUDINARY_API_KEY'
API_ENVIRONMENT_VARIABLE='YOUR_CLOUDINARY_ENVIRONMENT_VARIABLE'
API_CLOUD_NAME='YOUR_CLOUDINARY_CLOUD_NAME'
```

## Cloudinary Configuration

1. Create an account on Cloudinary and obtain the necessary credentials.
2. Fill in the corresponding keys in the `.env` file with the obtained credentials.

## Running the Backend

Once you have completed the installation and configuration steps, you can start the backend server by running:

```bash
npm run dev
```

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

## User Registration

Endpoint: `POST /api/user/register`

This endpoint allows users to register with the platform.

There will be three types a user can register as:

1. Client - User registered as client can view ads posted by advertiser
2. Content Creator - User registered as content creator will be able to view the content posted by the creator and also will have functionality to post new content
3. Advertiser - User registered as an advertiser can post ads as well as monitor the analytics of the ads posted by him.


### Authentication

No authentication is required for accessing the registration endpoint.

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
## User Login

Endpoint: `POST /api/user/login`

This endpoint allows to login user using email and password the user used to register previously

### Authentication

No authentication is required for accessing the registration endpoint.

#### Request Body

The request body should be a JSON object with the following fields:

- `email` (string, required): The email address of the user.
- `password` (string, required): The password for the user.

#### Response

- Success Response: Status 200 OK
 
```json
{
    "status": "success",
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NWJhNjRhYjkzNGRlYmFkZTE4NThkZWIiLCJpYXQiOjE3MDY3MTQyODMsImV4cCI6MTcwNzMxOTA4M30.JyAS7TqsoB8fSMb2EkX0XJkE-3EERiwER3mhdlm_IR0" 
}
```

- Error Response: Status 400 FAILED

```json
{
      "status": "failed",
    "message": "Wrong Email or password"
}
```

## Get User Profile

Endpoint: `GET /api/user/userprofile`

This endpoint is used to get the details of the user

### Authentication

#### Headers

Include the bearer token in the Authorization header.

#### Request Body

The request body should be empty

#### Response

- Success Response: Status 200 OK
 
```json
{
    "user": {
        "name": "Coca Cola",
        "email": "client9@user.com",
        "type": "Client",
        "location": "Delhi"
    }
}
```

- Error Response: Status 400 FAILED

```json
{
        "status": "failed",
    "message": "Unauthorized User"
}
```

## Post Ad

Endpoint: `POST /api/user/postad`

This endpoint allows advertisers to post ad

### Authentication

#### Headers

Include the bearer token in the Authorization header.

#### Request Body

The request body should be a JSON object with the following fields:

- `ad_headline` (string, required): The headline of the advertisement.
-  `ad_detail` (string, required): Details of the advertisement.
-  `ad_description` (string, required): A description of the advertisement.
-  `ad_url` (string, required): The URL associated with the advertisement.
-  `ad_scheduledtime` (string, required): The scheduled time for the advertisement 
-  `ad_expirationtime` (string, required): The expiration time for the advertisement 
-  `ad_location` (string, required): The location associated with the advertisement.
-  `ad_multimedia` (string, required): multimedia associated with advertisement if choosing from previous ones url will be sent otherwise the file


#### Response

- Success Response: Status 200 OK
 
```json
{
    "status": "success",
    "message": "Add created successfully"
}
```

- Error Response: Status 400 FAILED

```json
{
    "status": "failed",
    "message": "Failed to create ad"
}
```
- Error Response: Status 404 FAILED

```json
{
     "status": "failed",
    "message": "Only Advertiser are permitted to post Ad"
}
```

## Get Ads

Endpoint: `GET /api/user/getads`

This endpoint is used to get ads. Advertisers can only access the ads that are posted by them whereas others will be able to access the ads that are live (ie those ads that are scheduled for display on the day the api is called).

### Authentication

#### Headers

Include the bearer token in the Authorization header.

#### Request Body

The request body is empty

#### Response

- Success Response: Status 200 OK  (For any user except Advertiser)
 
```json
{
    "status": "success",
    "data": [
        {
            "_id": "65b6ad54debf25c5aa616686",
            "ad_headline": "Coca Cola",
            "ad_multimedia": "http://res.cloudinary.com/dmiajuv8k/image/upload/v1706381619/koclxhhh8ppwd2wgz5e1.png",
            "ad_detail": "testing",
            "ad_description": "testing",
            "ad_url": "http://res.cloudinary.com/dmiajuv8k/image/upload/v1706381619/koclxhhh8ppwd2wgz5e1.png",
            "ad_scheduledtime": "2024-01-29T19:38:54.760Z",
            "ad_expirationtime": "2024-02-21T19:38:54.760Z",
            "ad_location": "Delhi",
            "ad_creator": "kartikey@user.com"
        }
    ]
}
```
- Success Response: Status 200 OK  (For Advertiser)
 
```json
{
    "status": "success",
    "data": [
        {
            "_id": "65b6ad54debf25c5aa616686",
            "ad_headline": "Coca Cola",
            "ad_multimedia": "http://res.cloudinary.com/dmiajuv8k/image/upload/v1706381619/koclxhhh8ppwd2wgz5e1.png",
            "ad_detail": "testing",
            "ad_description": "testing",
            "ad_url": "http://res.cloudinary.com/dmiajuv8k/image/upload/v1706381619/koclxhhh8ppwd2wgz5e1.png",
            "ad_scheduledtime": "2024-01-29T19:38:54.760Z",
            "ad_expirationtime": "2024-02-21T19:38:54.760Z",
            "ad_location": "Delhi",
            "ad_creator": "kartikey@user.com",
            "metrics": {
                "_id": "65b6ad54debf25c5aa616688",
                "ad_id": "65b6ad54debf25c5aa616686",
                "ad_view": 319,
                "ad_clicks": 5,
                "clicked_by": []
            }
        },
    ]
}
```

- Error Response: Status 400 FAILED

```json
{
  "status": "failed",
  "message": "Unauthorized User"
}
```
- Error Response: Status 404 FAILED

```json
{
    "status": "failed",
    "message": "Failed to retrieve ads"

}
```

## Edit Ads

Endpoint: `PATCH /api/user/ad/{ad_id}`

This endpoint is used to edit ads posted by the advertiser.Only advertisers are permitted to access this functionality.

##### NOTE-  Only Advertiser that has created that ad can edit ad 

### Authentication

#### Headers

Include the bearer token in the Authorization header.

#### Request Body

The request body should be a JSON object with the following fields:

- `ad_headline` (string, optional): The headline of the advertisement.
-  `ad_detail` (string, optional): Details of the advertisement.
-  `ad_description` (string, optional): A description of the advertisement.
-  `ad_url` (string, optional): The URL associated with the advertisement.
-  `ad_scheduledtime` (string, optional): The scheduled time for the advertisement 
-  `ad_expirationtime` (string, optional): The expiration time for the advertisement 
-  `ad_location` (string, optional): The location associated with the advertisement.
-  `ad_multimedia` (string, optional): multimedia associated with advertisement if choosing from previous ones url will be sent otherwise the file


#### Response

- Success Response: Status 200 OK
 
```json
{
  "status": "success",
    "message": "Ad updated successfully"
}
```

- Error Response: Status 400 FAILED

```json
{
   "status": "failed",
    "message": "Failed to update ad"
}
```

- Error Response: Status 404 FAILED

```json
{
   "status": "failed",
    "message": "Ad not found or you don't have permission to edit this ad"
}
```

## Delete Ad

Endpoint: `DELETE /api/user/ad/{ad_id}`

This endpoint is used to delete ads posted by the advertiser.Only advertisers are permitted to access this functionality.

##### NOTE-  Only Advertiser that has created that ad can delete ad 

### Authentication

#### Headers

Include the bearer token in the Authorization header.

#### Request Body

The request body is empty

#### Response

- Success Response: Status 200 OK
 
```json
{
  "status": "success",
  "message": "Ad deleted successfully"
}
```

- Error Response: Status 400 FAILED

```json
{
     "status": "failed",
     "message": "Failed to delete ad"
}
```

- Error Response: Status 404 FAILED

```json
{
   "status": "failed",
   "message": "Ad not found or you don't have permission to delete this ad"
}
```

## Update Admetrics

Endpoint: `POST /api/user/admetric`

This endpoint is used to update the views and click count of the ads posted by the advertiser. Only clients are permitted to access this functionality.

##### NOTE- Only Client can update ad metrics(views and clicks) 

### Authentication

#### Headers

Include the bearer token in the Authorization header.

#### Request Body

The request body should be a JSON object with the following fields:

-  `views`(array,required) : array of ads with their ad_ids and count
-  `clicks`(array,required) : array of ads with their ad_ids and count

#### Response

- Success Response: Status 200 OK
 
```json
{
    "status": "success",
    "message": "Ad updated successfully"
}
```

- Error Response: Status 400 FAILED

```json
{ 
    "status": "failed",
    "message": "Invalid request"
}
```
- Error Response: Status 404 FAILED

```json
{  
     "status": "failed",
    "message": "Failed to update metrics"
}
```

## Update Admetrics

Endpoint: `POST /api/user/uploadmedia`

This endpoint is used to upload multimedia (ie audio and video) .Only Content Creators are permitted to access this functionality.

##### NOTE- Only Content Creators are permitted to access this functionality.

### Authentication

#### Headers

Include the bearer token in the Authorization header.

#### Request Body

The request body should be a JSON object with the following fields:

-  `ad_multimedia`(string,required): "BASE64_ENCODED_MULTIMEDIA_DATA"


#### Response

- Success Response: Status 200 OK
 
```json
{
    "status": "success",
    "message": "Image uploaded successfully"
    "link": "https://www.exampleimageurl.com/adjsdfnnm"
}
```

- Error Response: Status 400 FAILED

```json
{ 
    "status": "failed",
    "message": "Could not upload multimedia"
}
```
- Error Response: Status 404 FAILED

```json
{  
     "status": "failed",
    "message": "Something went wrong"
}
```

## Get All Media

Endpoint: `GET /api/user/allmedia`

This endpoint is used to get multimedia. For advertisers this api will return all the multimedia that is present in the database whereas for content creators it will be limited to only that data that is posted by the creator himself.

##### Note- Advertisers and Content Creators can access the media available. Content creator can only access media uploaded by him/her whereas advertisers can access all the media

### Authentication

#### Headers

Include the bearer token in the Authorization header.

#### Request Body

The request body should be empty

#### Response

- Success Response: Status 200 OK
 
```json
{
    "status": "success",
    "data": [
        {
            "_id": "65b2bdbd9d48e3efb7277241",
            "url": "http://res.cloudinary.com/dmiajuv8k/image/upload/v1706212796/gl4usfkcuvrcpamt3vxi.png",
            "format": "png",
            "resource_type": "image"
        }
    ]
}
```

- Error Response: Status 400 FAILED

```json
{
    "status": "failed",
    "message": "Invalid request"
}
```

- Error Response: Status 404 FAILED

```json
{
    "status": "failed",
    "message": "Something went wrong"
}
```

## User Search

Endpoint: `GET /api/user/usersearch`

This endpoint is used by the Admins to search for the users by email or by their name in the database.This api will return the users that have same name or email as in the query

##### Note- Only Admin have access to this functionality

### Authentication

#### Headers

Include the bearer token in the Authorization header.

#### URL Parameters

- `search`(string, required): The search query.(search is based on user name and email)

#### Request Body

The request body should be empty

#### Response

- Success Response: Status 200 OK
 
```json
{
    "status": "success",
    "message": "data fetched",
    "data": [
        {
            "_id": "65afd6550f7cbf8600e39ad8",
            "name": "Kartikey",
            "email": "kartikeytest@user.com",
            "type": "Advertiser"
        },
        {
            "_id": "65b02611df2e790111673bdf",
            "name": "tester1",
            "email": "kartikeygupta201@gmail.com",
            "type": "Client",
            "location": "Delhi"
        },
    ]
}
```

- Error Response: Status 400 FAILED

```json
{
   "status": "failed",
    "message": "You don't have permissions to make this request contact support"
}
```

- Error Response: Status 404 FAILED

```json
{
    "status": "failed",
    "message": "Something went wrong"
}
```

## Update User Role

Endpoint: `POST /api/user/updaterole/{user_id}`

This endpoint is will be used to modify the role of any user from the roles(Advertiser,Content Creator and Client).

##### NOTE- This Functionality is only available to Admin

### Authentication

#### Headers

Include the bearer token in the Authorization header.

#### Request Body

The request body should be a JSON object with the following fields:

- `user_role`(string, required):  "Advertiser"

#### Response

- Success Response: Status 200 OK
 
```json
{
    "status": "success",
    "message": "Role updated successfully"
}
```

- Error Response: Status 400 FAILED

```json
{
    "status": "failed",
    "message": "You don't have permissions to make this request contact support"
}
```

- Error Response: Status 404 FAILED

```json
{  
     "status": "failed",
    "message": "Something went wrong"
}
```

