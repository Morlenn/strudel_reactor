import express from 'express';
import cors from 'cors';
import path from 'path';
import { writeFileSync, readFileSync } from 'fs';

const __dirname = import.meta.dirname; // __dirname doesn't work out of the box with ES.
const tunesPath = path.join(__dirname, 'data', 'saved-tunes.json');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // express json parsing middleware.
app.use(cors()); // prevent CORS policy errors

// Serve static files from public folder.
app.use(express.static(path.join(__dirname, 'data')));

// Load endpoint
app.get('/load-tunes', (req, res) => {
    let data = readFileSync(tunesPath, 'utf8');
    data = JSON.parse(data);
    res.send(data);
})

// Save end point
app.post('/update-tunes', (req, res) => {
    let data = JSON.stringify(req.body, null, 2);
    writeFileSync(tunesPath, data);
    res.json(data);
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});