export class CreateQueDto {
  question: string;
  options: string[]; // Update the type to allow an array of strings
  correctAns: string;
  solution: string;
  type: string;
  topic: string;
  subject: string;
  chapter: string;
  file: string;
  avgTime:string;
  attempts: number;
  correctAttempts: number;
  gotRight: string;
  level:string
}
