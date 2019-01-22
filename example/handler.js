'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      public: process.env.PUBLIC_KEY,
      secret: process.env.SECRET_KEY,
    }),
  };

  callback(null, response);
};
