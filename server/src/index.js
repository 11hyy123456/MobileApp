const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { port } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API Documentation: http://localhost:${port}/api-docs`);
});

module.exports = app;
