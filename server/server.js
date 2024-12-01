const express = require('express')
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const next = require("next");
const contentDisposition = require("content-disposition");
const _ytdl = require("@distube/ytdl-core");

const port = 3001

const app = next({dev: true, port});
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(express.json());
    server.use(cors());
    server.use(bodyParser.json());

    server.get("/download", async (req, res) => {
        const {url, format, title} = req.query;

        if (url === undefined || (!_ytdl.validateID(url) && !_ytdl.validateURL(url))) {
            res.status(400).json({success: false, error: 'No valid YouTube Id!'});
        }

        const result = await _ytdl.getInfo(url);

        let formats = result.formats;
        let itag;
        if (format === 'mp3') {
            formats = formats.filter(value => value.container === "mp4" && value.isHLS === false && value.hasAudio === true);
            itag = formats[0]?.itag;
        } else {
            formats = formats.filter(value => value.container === "mp4" && value.isHLS === false && value.hasVideo === true);
            itag = formats[0]?.itag;
        }

        res.setHeader('Content-Disposition', contentDisposition(`${title}.${format}`));
        _ytdl(url, {quality: itag}).pipe(res);
    });

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        console.log(`Express server listen port:${port}`);
        console.log(`http://localhost:${port}`);
    });
});

module.exports = app;
