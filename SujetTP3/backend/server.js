const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");

const app = express();

const PORT = process.env.BACKEND_PORT || 3001;
const REDIS_HOST = process.env.REDIS_HOST || "cache";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

app.use(cors());
app.use(express.json());

const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT)
  }
});

redisClient.on("error", (err) => {
  console.error(err);
});

async function start() {
  await redisClient.connect();

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/tasks", async (req, res) => {
    const tasks = await redisClient.lRange("tasks", 0, -1);
    res.json(tasks.map(task => JSON.parse(task)));
  });

  app.post("/tasks", async (req, res) => {
    const task = {
      id: Date.now(),
      title: req.body.title
    };

    await redisClient.rPush("tasks", JSON.stringify(task));
    res.status(201).json(task);
  });

  app.listen(PORT, () => {
    console.log(`Backend lancé sur ${PORT}`);
  });
}

start();
