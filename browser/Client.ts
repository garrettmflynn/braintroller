import * as keys from './keys'
import { getOS } from './os'

type StatusType = 'connecting' | 'connected' | 'disconnecting' | 'disconnected'
  
const os = getOS()
const otherOSs = Object.entries(keys.supported).filter(([key, value]) => key !== os && value).map(([key]) => key)
let validKeys = keys.supported[os] ? [...keys.allKeys, ...(keys.only[os] ?? [])].filter(key => !keys.exclude[os]?.includes(key) && !otherOSs.find(os => keys.only[os]?.includes(key))) : []

export class Client {

    status: StatusType = 'disconnected'
    ws: WebSocket
    validMessages: string[] = validKeys
    #queue: string[] = []

    host: string
    port: number | string

    // WebSocket events
    #onmessage: WebSocket['onmessage']
    get onmessage() { return this.#onmessage }
    set onmessage(f: WebSocket['onmessage']) {  this.#onmessage = f }

    #onopen: WebSocket['onopen']
    get onopen() { return this.#onopen }
    set onopen(f: WebSocket['onopen']) {  this.#onopen = f }

    #onclose: WebSocket['onclose']
    get onclose() { return this.#onclose }
    set onclose(f: WebSocket['onclose']) { this.#onclose = f }

    constructor(host: string = 'localhost', port: number = 8765) {
        this.host = host
        this.port = port
    }

    connect = (host = this.host, port = this.port) => {
        if (this.status === 'disconnected') {
            this.host = host
            this.port = port

            const usUrl = `ws://${host}:${port}`
            console.warn(`Trying to connect to ${usUrl}`)
            const ws = new WebSocket(usUrl);
            this.status = 'connecting'

            ws.onmessage = (ev) => (this.onmessage) ? this.onmessage.call(this.ws, ev) : undefined
            
            ws.addEventListener('open', (ev) => {
                this.ws = ws
                console.warn(`Connected to ${usUrl}`)
                this.status = 'connected'
                this.#queue.forEach(message => this.send(message))
                this.#queue = []
                if (this.onopen) this.onopen.call(this.ws, ev)
            })

            ws.addEventListener('close', (ev) => {
                console.warn(`Disconnected from ${usUrl}`)
                this.status = 'disconnected'
                if (this.onclose) this.onclose.call(this.ws, ev)
            })

            // Close the connection if it takes too long to connect
            setTimeout(() => {
                if (this.status === 'connecting') ws.close()
            }, 2000)
        }
    }

    disconnect = () => {
        if (this.status === 'connected') {
            this.status = 'disconnecting'
            this.ws.close()
        }
    }

    send = (message) => {
        if (this.status === 'connected') {
            if (!validKeys.includes(message)) {

                // Basic key transformations
                if (message === ' ') message = 'space'
                if (message === 'Enter') message = 'enter'
                if (message === 'ArrowUp') message = 'up'
                if (message === 'ArrowDown') message = 'down'
                if (message === 'ArrowLeft') message = 'left'
                if (message === 'ArrowRight') message = 'right'

                if (!validKeys.includes(message)) {
                    console.warn(`${message} is not a valid key for ${os}`)
                    return
                }
            }

            if (typeof message === 'object') message = JSON.stringify(message)
            this.ws.send(message)
        } else if (this.status === 'connecting') this.#queue.push(message)
    }
}