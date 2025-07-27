import { Body, Controller, Get, Post, UseGuards, Request, Param } from '@nestjs/common'
import { CandidatesService } from './candidates.service'
import { CreateCandidateDto } from './dto/create-candidate.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('candidates')
@UseGuards(JwtAuthGuard)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get()
  findAll() {
    return this.candidatesService.findAll()
  }

  @Get(':id')
findOne(@Param('id') id: string) {
  return this.candidatesService.findOne(id)
}


  @Post()
  create(@Body() dto: CreateCandidateDto, @Request() req: any) {
    return this.candidatesService.create({
      ...dto,
      createdByUserId: req.user.sub,
    })
  }
}
