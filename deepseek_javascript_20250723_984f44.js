const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from 'public' folder
app.use(express.static('public'));

// API endpoint to list files
app.get('/api/files', (req, res) => {
    const folderPath = path.join(__dirname, 'public/files');
    
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading folder' });
        }
        
        const fileData = files.map(file => {
            const stats = fs.statSync(path.join(folderPath, file));
            return {
                name: file,
                size: formatFileSize(stats.size),
                path: `/files/${file}`
            };
        });
        
        res.json(fileData);
    });
});

// File download endpoint
app.get('/download', (req, res) => {
    const fileName = req.query.file;
    const filePath = path.join(__dirname, 'public/files', fileName);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});