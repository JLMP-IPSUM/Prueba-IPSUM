const { createServer } = require('node:http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
    let filePath = __dirname + '/public/index.html';

    switch(req.url) {
        case '/login':
            filePath = __dirname + '/public/login.html';
            break;
        case '/user':
            filePath = __dirname + '/public/user.html';
            break;
        case '/admin':
            filePath = __dirname + '/public/admin.html';
            break;
        default:
            filePath = __dirname + '/public/index.html';
            break;
    }

    fs.readFile(filePath, (err, data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data, 'utf8');
    });

  
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
