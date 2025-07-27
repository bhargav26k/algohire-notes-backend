import { Module } from '@nestjs/common'
import { CandidateDocumentsController } from './candidate-documents.controller'
import { CandidateDocumentsService } from './candidate-documents.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CandidateDocument } from './entities/candidate-document.entity' 

@Module({
  imports: [TypeOrmModule.forFeature([CandidateDocument])],
  controllers: [CandidateDocumentsController],
  providers: [CandidateDocumentsService],
})
export class CandidateDocumentsModule {}
