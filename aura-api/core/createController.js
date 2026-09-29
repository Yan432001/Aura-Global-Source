const { AppError, asyncHandler } = require('../middleware/errorHandler');

/** Builds the 5 standard handlers for a model. Extend/override them per table if needed. */
module.exports = function createController(model) {
  return {
    // GET /            -> list (page, limit, search, sort, order, column filters)
    index: asyncHandler(async (req, res) => {
      const { rows, meta } = await model.findAll(req.query);
      res.json({ success: true, data: rows, meta });
    }),

    // GET /:id         -> one record
    show: asyncHandler(async (req, res) => {
      const row = await model.findById(req.params.id);
      if (!row) throw new AppError(404, 'Record not found');
      res.json({ success: true, data: row });
    }),

    // POST /           -> create
    store: asyncHandler(async (req, res) => {
      const row = await model.create(req.body);
      res.status(201).json({ success: true, message: 'Created', data: row });
    }),

    // PUT|PATCH /:id   -> update
    update: asyncHandler(async (req, res) => {
      const row = await model.update(req.params.id, req.body);
      if (!row) throw new AppError(404, 'Record not found');
      res.json({ success: true, message: 'Updated', data: row });
    }),

    // DELETE /:id      -> delete
    destroy: asyncHandler(async (req, res) => {
      const ok = await model.remove(req.params.id);
      if (!ok) throw new AppError(404, 'Record not found');
      res.json({ success: true, message: 'Deleted' });
    }),
  };
};
