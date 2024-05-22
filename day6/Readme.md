
# Express Logging Middleware 

## Overview

This documentation explains how to create a logging middleware for an Express application. The middleware logs information about each incoming request, including the HTTP method, the requested URL, the IP address, and timestamps. Additionally, it logs the time taken to process each request. Optional features include implementing different logging levels for various verbosity.

## Table of Contents

1. [Setup and Initialization](#setup-and-initialization)
2. [Middleware Development](#middleware-development)
3. [Logging Details](#logging-details)
4. [Global Middleware Inclusion](#global-middleware-inclusion)
5. [Optional: Logging Levels](#optional-logging-levels)
6. [Testing and Documentation](#testing-and-documentation)
7. [Complete Example Code](#complete-example-code)
8. [Conclusion](#conclusion)

## Setup and Initialization

### Initialize a New Node.js Project

First, create a new directory for your project and initialize a new Node.js project:

```sh
mkdir express-logging
cd express-logging
npm init -y
```

### Install Necessary Dependencies

Install Express and optionally Morgan for advanced logging:

```sh
npm install express
npm install morgan  # Optional, for advanced logging
```

## Middleware Development

### Basic Logging Middleware

Create a middleware function called `requestLogger` that captures and logs details about incoming requests. The middleware logs the HTTP method, URL, IP address, and timestamps, and calculates the time taken to process the request.

```javascript
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;
  const timestamp = new Date().toISOString();

  // Log the incoming request details
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log the time taken to process the request
    console.log(`[${timestamp}] ${method} ${url} - ${duration}ms - IP: ${ip}`);
  });

  next();
};
```

## Logging Details

The `requestLogger` middleware logs the following details for each incoming request:

- **HTTP Method:** The HTTP method used for the request (e.g., GET, POST).
- **URL:** The URL requested.
- **IP Address:** The IP address of the client making the request.
- **Timestamp:** The date and time when the request was received.
- **Processing Time:** The time taken to process the request.

## Global Middleware Inclusion

Include the `requestLogger` middleware as a global middleware function in your Express application. This ensures that all incoming requests are automatically logged.

```javascript
const express = require('express');
const app = express();

app.use(requestLogger);

// Example routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/test', (req, res) => {
  res.send('This is a test route.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Optional: Logging Levels

For additional complexity, create separate middleware functions for different logging levels (e.g., `infoLogger`, `debugLogger`). This allows you to control the verbosity of the logs based on the application's requirements.

### Info Logger

```javascript
const infoLogger = (req, res, next) => {
  console.info(`[INFO] ${req.method} ${req.url}`);
  next();
};
```

### Debug Logger

```javascript
const debugLogger = (req, res, next) => {
  console.debug(`[DEBUG] ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`);
  next();
};
```

### Using Different Logging Levels

To use the different logging levels, uncomment the corresponding middleware functions:

```javascript
// app.use(infoLogger);
// app.use(debugLogger);
```

## Testing and Documentation

### Testing the Middleware

Test the middleware by making various requests to your Express application. You can use tools like `curl`, Postman, or your browser to send requests and observe the logs in the console.

Example requests:

```sh
curl http://localhost:3000/
curl http://localhost:3000/test
```

### Documentation

Ensure your code is well-documented with comments explaining each part of the middleware. This helps others understand the purpose and functionality of the code.

## Complete Example Code

Here is the complete example code for your Express application with the logging middleware:

```javascript
const express = require('express');
const morgan = require('morgan');  // Optional for advanced logging

const app = express();

// Basic requestLogger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;
  const timestamp = new Date().toISOString();

  // Log the incoming request details
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log the time taken to process the request
    console.log(`[${timestamp}] ${method} ${url} - ${duration}ms - IP: ${ip}`);
  });

  next();
};

// Optional: Advanced logging using Morgan
// app.use(morgan('combined'));  // Uncomment to use Morgan

// Global Middleware Inclusion
app.use(requestLogger);

// Example routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/test', (req, res) => {
  res.send('This is a test route.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Optional: Different logging levels
const infoLogger = (req, res, next) => {
  console.info(`[INFO] ${req.method} ${req.url}`);
  next();
};

const debugLogger = (req, res, next) => {
  console.debug(`[DEBUG] ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`);
  next();
};

// Uncomment to use different logging levels
// app.use(infoLogger);
// app.use(debugLogger);
```

## Conclusion

By following this documentation, you will be able to create a comprehensive logging middleware for your Express application. This middleware captures and logs essential details about incoming requests, providing valuable insights into your application's activity and performance. Optional logging levels allow for greater control over log verbosity, aiding in debugging and monitoring efforts.

---
