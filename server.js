const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.get('/convert', (req, res) => {
    const tsUrl = req.query.ts; // Get the .ts URL from the query string
    if (!tsUrl) {
        return res.status(400).send('No .ts URL provided.');
    }

    const outputM3U8 = 'output.m3u8';
    const command = `ffmpeg -i ${tsUrl} -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${outputM3U8}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Error converting .ts to .m3u8');
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send('Error during conversion');
        }

        res.sendFile(outputM3U8, { root: __dirname }); // Send the generated .m3u8 file
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
