import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { CandidateDocumentsService } from './candidate-documents.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { unlink } from 'fs/promises'

@Controller('candidate-documents')
@UseGuards(JwtAuthGuard)
export class CandidateDocumentsController {
  constructor(private readonly service: CandidateDocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
          const ext = extname(file.originalname)
          cb(null, `${file.fieldname}-${unique}${ext}`)
        },
      }),
      fileFilter: (req, file, cb) => {
  if (!file.originalname.match(/\.(pdf|docx?|jpe?g|png)$/i)) {
    return cb(new Error('Only PDF, DOC, JPG, PNG allowed'), false)
  }
  cb(null, true)
},
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('candidateId') candidateId: string,
    @Request() req,
  ) {
    return this.service.upload(file, candidateId, req.user.sub)
  }

  @Get(':candidateId')
  async getAll(@Param('candidateId') candidateId: string) {
    return this.service.getDocs(candidateId)
  }

  @Delete(':id')
async deleteDoc(@Param('id') id: string) {
  const doc = await this.service.getById(id)
  if (!doc) throw new NotFoundException('Document not found')

  const filePath = join(__dirname, '../../uploads', doc.filePath)
  try {
    await unlink(filePath)
  } catch (err) {
    console.warn('File already deleted or missing:', err.message)
  }

  await this.service.deleteById(id)
  return { message: 'Deleted successfully' }
}

}
