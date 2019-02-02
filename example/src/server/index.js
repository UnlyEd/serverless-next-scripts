const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({
    __origin__: `serverless-script-env`,
    __explanation__: `Only the "public" value should be set, because this script has been executed from the plugin and therefore ignores the SECRET_KEY`,
    public: process.env.PUBLIC_KEY,
    secret: process.env.SECRET_KEY || null,
  });
});

app.listen(process.env.PORT_SERVER, () => {
  console.log(`App listening on PORT_SERVER: ${process.env.PORT_SERVER}!`);
});
