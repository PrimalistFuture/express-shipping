"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const jsonschema = require("jsonschema");
const shipSchema = require("../schemas/shipSchema.json");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  if (req.body === undefined) {
    throw new BadRequestError('Please include required info in JSON body');
  }
  const result = jsonschema.validate(
    req.body, shipSchema, {required: true}
  );

  if (!result.valid) {

    const errors = result.errors.map(err => err.stack);
    throw new BadRequestError(errors);
  }
  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });
  return res.json({ shipped: shipId });
});


module.exports = router;