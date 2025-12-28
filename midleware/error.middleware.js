module.exports = (err, req, res, next) => {
  // console.error(err); // full error for logs

  // JSON parse error
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid JSON payload",
      },
    });
  }

  const statusCode = err.statusCode && Number.isInteger(err.statusCode)
    ? err.statusCode
    : 500;

  const message =
    statusCode === 500
      ? "Internal Server Error"
      : err.message;

  res.status(statusCode).json({
    success: false,
    error: { message },
  });
};
