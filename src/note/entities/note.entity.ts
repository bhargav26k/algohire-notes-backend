import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { User } from 'src/users/entities/user.entity' 
import { Candidate } from '../../candidates/entities/candidate.entity'

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  content: string

  @ManyToOne(() => Candidate)
  @JoinColumn({ name: 'candidateId' })
  candidate: Candidate

  @Column()
  candidateId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User

  @Column()
  senderId: string

  @CreateDateColumn()
  createdAt: Date
}
