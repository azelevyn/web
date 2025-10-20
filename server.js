import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.static("webapp"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "webapp" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 WebApp running on port ${PORT}`));
