import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Note } from './entities/note.entity'
import { User } from 'src/users/entities/user.entity';
import { TaggedMessage } from 'src/tagged-messages/entities/tagged-message.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(TaggedMessage)
    private readonly taggedRepo: Repository<TaggedMessage>,
  ) {}

  /**
   * Save a new note to the database
   */
  async create(payload: { candidateId: string; content: string; senderId: string }) {
  const note = this.noteRepo.create(payload)
  const savedNote = await this.noteRepo.save(note)

  // extract @username tags (same regex)
  const tagMatches = payload.content.match(/@([a-zA-Z0-9_]+)/g) || []

  for (const tag of tagMatches) {
    const username = tag.slice(1)
    if (!username) continue
    const user = await this.userRepo.findOne({ where: { username } })
    if (!user || user.id === payload.senderId) continue


    const tagged = this.taggedRepo.create({
      noteId: savedNote.id,
      taggedUserId: user.id,
    })
    await this.taggedRepo.save(tagged)
  }

  return savedNote
}


  /**
   * Fetch all notes for a candidate with sender info
   */
  async getNotesByCandidate(candidateId: string): Promise<Note[]> {
    return this.noteRepo.find({
      where: { candidateId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    })
  }

  async getNoteWithSender(noteId: string) {
  return this.noteRepo.findOne({
    where: { id: noteId },
    relations: ['sender'],
  })
}

}
