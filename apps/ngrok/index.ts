/**import http from 'http';
import ngrok from '@ngrok/ngrok';

// Create webserver
http.createServer((_, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end('Congrats you have created an ngrok web server');
}).listen(3001, () => console.log('Bun web server at 3001 is running...'));

// Get your endpoint online
(async function () {
  const listener = await ngrok.connect({
    domain: "immensely-communal-hermit.ngrok-free.app",
    addr: 8080,
    authtoken: '2t8YJKE1IUFDcaLteIL1TEN6EtW_6LXF9eesM7hdR6LdeqHrW',
    forwards_to: "http://localhost:3000"
  });
  
  console.log(`Ingress established at: ${listener.url()}`);
 })();**/
import ngrok from '@ngrok/ngrok'

  // Establish connectivity
  const listener = await ngrok.forward({
    addr: 3000,
    authtoken: '2t8YJKE1IUFDcaLteIL1TEN6EtW_6LXF9eesM7hdR6LdeqHrW',
    domain: 'immensely-communal-hermit.ngrok-free.app',
    forwards_to: 'http://localhost:3000/channels'
  })
  listener.forward('http://localhost:3000/api/webhooks')
  // Output ngrok url to console
  console.log(`Ingress established at: ${listener.url()}`)

process.stdin.resume()
