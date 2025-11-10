const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');

// helper validation (unit-testable)
function validateBugPayload(payload) {
  if (!payload || !payload.title || typeof payload.title !== 'string') {
    return { valid: false, message: 'Title is required and must be a string' };
  }
  return { valid: true };
}

router.post('/', async (req, res, next) => {
  try {
    const { valid, message } = validateBugPayload(req.body);
    if (!valid) return res.status(400).json({ error: message });

    if (!req.app.locals.store) {
      const bug = await Bug.create(req.body);
      return res.status(201).json(bug);
    } else {
      const store = req.app.locals.store;
      const bug = { id: store.idCounter++, ...req.body, createdAt: new Date(), status: req.body.status || 'open' };
      store.bugs.push(bug);
      return res.status(201).json(bug);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    if (!req.app.locals.store) {
      const bugs = await Bug.find().lean();
      return res.json(bugs);
    } else {
      return res.json(req.app.locals.store.bugs);
    }
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.app.locals.store) {
      const bug = await Bug.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!bug) return res.status(404).json({ error: 'Not found' });
      return res.json(bug);
    } else {
      const store = req.app.locals.store;
      const idx = store.bugs.findIndex(b => String(b.id) === String(id));
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      store.bugs[idx] = { ...store.bugs[idx], ...req.body };
      return res.json(store.bugs[idx]);
    }
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.app.locals.store) {
      const bug = await Bug.findByIdAndDelete(id);
      if (!bug) return res.status(404).json({ error: 'Not found' });
      return res.json({ success: true });
    } else {
      const store = req.app.locals.store;
      const idx = store.bugs.findIndex(b => String(b.id) === String(id));
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      store.bugs.splice(idx, 1);
      return res.json({ success: true });
    }
  } catch (err) { next(err); }
});

module.exports = router;
module.exports.validateBugPayload = validateBugPayload;
