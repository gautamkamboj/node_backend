const express = require('express');
const morgan = require('morgan');  

const app = express();


const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log the time taken to process the request
    console.log(`[${timestamp}] ${method} ${url} - ${duration}ms - IP: ${ip}`);
  });

  next();
};

app.use(morgan('combined'));  

app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/test', (req, res) => {
  res.send('This is a test route.');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const infoLogger = (req, res, next) => {
  console.info(`[INFO] ${req.method} ${req.url}`);
  next();
};

const debugLogger = (req, res, next) => {
  console.debug(`[DEBUG] ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`);
  next();
};

app.use(infoLogger);
app.use(debugLogger);
