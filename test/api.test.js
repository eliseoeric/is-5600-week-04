"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../app");
const Products = require("../products");

test("Fullstack Prints API meets the Part 1 requirements", async (t) => {
  const file = path.join(__dirname, "../data/full-products.json");
  const originalData = fs.readFileSync(file, "utf8");
  const products = JSON.parse(originalData);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (route, options) => fetch(base + route, options);
  try {
    await t.test("serves the provided page and frontend JavaScript", async () => {
      let res = await request("/");
      assert.equal(res.status, 200);
      assert.match(await res.text(), /Fullstack Prints/);
      res = await request("/index.js");
      assert.equal(res.status, 200);
      assert.match(await res.text(), /listPrints/);
    });

    await t.test("lists arrays with default and custom pagination", async () => {
      assert.deepEqual(await (await request("/products")).json(), products.slice(0, 25));
      assert.deepEqual(await (await request("/products?limit=1&offset=20")).json(), products.slice(20, 21));
      assert.deepEqual(await (await request("/products?limit=0")).json(), []);
      assert.deepEqual(await (await request("/products?offset=999999")).json(), []);
      assert.equal((await (await request("/products?limit=1000")).json()).length, products.length);
    });

    await t.test("filters tag objects before pagination", async () => {
      const texture = products.filter((p) => p.tags.some((tag) => tag.title === "texture"));
      assert.ok(texture.length > 10);
      assert.deepEqual(await (await request("/products?tag=texture&offset=10&limit=10")).json(), texture.slice(10, 20));
      assert.deepEqual(await (await request("/products?tag=not-a-real-tag")).json(), []);
      assert.deepEqual(await (await request("/products?tag=")).json(), products.slice(0, 25));
    });

    await t.test("gets one product and returns JSON 404 for missing resources", async () => {
      const res = await request(`/products/${products[0].id}`);
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), products[0]);
      for (const route of ["/products/not-a-real-id", "/unknown"]) {
        const missing = await request(route);
        assert.equal(missing.status, 404);
        assert.deepEqual(await missing.json(), { error: "Not Found" });
      }
    });

    await t.test("rejects invalid and repeated pagination parameters", async () => {
      for (const query of ["limit=-1", "offset=abc", "limit=1.5", "offset=", "limit=2&limit=3", "tag=a&tag=b"]) {
        assert.equal((await request(`/products?${query}`)).status, 400, query);
      }
    });

    await t.test("parses POST and PUT bodies, and accepts DELETE with required statuses", async () => {
      const data = { description: "Lab 04 sample print", price: 25 };
      const options = { headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) };
      const created = await request("/products", { ...options, method: "POST" });
      assert.equal(created.status, 200);
      assert.deepEqual(await created.json(), data);
      const id = products[0].id;
      const updated = await request(`/products/${id}`, { ...options, method: "PUT" });
      assert.equal(updated.status, 200);
      assert.deepEqual(await updated.json(), { ...data, id });
      const deleted = await request(`/products/${id}`, { method: "DELETE" });
      assert.equal(deleted.status, 202);
      assert.equal((await deleted.json()).id, id);
      // Writes are intentionally placeholders in Part 1.
      assert.equal(fs.readFileSync(file, "utf8"), originalData);
      assert.deepEqual(await (await request(`/products/${id}`)).json(), products[0]);
    });

    await t.test("sets CORS headers and handles preflight before routes", async () => {
      const res = await request("/products", { method: "OPTIONS", headers: { Origin: "https://example.com", "Access-Control-Request-Method": "PUT" } });
      assert.equal(res.status, 204);
      assert.equal(res.headers.get("access-control-allow-origin"), "https://example.com");
      assert.equal(res.headers.get("access-control-allow-credentials"), "true");
      assert.match(res.headers.get("access-control-allow-methods"), /PUT/);
      assert.match(res.headers.get("vary"), /Origin/);
      assert.equal((await request("/products")).headers.get("access-control-allow-origin"), "*");
    });

    await t.test("handles malformed JSON and forwards service errors through autoCatch", async () => {
      let res = await request("/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{bad json" });
      assert.equal(res.status, 400);
      assert.deepEqual(await res.json(), { error: "Invalid JSON request body" });
      const originalList = Products.list;
      try {
        Products.list = async () => { throw new Error("Simulated read failure"); };
        res = await request("/products");
        assert.equal(res.status, 500);
        assert.deepEqual(await res.json(), { error: "Internal Error Occurred" });
      } finally {
        Products.list = originalList;
      }
    });
  } finally {
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
  }
});
