import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CandidatesModule } from './candidates/candidates.module';
import { NoteModule } from './note/note.module';
import { TaggedMessagesModule } from './tagged-messages/tagged-messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CandidateDocumentsModule } from './candidate-documents/candidate-documents.module';

@Module({
  imports: [
    // Load .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Connect to PlanetScale (MySQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, 
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    AuthModule,

    UsersModule,

    CandidatesModule,

    NoteModule,

    TaggedMessagesModule,

    NotificationsModule,

    CandidateDocumentsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
