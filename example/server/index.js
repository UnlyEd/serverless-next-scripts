const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({
    public: process.env.PUBLIC_KEY,
    secret: process.env.SECRET_KEY || 'I\'m secret',
  });
});

app.listen(process.env.PORT_SERVER, () => {
  console.log(`App listening on PORT_SERVER: ${process.env.PORT_SERVER}!`);
});
