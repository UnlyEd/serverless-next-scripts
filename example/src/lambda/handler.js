'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      __origin__: `LAMBDA`,
      __explanation__: `Both "public" and "secret" keys should be available, because this doesn't use the plugin and will not ignore the SECRET_KEY`,
      public: process.env.PUBLIC_KEY,
      secret: process.env.SECRET_KEY,
    }),
  };

  callback(null, response);
};
