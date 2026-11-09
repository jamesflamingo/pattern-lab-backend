# Pattern Lab API

JSON Server API for the Pattern Lab frontend. The frontend and API are kept in separate repositories and can be deployed independently.

## Local development

```sh
npm ci
npm start
```

The API listens on `http://localhost:3001` by default. `PORT` can override the port and `DB_FILE` can point JSON Server at another database file.

## Collections and relation

- `GET /garments` — pattern catalog.
- `GET /components?garmentId=6` — components for one garment. `components.garmentId` references `garments.id`.
- `GET /bodySizes` — standard size measurements.
- `GET /designs` — saved designs. Each design stores its `garmentId`, selected component options and sizes.
- `POST /designs` — create a saved design.
- `PATCH /designs/:id` — update a saved design.
- `DELETE /designs/:id` — remove a saved design.

JSON Server also provides the collection and item read routes for these resources.

## Deploy on Render

Create a Blueprint from this repository and use `render.yaml`. The persistent disk stores the JSON database at `/var/data/db.json`; on its first start, the service seeds it from the checked-in `db.json`.

Set the frontend deployment's `VITE_API_URL` to the public URL of this service. Do not include `/garments` in the environment variable.
