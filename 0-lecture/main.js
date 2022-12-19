'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

const SERVER_PORT = 8000;

const STATIC_PATH = path.join(process.cwd(), './static');

const toBool = [() => true, () => false];

const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml'
};

const prepareFile = async url => {
    const paths = [STATIC_PATH, url];
    if (url.endsWith('/')) paths.push('index.html');
    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises.access(filePath).then(...toBool);
    const found = !pathTraversal && exists;
    const streamPath = found ? filePath : path.join(STATIC_PATH, './404.html');
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
}

const serveRequest = async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? '200' : '404';
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { 'Content-Type': mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
};

http.createServer(serveRequest).listen(SERVER_PORT);

console.log(`server running on http://127.0.0.1:${SERVER_PORT}/`);
