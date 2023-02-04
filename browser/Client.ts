import * as keys from './keys'
import { getOS } from './os'

type StatusType = 'connecting' | 'connected' | 'disconnecting' | 'disconnected'
  
const os = getOS()
let validKeys = keys.supported[os] ? [...keys.allKeys, ...(keys.only[os] ?? [])].filter(key => !keys.exclude[os]?.includes(key)) : []

export class Client {

    status: StatusType = 'disconnected'
    ws: WebSocket
    validMessages: string[] = validKeys
    #queue: string[] = []

    #onmessage: WebSocket['onmessage']
    #onopen: WebSocket['onopen']

    host: string
    port: number | string

    get onmessage() {
        return this.#onmessage
    }

    set onmessage(f: WebSocket['onmessage']) {
        this.#onmessage = f
    }

    get onopen() {
        return this.#onopen
    }

    set onopen(f: WebSocket['onopen']) {
        this.#onopen = f
    }

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

            ws.onmessage = (ev) => {
                if (this.onmessage) this.onmessage.call(this.ws, ev)
            }

            // ws.onerror = (ev) => console.error(ev)
            
            ws.addEventListener('open', (ev) => {
                this.ws = ws
                console.warn(`Connected to ${usUrl}`)
                this.status = 'connected'
                this.#queue.forEach(message => this.send(message))
                this.#queue = []
                if (this.onopen) this.onopen.call(this.ws, ev)
            })

            ws.addEventListener('close', (ev) => {
                this.status = 'disconnected'
            })

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
                console.warn(`${message} is not a valid key for ${os}`)
                return
            }

            if (typeof message === 'object') message = JSON.stringify(message)
            this.ws.send(message)
        } else this.#queue.push(message)
    }
}