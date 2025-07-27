import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NotesGateway } from './notes.gateway';
import { JwtModule } from '@nestjs/jwt';
import { TaggedMessage } from 'src/tagged-messages/entities/tagged-message.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Note, TaggedMessage, User]), JwtModule],
  controllers: [NoteController],
  providers: [NoteService, NotesGateway],
})
export class NoteModule {}
