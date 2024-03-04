import { IsString } from 'class-validator';

export class AnswerQuestionDto {
  @IsString()
  questionId: string;

  @IsString()
  answer: string;
}
