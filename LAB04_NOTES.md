# Lab 04 — Fullstack Prints Part 1

Student: Punnam Koteswara Vara Prasad

## Run locally or in Codespaces

Use Node.js 18 or newer. From this project folder:

```sh
npm ci
npm start
```

Open http://localhost:3000/ locally, or the forwarded Application port in
Codespaces. `npm run dev` also starts the same nodemon development server.
The supplied frontend and product files are unchanged. Its external CSS
and image links require internet access.

## Backend structure

- `app.js`: Express setup, middleware order, routes, and server startup.
- `api.js`: request/response handlers wrapped by the provided autoCatch helper.
- `products.js`: reads products, filters tags, paginates, gets one product,
  and provides the Part 1 placeholder write methods.
- `middleware.js`: CORS/preflight, JSON 404 responses, and centralized errors.
- `lib/auto-catch.js`: instructor-provided rejection forwarding helper.
- `test/api.test.js`: integration checks against a temporary local server.

## Routes

| Method | Endpoint | Result |
| --- | --- | --- |
| GET | `/` | Provided Fullstack Prints frontend |
| GET | `/products` | Array of products; default offset 0 and limit 25 |
| GET | `/products?tag=texture&limit=10&offset=10` | Filter by tag, then return a page |
| GET | `/products/:id` | One product, or JSON 404 |
| POST | `/products` | Echo JSON body, HTTP 200 (Part 1 placeholder) |
| PUT | `/products/:id` | Return body and path ID, HTTP 200; log update placeholder |
| DELETE | `/products/:id` | HTTP 202; log delete placeholder |
| OPTIONS | Any route | CORS preflight, HTTP 204 |

Invalid pagination returns 400. An unknown route or missing product returns
404. A failed product read is passed to the error middleware and returns 500.

**Part 1 scope:** POST echoes its body as directed in the walkthrough.
PUT and DELETE log the operation and return the requested statuses, as
explicitly permitted in the README's Your Task section. They do not persist
changes or delete products from the JSON file. Persistence is future work.

The list endpoint deliberately returns an array because the supplied
frontend calls `prints.map()`. Although the README briefly mentions a total
count object, its actual implementation examples also return an array.
Tags in `full-products.json` are objects with a `title` field, so filtering
uses `Array.filter()` and checks each tag's title before pagination.

## Verification

```sh
npm test
```

Tests cover the supplied page/assets, default/custom pagination, limit zero,
out-of-range offsets, tag filtering before pagination, single-product lookup,
missing products/routes, invalid queries, POST/PUT/DELETE responses, unchanged
data files, CORS/preflight, malformed JSON, and centralized async errors.
The malformed-body and simulated-read-failure tests intentionally produce
server error logs while verifying the expected responses.

## Submission

Commit the backend files, package files, notes, and tests to your fork of
`eliseoeric/is-5600-week-04`. Do not upload `node_modules` or a ZIP into the
source repository. Create your pull request according to the course workflow,
include your name, and submit the pull request URL with a brief message in
Canvas. A ZIP by itself is not the required Canvas submission for this lab.
