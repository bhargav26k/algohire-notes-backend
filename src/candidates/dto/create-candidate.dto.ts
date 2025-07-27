import { IsEmail, IsString } from 'class-validator'

export class CreateCandidateDto {
  @IsString()
  name: string

  @IsEmail()
  email: string
}
