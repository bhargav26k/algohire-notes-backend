import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { User } from 'src/users/entities/user.entity' 
import { Candidate } from 'src/candidates/entities/candidate.entity' 

@Entity('candidate_documents')
export class CandidateDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  fileName: string

  @Column()
  filePath: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedByUserId' })
  uploadedBy: User

  @Column()
  uploadedByUserId: string

  @ManyToOne(() => Candidate)
  @JoinColumn({ name: 'candidateId' })
  candidate: Candidate

  @Column()
  candidateId: string

  @CreateDateColumn()
  uploadedAt: Date
}
