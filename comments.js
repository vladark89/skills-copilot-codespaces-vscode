// Create web server that can take comments and store them in a file
// and show them in a webpage

// 1. Create a web server
// 2. Create a form that can take comments
// 3. Save the comments in a file
// 4. Show the comments in the webpage

const fs = require('fs');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const pathName = req.url;
    if (pathName === '/' || pathName === '/comments') {
        const form = `
        <form action="/comments" method="POST">
            <input type="text" name="comment" />
            <button type="submit">Submit</button>
        </form>
        `;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(form);
    } else if (pathName === '/comments' && req.method === 'POST') {
        const body = [];
        req.on('data', chunk => {
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const comment = parsedBody.split('=')[1];
            fs.appendFile('comments.txt', comment + '\n', () => {
                res.writeHead(302, {'Location': '/'});
                res.end();
            });
        });
    } else if (pathName === '/all-comments') {
        fs.readFile('comments.txt', 'utf-8', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(3000, 'localhost', () => {
    console.log('Server listening on port 3000');
});