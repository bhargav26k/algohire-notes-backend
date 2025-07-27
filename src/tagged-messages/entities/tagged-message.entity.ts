import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Note } from 'src/note/entities/note.entity'
import { User } from 'src/users/entities/user.entity' 

@Entity('tagged_messages')
export class TaggedMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Note)
  @JoinColumn({ name: 'noteId' })
  note: Note

  @Column()
  noteId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'taggedUserId' })
  taggedUser: User

  @Column()
  taggedUserId: string

  @Column({ default: false })
  isRead: boolean

}
