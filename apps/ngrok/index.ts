import ngrok from '@ngrok/ngrok'
import { Elysia } from 'elysia'

// Establish connectivity
const listener = await ngrok.forward({
  addr: 9999,
  authtoken: '2t8YJKE1IUFDcaLteIL1TEN6EtW_6LXF9eesM7hdR6LdeqHrW'
})
// Output ngrok url to console
console.log(`Ingress established at: ${listener.url()}`)

const app = new Elysia()
              .all('/', () => {
                return 'bambambam'
              })
              .listen(1000)