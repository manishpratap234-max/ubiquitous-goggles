function ok(res, data, message = 'success') {
  return res.status(200).json({ message, data });
}

function created(res, data, message = 'created') {
  return res.status(201).json({ message, data });
}

function fail(res, code, message) {
  return res.status(code).json({ message });
}

module.exports = { ok, created, fail };
