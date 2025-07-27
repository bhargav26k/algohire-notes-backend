import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { NoteService } from './note.service'
import { User } from 'src/users/entities/user.entity' 
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Note } from './entities/note.entity'
import { TaggedMessage } from '../tagged-messages/entities/tagged-message.entity'

@WebSocketGateway({ cors: { origin: '*' } })
export class NotesGateway implements OnGatewayConnection, OnGatewayInit {
  private server: Server

  constructor(
    private notesService: NoteService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(TaggedMessage)
    private readonly taggedRepo: Repository<TaggedMessage>,
  ) {}

afterInit(server: Server) {
    this.server = server
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId)
    console.log(`Client ${client.id} joined room ${roomId}`)
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    payload: { candidateId: string; content: string; senderId: string },
  ) {
    try {
      const savedNote: Note = await this.notesService.create(payload)
      const noteWithSender = await this.notesService.getNoteWithSender(savedNote.id)
if (!noteWithSender) {
      console.warn('Note not found after saving:', savedNote.id)
      return
    }

      // Emit message to candidate room
      this.server.to(payload.candidateId).emit('messageSent', noteWithSender)

    // 3) Extract @username tags
    const tagMatches = payload.content.match(/@([a-zA-Z0-9_]+)/g) || []

          for (const tag of tagMatches) {
      const username = tag.slice(1)               // remove '@'
      if (!username || username === noteWithSender.sender.username) continue

      const user = await this.userRepo.findOne({
        where: { username },
      })
      if (!user) continue

      // 4) Save tagged message record
      const tagged = this.taggedRepo.create({
        noteId: savedNote.id,
        taggedUserId: user.id,
      })
      await this.taggedRepo.save(tagged)

      // 5) Real-time notify to that user's socket room
      this.server.to(user.id).emit('notify', {
        noteId: savedNote.id,
        candidateId: savedNote.candidateId,
        content: savedNote.content,
      })
    }

    } catch (error) {
      console.error('Error in handleSendMessage:', error)
    }
  }
}
