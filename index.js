const fs = require('fs');
const https = require('https');
const http2 = require('http2');
let server = http2.createServer();
let secure_server = http2.createSecureServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
});
let secure_https_server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
});
server.on('stream', on_stream);
secure_server.on('stream', on_stream);
function on_stream(stream, headers){
    console.log('headers', headers);
    console.log('settings', stream.session.remoteSettings);
    console.log('-----------------------------------------------------');
    stream.respond({':status': 200, 'content-type': 'text/html', 'set-cookie': 'a=1', 'cache-control': 'max-age=30'}) 
    let h = JSON.stringify(headers, null, 2);
    stream.write(`<!DOCTYPE html><html><body><pre>${h}</pre><a href="/foo">link</a></body></html>`);
    stream.end();
}
secure_https_server.on('secureConnection', socket=>{
   socket.on('data', d=>console.log(''+d));
});
secure_https_server.on('request', (req, res)=>{
   console.log(req.rawHeaders);
   res.writeHead(200, {'set-cookie': 'a=1'});
   let h = JSON.stringify(req.headers, null, 2);
   res.write(`<!DOCTYPE html><html><body><pre>${h}</pre><a href="/foo">link</a></body></html>`);
   res.end();
});
let port = process.env.PORT||80
let secure_port = process.env.SECURE_PORT||443;
server.listen(port, ()=>console.log(`http listening on :${port}`));
if (1)
{
	secure_server.listen(secure_port,
	    ()=>console.log(`http2 secure listening on :${secure_port}`));
}
else
{
	secure_https_server.listen(secure_port,
	    ()=>console.log(`https listening on :${secure_port}`));
}

