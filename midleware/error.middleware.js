
module.exports = (err, req, res, next) => {
//   console.error(err); 

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON payload",
    });
  }
  res.status(statusCode).json({
    success: false,
    error: {
      message
    }
  });
};
