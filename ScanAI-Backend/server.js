
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// 1. Middleware
app.use(cors());
app.use(express.json());
// Serve the uploads folder so you can see the images in a browser if needed
app.use('/uploads', express.static('uploads'));

// 2. Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 3. Configure Multer (Storage Logic)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Saves file as: scan-1714123456.jpg
        cb(null, `scan-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for safety
});

app.get('/', (req, res) => {
    res.send('🚀 OncoScan Backend is Live and Ready!');
});

// 4. The Analysis Route
const { spawn } = require('child_process');

app.post('/api/upload-scan', upload.single('scan'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file.' });

    const imagePath = req.file.path;
    const pythonProcess = spawn('python', ['predict.py', imagePath]);

    let pythonOutput = "";

    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString(); 
    });

    pythonProcess.on('close', (code) => {
        const lines = pythonOutput.trim().split('\n');
        const finalLine = lines[lines.length - 1]; 
        const result = finalLine.split(',');

        if (result.length === 2) {
            const [verdictRaw, confidence] = result;
            const verdict = verdictRaw.trim().toLowerCase();

            // --- DYNAMIC FINDINGS LOGIC ---
            let findings = "";
            if (verdict.includes('malignant')) {
                findings = "Irregular mass with ill-defined margins detected.";
            } else if (verdict.includes('benign')) {
                findings = "Well-defined circumscribed mass detected; consistent with non-cancerous growth.";
            } else {
                findings = "No significant abnormalities or masses detected in tissue structure.";
            }

            res.json({
                success: true,
                verdict: verdictRaw.trim(), // keeps original casing for UI
                confidence: parseFloat(confidence),
                findings: findings
            });
            // ------------------------------

        } else {
            console.error("Malformed Python Output:", pythonOutput);
            res.status(500).json({ success: false, message: 'AI logic failed' });
        }
    });
});

// 5. Start Server
app.listen(PORT, () => {
    console.log('-----------------------------------');
    console.log(`🚀 ONCO-SCAN BACKEND ACTIVE`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log('-----------------------------------');
});