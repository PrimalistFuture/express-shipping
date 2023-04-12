"use strict";
const shipItApi = require('../shipItApi');
shipItApi.shipProduct = jest.fn();
const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test('is output data the right type?', async function () {
    const resp = await request(app).post('/shipments').send({
      productId: 2,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
			"instance.productId must be greater than or equal to 1000"
		])
    // expect(typeof resp.body.shipped).toBe("object");

  });

  test('is error JSON returned if input is not valid?', async function () {
    const resp = await request(app).post('/shipments').send({
      productId: '1000',
      name: 20,
      addr: 123,
      zip: 22222,
    });

    expect(resp.statusCode).toEqual(400);
  });

});
