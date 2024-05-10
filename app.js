const http = require("http");
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    fs.readFile("message.txt", { encoding: "utf-8" }, (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write('<html>');
      res.write('<head><title>Enter Message</title></head>');
      res.write(`<body>${data}</body>`);
      res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>');
      res.write('</html>');
      res.end();
    });
  } else if (url === '/message' && method === "POST") {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedBody = querystring.parse(body);
      const message = parsedBody.message;
      
      fs.writeFile('message.txt', message, (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Internal Server Error');
          return;
        }
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
      });
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

server.listen(3000);
