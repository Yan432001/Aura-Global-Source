const express = require('express');

/** Standard REST routes. Tables without a primary key only get list + create. */
module.exports = function createRouter(controller, model) {
  const router = express.Router();

  router.route('/').get(controller.index).post(controller.store);

  if (model.hasKey) {
    router.route('/:id').get(controller.show).put(controller.update).patch(controller.update).delete(controller.destroy);
  }

  return router;
};
