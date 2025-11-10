function errorHandler(err, req, res, next) {
  console.error('[ERROR HANDLER]', err && err.message ? err.message : err);
  res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = { errorHandler };
