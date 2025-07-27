import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CandidateDocument } from './entities/candidate-document.entity' 
import { Repository } from 'typeorm'

@Injectable()
export class CandidateDocumentsService {
  constructor(
    @InjectRepository(CandidateDocument)
    private readonly docRepo: Repository<CandidateDocument>,
  ) {}

  async upload(file: Express.Multer.File, candidateId: string, userId: string) {
    const doc = this.docRepo.create({
      fileName: file.originalname,
      filePath: file.filename,
      candidateId,
      uploadedByUserId: userId,
    })
    return this.docRepo.save(doc)
  }

  async getDocs(candidateId: string) {
    return this.docRepo.find({
      where: { candidateId },
      order: { uploadedAt: 'DESC' },
    })
  }

  async getById(id: string) {
  return this.docRepo.findOne({ where: { id } })
}

async deleteById(id: string) {
  return this.docRepo.delete(id)
}

}
