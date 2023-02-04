// grab IP address on the local network
export let localIP = 'localhost'

import { networkInterfaces } from 'os'
try {

const nets = networkInterfaces();
const results = {}

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
  }
  const res = (results["en0"] ?? results["Wi-Fi"])?.[0]
  if (res) localIP = res
  else console.error('Could not get local IP address')

  console.log('IP Detected', localIP)

} catch (e) {
    console.log('Error', e)
}
    