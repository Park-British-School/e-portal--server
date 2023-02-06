const responseGenerator = (data, message, error = false, statusCode = 200) => {
  return {
    error,
    statusCode,
    message,
    data,
  };
};

module.exports = responseGenerator;
