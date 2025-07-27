import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { NoteService } from './note.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NoteController {
  constructor(private readonly notesService: NoteService) {}

  @Get(':candidateId')
  async getNotes(@Param('candidateId') candidateId: string) {
    return this.notesService.getNotesByCandidate(candidateId)
  }
}
