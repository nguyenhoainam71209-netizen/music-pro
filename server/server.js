const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

/* ===== FOLDER ===== */
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

/* ===== FIX UTF-8 TÊN FILE ===== */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // 🔥 FIX tiếng Việt
        const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");

        // tránh trùng tên
        const safeName = Date.now() + "_" + originalName;

        cb(null, safeName);
    }
});

const upload = multer({ storage });

/* ===== MIDDLEWARE ===== */

// serve file nhạc
app.use("/uploads", express.static(UPLOAD_DIR));

// serve client (index.html)
app.use(express.static(path.join(__dirname, "../client")));

/* ===== API ===== */

// GET danh sách bài
app.get("/songs", (req, res) => {
    try {
        const files = fs.readdirSync(UPLOAD_DIR);
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: "Lỗi đọc file" });
    }
});

// UPLOAD
app.post("/upload", upload.single("file"), (req, res) => {
    res.json({ ok: true });
});

// DELETE bài
app.delete("/songs/:name", (req, res) => {
    try {
        const fileName = req.params.name;
        const filePath = path.join(UPLOAD_DIR, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.json({ ok: true });
        }

        res.status(404).json({ error: "Không tìm thấy file" });

    } catch (err) {
        res.status(500).json({ error: "Lỗi xoá file" });
    }
});

/* ===== START ===== */
const PORT = 3000;
app.listen(PORT, () => {
    console.log("👉 Server chạy tại: http://localhost:" + PORT);
});