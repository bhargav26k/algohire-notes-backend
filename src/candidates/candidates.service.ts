import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Candidate } from './entities/candidate.entity'
import { CreateCandidateDto } from './dto/create-candidate.dto' 

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
  ) {}

  async findAll(): Promise<Candidate[]> {
    return this.candidateRepo.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: string): Promise<Candidate> {
  const candidate = await this.candidateRepo.findOne({ where: { id } })
  if (!candidate) throw new NotFoundException('Candidate not found')
  return candidate
}


  async create(dto: Partial<Candidate>): Promise<Candidate> {
    const candidate = this.candidateRepo.create(dto)
    return this.candidateRepo.save(candidate)
  }
}
