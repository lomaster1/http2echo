const fs = require('fs');
const http2 = require('http2');
let server = http2.createServer();
let secure_server = http2.createSecureServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
});
server.on('stream', on_stream);
secure_server.on('stream', on_stream);
function on_stream(stream, headers){
    console.log('headers', headers)
    stream.respond({':status': 200, 'content-type': 'text/html'});
    let h = JSON.stringify(headers, null, 2);
    stream.write(`<!DOCTYPE html><html><body><pre>${h}</pre></body></html>`);
    stream.end();
}
let port = process.env.PORT||80
let secure_port = process.env.SECURE_PORT||443;
server.listen(port, ()=>console.log(`http listening on :${port}`));
secure_server.listen(secure_port,
    ()=>console.log(`https listening on :${secure_port}`));
