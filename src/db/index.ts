import Dexie, { type Table } from 'dexie'
import type { SerializedChat } from '../utils/serialization'

export class ChatDatabase extends Dexie {
  chats!: Table<SerializedChat>

  constructor() {
    super('ChatDatabase')
    this.version(1).stores({
      chats: 'id, createdAt'
    })
  }
}

export const db = new ChatDatabase()