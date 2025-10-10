
DREVO — working version with server-backed supply counter.

Files included:
- index.html (your original UI, modified only to call local API endpoints)
- server.js (Express server exposing /api/supply and /api/buy)
- supply-data.json (stores purchased counts for items)
- package.json

How it works:
- The frontend calls GET /api/supply to get purchased counts {cat, cross, cybercar}.
- Remaining = GIFTS_DATA.totalSupply - purchased.
- When a user buys a gift, frontend calls POST /api/buy with {id: "<giftId>"}.
- Server increments purchased count for that id and saves supply-data.json.
- Frontend polls /api/supply every 3 seconds (existing code) so all users see updated counts.

Run locally:
1. cd DREVO_project
2. npm install
3. npm start
4. Open http://localhost:3000

Notes:
- This implementation uses simple file-based storage (supply-data.json). For production, use a proper DB or atomic counter.
- I left your UI unchanged except for replacing GitHub raw fetch with local API endpoints.
