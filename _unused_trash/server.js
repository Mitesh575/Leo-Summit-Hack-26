// Leo Summit Hack'26 Backend Server
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Email Configuration
const EMAIL_ENABLED = false; // Set to true when you have App Password
const EMAIL_USER = 'Leo Summit Hack'26ks26 @gmail.com';
const EMAIL_APP_PASSWORD = 'YOUR_APP_PASSWORD';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_APP_PASSWORD
    }
});

// Helper: Send Email
async function sendConfirmationEmail(registration) {
    if (!EMAIL_ENABLED || EMAIL_APP_PASSWORD === 'YOUR_APP_PASSWORD') return;

    const teamLead = registration.members.find(m => m.isLead) || registration.members[0];
    if (!teamLead || !teamLead.email) return;

    const membersList = registration.members.map((m, i) => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #2a2a3a;">${i + 1}</td>
            <td style="padding: 10px; border-bottom: 1px solid #2a2a3a;">${m.name}${m.isLead ? ' 👑' : ''}</td>
            <td style="padding: 10px; border-bottom: 1px solid #2a2a3a;">${m.email}</td>
        </tr>
    `).join('');

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #1e3a8a; text-align: center;">🦁 Registration Confirmed!</h2>
            <p>Dear <strong>${teamLead.name}</strong>,</p>
            <p>Your team <strong>${registration.teamName}</strong> has been successfully registered for Leo Summit Hack'26.</p>
            <h3>👥 Team Members</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: #1e3a8a; color: white;">
                    <th style="padding: 8px; text-align: left;">#</th>
                    <th style="padding: 8px; text-align: left;">Name</th>
                    <th style="padding: 8px; text-align: left;">Email</th>
                </tr>
                ${membersList}
            </table>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: `"Leo Summit Hack'26" <${EMAIL_USER}>`,
            to: teamLead.email,
            subject: `✅ Registration Confirmed - ${registration.teamName}`,
            html: emailHtml
        });
        console.log(`📧 Confirmation email sent to ${teamLead.email}`);
    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
    }
}

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Data file
const dataFile = path.join(__dirname, 'registrations.json');
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([], null, 2));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadsDir));

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files are allowed'), false);
    }
});

// Helper: Read/Write Data
function getRegistrations() {
    try {
        return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (error) {
        return [];
    }
}

function saveRegistrations(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// API Routes
app.post('/api/register', upload.single('pdfFile'), (req, res) => {
    try {
        const registrations = getRegistrations();
        const registrationData = {
            id: Date.now().toString(),
            teamName: req.body.teamName,
            college: req.body.college,
            domain: req.body.domain,
            problem: req.body.problem,
            members: JSON.parse(req.body.members || '[]'),
            pdfFile: req.file ? {
                name: req.file.originalname,
                filename: req.file.filename,
                size: req.file.size,
                path: `/uploads/${req.file.filename}`
            } : null,
            timestamp: new Date().toISOString()
        };

        registrations.push(registrationData);
        saveRegistrations(registrations);
        sendConfirmationEmail(registrationData).catch(console.error);

        console.log(`✅ New registration: ${registrationData.teamName}`);
        res.status(201).json({ success: true, data: registrationData });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

app.get('/api/registrations', (req, res) => {
    res.json({ success: true, data: getRegistrations() });
});

app.get('/api/registrations/:id', (req, res) => {
    const reg = getRegistrations().find(r => r.id === req.params.id);
    if (reg) res.json({ success: true, data: reg });
    else res.status(404).json({ success: false });
});

app.delete('/api/registrations/:id', (req, res) => {
    let registrations = getRegistrations();
    const index = registrations.findIndex(r => r.id === req.params.id);

    if (index === -1) return res.status(404).json({ success: false });

    const reg = registrations[index];
    if (reg.pdfFile && reg.pdfFile.filename) {
        const pdfPath = path.join(uploadsDir, reg.pdfFile.filename);
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    registrations.splice(index, 1);
    saveRegistrations(registrations);
    res.json({ success: true, message: 'Deleted' });
});

// PDF endpoint
app.get('/api/pdf/:filename', (req, res) => {
    const filePath = path.join(uploadsDir, req.params.filename);
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else res.status(404).json({ success: false });
});

app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║   🦁  Leo Summit Hack'26 Server Running!                           ║
    ║   💻  Local Mode (JSON Storage)                             ║
    ║                                                              ║
    ║   📍 Website:     http://localhost:${PORT}                     ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    `);
});
