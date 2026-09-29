class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Map common MySQL errors to HTTP status codes
const mysqlMap = {
  ER_DUP_ENTRY: [409, 'Duplicate value: record already exists'],
  ER_NO_REFERENCED_ROW_2: [409, 'Related record does not exist'],
  ER_ROW_IS_REFERENCED_2: [409, 'Record is used by other data and cannot be deleted'],
  ER_BAD_NULL_ERROR: [422, 'A required column is missing'],
  ER_NO_DEFAULT_FOR_FIELD: [422, 'A required column is missing'],
  ER_TRUNCATED_WRONG_VALUE: [422, 'Invalid value format'],
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: [422, 'Invalid value format'],
  ER_DATA_TOO_LONG: [422, 'Value is too long for a column'],
  ER_WARN_DATA_OUT_OF_RANGE: [422, 'Value is out of range'],
};

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ success: false, message: err.message, details: err.details });
  }
  if (err && err.code && mysqlMap[err.code]) {
    const [status, message] = mysqlMap[err.code];
    return res.status(status).json({ success: false, message, details: err.sqlMessage });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
}

module.exports = { AppError, asyncHandler, notFound, errorHandler };
