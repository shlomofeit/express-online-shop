# express-online-shop

A store management system for a store called "Vanilla Optics" that manages the end-to-end customer purchasing processes - from the moment of entering the store, shopping cart management and payment.
The system can handle the customer database.
All database files are in JSON format and the project is written in Node.js.

# Installation and start

```bash
npm start
```

## Sturcture

    │── .env
    │── .env.exemple
    │── app.js
    │── server.js
    │── data/
    │   │── customers.json
    │   │── products.json
    │── routes/
    │   │── cart.js
    │   │── customers.js
    │   │── orders.js
    │   │── products.js

## System flow

API call to `/health`

\\/

response: ok

\\/

API call to `/products`

\\/

...
