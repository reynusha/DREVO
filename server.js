
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(__dirname, { index: "index.html" }));

const filePath = path.join(__dirname, "supply-data.json");

function readData() {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { cat: 0, cross: 0, cybercar: 0 };
  }
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET /api/supply - returns purchased counts
app.get("/api/supply", (req, res) => {
  const data = readData();
  res.json(data);
});

// POST /api/buy - body: { id: "cat" } -> increments purchased count by 1 if not exceeding totalSupply
app.post("/api/buy", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ success: false, message: "Missing id" });

  const data = readData();
  if (!(id in data)) {
    // initialize if missing
    data[id] = 0;
  }
  data[id] = Number(data[id]) + 1;
  writeData(data);
  res.json({ success: true, id, purchased: data[id] });
});

app.listen(PORT, () => {
  console.log(`✅ DREVO server running at http://localhost:${PORT}`);
});
