const express = require("express");
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const trimmedEmail = (email || "").trim();
  const trimmedPassword = (password || "").trim();

  const query = "SELECT * FROM users WHERE email = ?";

  try {
    const [rows] = await pool.execute(query, [trimmedEmail]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);

    if (isMatch) {
      return res.json({
        success: true,
        userId: user.id,
        token: "fake-jwt-token",
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during login." });
  }
});

app.post("/api/register", async (req, res) => {
  const { email, password, name, surname } = req.body;

  try {
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Користувач з цією поштою вже існує.",
      });
    }

    const [maxIdRow] = await pool.execute("SELECT MAX(id) as maxId FROM users");
    const newUserId = (maxIdRow[0].maxId || 0) + 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery =
      "INSERT INTO users (id, email, password) VALUES (?, ?, ?)";
    await pool.execute(insertUserQuery, [newUserId, email, hashedPassword]);

    const insertProfileQuery =
      "INSERT INTO profile (id, name, surname, email) VALUES (?, ?, ?, ?)";
    await pool.execute(insertProfileQuery, [newUserId, name, surname, email]);

    return res.status(201).json({ success: true, userId: newUserId });
  } catch (error) {
    console.error("Registration Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Помилка сервера при реєстрації." });
  }
});

app.post("/api/upload-avatar", upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Файл не завантажено" });
  }

  const userId = req.query.userId;
  const avatarUrl = `/uploads/${req.file.filename}`;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID missing" });
  }

  try {
    await pool.execute("UPDATE profile SET avatarUrl = ? WHERE id = ?", [
      avatarUrl,
      userId,
    ]);
    res.json({ success: true, avatarUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: "Помилка бази даних" });
  }
});

app.get("/profile", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: "User ID required" });

  try {
    const [rows] = await pool.execute(
      "SELECT name, surname, email, avatarUrl FROM profile WHERE id = ?",
      [userId]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Profile not found" });
    }
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/entries", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: "User ID required" });

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM entries WHERE user_id = ? ORDER BY date DESC",
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Get Entries Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/tips", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM tips");
    res.json(rows);
  } catch (e) {
    console.error("Get Tips Error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/films", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM films");
    res.json(rows);
  } catch (e) {
    console.error("Get Films Error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/entries", async (req, res) => {
  const { mood, text, tag, date, userId } = req.body;
  const finalDate = date;

  if (!userId) return res.status(400).json({ message: "User ID required" });

  const query =
    "INSERT INTO entries (mood, text, tag, date, user_id) VALUES (?, ?, ?, ?, ?)";

  try {
    await pool.execute(query, [mood, text, tag, finalDate, userId]);
    res.status(201).json({ message: "Entry created" });
  } catch (error) {
    console.error("Post Entry Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/profile", async (req, res) => {
  const { userId, ...fields } = req.body;
  const { newPassword, ...profileFields } = fields;

  if (!userId) return res.status(400).json({ message: "User ID required" });

  const updates = [];
  const values = [];

  for (const key in profileFields) {
    updates.push(`${key} = ?`);
    values.push(profileFields[key]);
  }

  try {
    if (updates.length > 0) {
      const query = `UPDATE profile SET ${updates.join(", ")} WHERE id = ?`;
      values.push(userId);
      await pool.execute(query, values);
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.execute("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        userId,
      ]);
    }

    const [updatedProfile] = await pool.execute(
      "SELECT name, surname, email, avatarUrl FROM profile WHERE id = ?",
      [userId]
    );
    return res.json(updatedProfile[0]);
  } catch (error) {
    console.error("Patch Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Express server listening on http://localhost:${PORT}`);
});
