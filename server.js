const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 5050;


const MONGO_URL = process.env.MONGO_URL;

let db;


async function connectToMongo(retries = 5) {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.log("❌ Mongo connection failed");
    if (retries > 0) {
      console.log(`Retrying in 3 seconds... (${retries} left)`);
      setTimeout(() => connectToMongo(retries - 1), 3000);
    } else {
      console.log("❌ Could not connect to MongoDB after retries");
      process.exit(1);
    }
  }
}


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.get("/data", async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: "DB not connected" });
  }

  const collection = db.collection("test");
  await collection.insertOne({ time: new Date() });

  const count = await collection.countDocuments();
  res.json({ message: "Data inserted", count });
});


app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
  connectToMongo();
});
