const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

app.use(morgan('dev'));

function isValidName(name) {
  return /^[A-Z][a-z]*$/.test(name);
}

function isValidPassword(password) {
  const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
  const upperCaseChars = /[A-Z]/;
  const numericChars = /[0-9]/;

  return (
    password.length >= 8 &&
    specialChars.test(password) &&
    upperCaseChars.test(password) &&
    numericChars.test(password)
  );
}

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  return phoneNumber.length >= 10;
}

app.post('/register', (req, res, next) => {
  console.log('Request Body:', req.body); // Log the request body

  const { firstName, lastName, password, email, phoneNumber } = req.body;

  if (!isValidName(firstName)) {
    return next(new Error('First name must start with a capital letter and contain only letters.'));
  }

  if (!isValidName(lastName)) {
    return next(new Error('Last name must start with a capital letter and contain only letters.'));
  }

  if (!isValidPassword(password)) {
    return next(
      new Error(
        'Password must be at least 8 characters long and contain at least one special character, one uppercase letter, and one numeric character.'
      )
    );
  }

  if (!isValidEmail(email)) {
    return next(new Error('Invalid email address.'));
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    return next(new Error('Phone number must be at least 10 digits long.'));
  }

  console.log('User registered successfully');
  res.json({ message: 'User registered successfully' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message); 
  res.status(400).json({ error: err.message });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});