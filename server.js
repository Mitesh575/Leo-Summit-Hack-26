const express = require('express');
const os = require('os');
const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(__dirname, {
    maxAge: '1d' // Cache files for 1 day to speed up reloading
}));

// Helper to find local IP address
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

app.listen(port, () => {
    console.log(`\n🚀 Server running!`);
    console.log(`👉 Local:   http://localhost:${port}`);
    console.log(`👉 Phone:   http://${getLocalIp()}:${port}\n`);
});