import type { Event, IpcEvent } from './types'

export type IpcAuthComplete = Event<'MAIN->CLIENT::auth-complete', {
  poesessid: string
}>

export type IpcRequestAuth = Event<'CLIENT->MAIN::request-auth'>

// Add these types to the IpcEvent union in types.ts
export type AuthEvents = IpcAuthComplete | IpcRequestAuth 