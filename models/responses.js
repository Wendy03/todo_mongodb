const headers = require('./headers');

const successHandler = (res, data) => {
  res.writeHead('200', headers);
  res.write(
    JSON.stringify({
      status: 'success',
      data,
    })
  );
  res.end();
};

const errorHandler = (res, message) => {
  res.writeHead('404', headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: message,
    })
  );
  res.end();
};

module.exports = {
  successHandler,
  errorHandler,
};
