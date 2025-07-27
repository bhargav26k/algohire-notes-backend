import { Controller, Get, UseGuards, Request, HttpException, HttpStatus, Param, Patch } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TaggedMessage } from 'src/tagged-messages/entities/tagged-message.entity'

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @InjectRepository(TaggedMessage)
    private taggedRepo: Repository<TaggedMessage>,
  ) {}

  @Get()
  async getUserNotifications(@Request() req: any) {
    const userId = req.user.sub
    const tagged = await this.taggedRepo.find({
      where: { taggedUserId: userId },
      relations: ['note', 'note.sender', 'note.candidate'],
      order: { note: { createdAt: 'DESC' } },
    })

    return tagged.map((tag) => ({
      noteId: tag.note.id,
      content: tag.note.content,
      sender: tag.note.sender.name,
      candidateId: tag.note.candidate.id,
      candidateName: tag.note.candidate.name,
      createdAt: tag.note.createdAt,
        isRead: tag.isRead, 
    }))
  }

  @Patch(':noteId/read')
async markAsRead(@Param('noteId') noteId: string, @Request() req: any) {
  const userId = req.user.sub
  const tagged = await this.taggedRepo.findOne({
    where: { noteId, taggedUserId: userId },
  })

  if (!tagged) {
    throw new HttpException('Notification not found', HttpStatus.NOT_FOUND)
  }

  if (tagged.isRead) {
    return { message: 'Already read' }
  }

  tagged.isRead = true
  await this.taggedRepo.save(tagged)

  return { message: 'Marked as read' }
}

}
