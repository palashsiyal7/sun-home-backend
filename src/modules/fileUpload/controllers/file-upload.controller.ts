import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadService } from '../service/file-upload.service';
import { CreateFileDto } from '../dto/create-file.dto';
import { QuestionService } from 'src/modules/question/service/question.service';
import { Types } from 'mongoose';
import { File } from '../schema/file-upload.schema';
import { SubjectService } from 'src/modules/subject/service/subject.service';
import { TopicService } from 'src/modules/topic/service/topic.service';
import { ChapterService } from 'src/modules/chapter/service/chapter.service';
import { async } from 'rxjs';
const fs = require('fs');
const mammoth = require('mammoth');
// const RtfParser = require('rtf-parser');

@Controller('')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly questionService: QuestionService,
    private readonly chapterService: ChapterService,
    private readonly topicService: TopicService,
  ) {}
  @Get()
  async findAll(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: File[];
  }> {
    const courses = await this.fileUploadService.getAllFiles();
    return {
      success: true,
      status_code: 200,
      message: 'Api called successfully',
      data: courses,
    };
  }

  @Get(':id')
  async getFileByTopicId(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: File[];
  }> {
    const file = await this.fileUploadService.findBySubjectId(id);
    return {
      success: true,
      status_code: 200,
      message: 'File retrieved successfully',
      data: file,
    };
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // destination: '/home/nidhi/Desktop/education-backend/uploads',
        destination: './uploads',
        filename: (req, file, callback) => {
          const originalName = file.originalname;
          return callback(null, originalName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file,
    @Body('subjectId') subject_id: string,
  ) {
    try {
      // Ensure that saveFile returns an instance of File
      const savedFile: File = await this.fileUploadService.saveFile(
        file,
        subject_id,
      );
      // Accessing the _id property
      const fileIdObject: Types.ObjectId = savedFile['_id'];
      const fileId = fileIdObject.toString();
      const subjectId = savedFile.subjectId.toString();
      const rtfFilePath = savedFile.filePath;
      // console.log("subjectId",subjectId)
      fs.readFile(rtfFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }
        mammoth.extractRawText({ path: rtfFilePath }).then(async (result) => {
          // Extracted text
          const text = result.value;
          const fetchName = /^(\d+)\s*:\s*(.+)/;
          const chapter = text.split('Chapter-');
          for (let i = 1; i < chapter.length; i++) {
            // console.log("helo",chapter[i], 'sadsd', i);
            const topicArr = chapter[i].split('Topic-');
            const chapterText = topicArr[0].trim();
            const chaptMatch = chapterText.match(fetchName);
            if (chaptMatch) {
              const chapterNo = parseInt(chaptMatch[1], 10);
              const chapterName = chaptMatch[2];
              let chapterId;
              // // Check if chapter with the same chapterNo exists
              const existingChapter = await this.chapterService.getByChapterNo(
                chapterNo,
                chapterName,
                subjectId,
              );
              if (existingChapter) {
                console.log('dsccxd', existingChapter);
                const chapterIdObject: Types.ObjectId = existingChapter['_id'];
                chapterId = chapterIdObject.toString();
              } else {
                const reqData = {
                  chapterName: chapterName,
                  chapterNo: chapterNo,
                  subject: subjectId,
                  isActive: true,
                };
                const chapter = await this.chapterService.create(reqData);
                const chapterIdObject: Types.ObjectId = chapter['_id'];
                chapterId = chapterIdObject.toString();
              }
              for (let j = 1; j < topicArr.length; j++) {
                const queArr = topicArr[j].split('Q.');
                const topicText = queArr[0].trim();
                const topicMatch = topicText.match(fetchName);
                if (topicMatch) {
                  const topicNo = parseInt(topicMatch[1], 10);
                  const topicName = topicMatch[2];
                  let topicId;
                  const exisitingTopic =
                    await this.topicService.getTopicByDetails(
                      topicNo,
                      topicName,
                      chapterId,
                      subjectId,
                    );
                  if (exisitingTopic) {
                    console.log('dsccxd', existingChapter);
                    const topicIdObject: Types.ObjectId = exisitingTopic['_id'];
                    topicId = topicIdObject.toString();
                  } else {
                    const reqData = {
                      topicName: topicName,
                      topicNo: topicNo,
                      subject: subjectId,
                      chapter: chapterId,
                      isActive: true,
                    };
                    const topic = await this.topicService.create(reqData);
                    const topicIdObject: Types.ObjectId = topic['_id'];
                    topicId = topicIdObject.toString();
                  }
                  // console.log("dsadsad",queArr.length)
                  for (let i = 1; i < queArr.length; i++) {
                    const questionText = queArr[i].trim();

                    // Check if (a) is present
                    if (questionText.includes('(a)')) {
                      const questionParts =
                        questionText.split(/\s+\([a-d]\*?\)/);
                      if (questionParts.length > 0) {
                        //extracting a question by removing any leading numbers and whitespace from the beginning
                        const questionNumberPattern = /^\s*(\d+)\s+/;
                        const question = questionParts[0].replace(
                          questionNumberPattern,
                          '',
                        );

                        //split the text through [
                        const splitSolution = questionParts[4].split(/\[/);

                        //extract Answer from text
                        let ansPattern = /Ans:\s*(.*?)\]/;
                        let ansMatch = ansPattern.exec(splitSolution[1]);
                        if (!ansMatch) {
                          console.log(
                            `Skipping question ${i} as Ans pattern is missing.`,
                          );
                          continue;
                          // throw new Error(
                          //   `In question ${i}: Missing 'Ans' pattern in solution.`,
                          // );
                        }
                        const solPattern = /Sol:(.*?)\]/s;
                        let solMatch = solPattern.exec(splitSolution[2]);
                        if (!solMatch) {
                          console.log(
                            `Skipping question ${i} as Solution pattern is missing.`,
                          );
                          continue;
                          // throw new Error(
                          //   `In question ${i}: Missing 'Sol' pattern in solution.`,
                          // );
                        }

                        //extract type from text
                        const typePattern = /Type:\s*(.*?)\]/;
                        let typeMatch = typePattern.exec(splitSolution[3]);
                        if (!typeMatch) {
                          console.log(
                            `Skipping question ${i} as TYpe pattern is missing.`,
                          );
                          continue;
                          // throw new Error(
                          //   `In question ${i}: Missing 'Type' pattern in solution.`,
                          // );
                        }
                        //extract solution from text
                        //removes extra spaces
                        const modifiedQue = question.trim();
                        const optionA = questionParts[1].trim();
                        const optionB = questionParts[2].trim();
                        const optionC = questionParts[3].trim();
                        const optionD = splitSolution[0].trim();
                        const correctAns = ansMatch[1].trim();
                        const solution = solMatch[1].trim();
                        const type = typeMatch[1].trim();
                        let questions = {
                          question: modifiedQue,
                          options: [optionA, optionB, optionC, optionD],
                          correctAns: correctAns,
                          solution: solution,
                          type: type,
                          subject: subjectId.toString(),
                          chapter: chapterId,
                          topic: topicId,
                          attempts: 0,
                          gotRight: '0%',
                          file: fileId,
                          avgTime:'0 sec',
                          level:'EASY',
                          correctAttempts: 0
                        };
                        this.questionService.create(questions);
                      }
                    } else {
                      // Split using '[' if (a) is not present
                      const questionParts = questionText.split('[');

                      if (questionParts.length > 0) {
                        //extract the question
                        const questionNumberPattern = /^\s*(\d+)\s+/;
                        const question = questionParts[0].replace(
                          questionNumberPattern,
                          '',
                        );

                        //extract Answer from text
                        let ansPattern = /Ans:\s*(.*?)\]/;
                        let ansMatch = ansPattern.exec(questionParts[1]);
                        if (!ansMatch) {
                          console.log(
                            `Skipping question ${i} as Ans pattern is missing.`,
                          );
                          continue;
                          // throw new Error(
                          //   `In question ${i}: Missing 'Ans' pattern in solution.`,
                          // );
                        }

                        //extract solution from text
                        const solPattern = /Sol:(.*?)\]/s;
                        let solMatch = solPattern.exec(questionParts[2]);
                        if (!solMatch) {
                          console.log(
                            `Skipping question ${i} as Solution pattern is missing.`,
                          );
                          continue;
                          // throw new Error(
                          //   `In question ${i}: Missing 'Sol' pattern in solution.`,
                          // );
                        }

                        //extract type from text
                        const typePattern = /Type:\s*(.*?)\]/;
                        let typeMatch = typePattern.exec(questionParts[3]);
                        if (!typeMatch) {
                          throw new Error(
                            `In question ${i}: Missing 'Type' pattern in solution.`,
                          );
                        }
                        //removes extra spaces
                        const modifiedQue = question.trim();
                        const correctAns = ansMatch[1].trim();

                        const solution = solMatch[1].trim();
                        const type = typeMatch[1].trim();
                        let questions = {
                          question: modifiedQue,
                          options: [],
                          correctAns: correctAns,
                          solution: solution,
                          type: type,
                          file: fileId,
                          subject: subjectId.toString(),
                          chapter: chapterId,
                          topic: topicId,
                          attempts: 0,
                          correctAttempts: 0,
                          gotRight: '0%',
                          avgTime:'0 sec',
                          level:'EASY'
                        };
                        // console.log('Questions', questions);
                        this.questionService.create(questions);
                      }
                    }
                  }
                }
              }
            }
          }

          // console.log(chapter)

          // // Split the text into individual questions
          // const questionsArray = text.split('Q.');

          // //with separate options
          // for (let i = 1; i < questionsArray.length; i++) {
          //   const questionText = questionsArray[i].trim();

          //   // Check if (a) is present
          //   if (questionText.includes('(a)')) {
          //     const questionParts = questionText.split(/\s+\([a-d]\*?\)/);
          //     if (questionParts.length > 0) {
          //       //extracting a question by removing any leading numbers and whitespace from the beginning
          //       const questionNumberPattern = /^\s*(\d+)\s+/;
          //       const question = questionParts[0].replace(
          //         questionNumberPattern,
          //         '',
          //       );

          //       //split the text through [
          //       const splitSolution = questionParts[4].split(/\[/);

          //       //extract Answer from text
          //       let ansPattern = /Ans:\s*(.*?)\]/;
          //       let ansMatch = ansPattern.exec(splitSolution[1]);
          //       if (!ansMatch) {
          //         console.log(
          //           `Skipping question ${i} as Ans pattern is missing.`,
          //         );
          //         continue;
          //         // throw new Error(
          //         //   `In question ${i}: Missing 'Ans' pattern in solution.`,
          //         // );
          //       }

          //       //extract level from text
          //       const levelPattern = /Level:\s*(.*?)\]/;
          //       let levelMatch = levelPattern.exec(splitSolution[2]);
          //       if (!levelMatch) {
          //         console.log(
          //           `Skipping question ${i} as Level pattern is missing.`,
          //         );
          //         continue;
          //         // throw new Error(
          //         //   `In question ${i}: Missing 'Level' pattern in solution.`,
          //         // );
          //       }

          //       //extract average time from text
          //       const timePattern = /Avg Time:\s*(.*?)\]/;
          //       let timeMatch = timePattern.exec(splitSolution[3]);
          //       if (!timeMatch) {
          //         console.log(
          //           `Skipping question ${i} as Time pattern is missing.`,
          //         );
          //         continue;
          //         // throw new Error(
          //         //   `In question ${i}: Missing 'Avg Time' pattern in solution.`,
          //         // );
          //       }

          //       //extract solution from text
          //       const solPattern = /Sol:(.*?)\]/s;
          //       let solMatch = solPattern.exec(splitSolution[4]);
          //       if (!solMatch) {
          //         console.log(
          //           `Skipping question ${i} as Solution pattern is missing.`,
          //         );
          //         continue;
          //         // throw new Error(
          //         //   `In question ${i}: Missing 'Sol' pattern in solution.`,
          //         // );
          //       }

          //       //extract type from text
          //       const typePattern = /Type:\s*(.*?)\]/;
          //       let typeMatch = typePattern.exec(splitSolution[5]);
          //       if (!typeMatch) {
          //         console.log(
          //           `Skipping question ${i} as TYpe pattern is missing.`,
          //         );
          //         continue;
          //         // throw new Error(
          //         //   `In question ${i}: Missing 'Type' pattern in solution.`,
          //         // );
          //       }

          //       //removes extra spaces
          //       const modifiedQue = question.trim();
          //       const optionA = questionParts[1].trim();
          //       const optionB = questionParts[2].trim();
          //       const optionC = questionParts[3].trim();
          //       const optionD = splitSolution[0].trim();
          //       const correctAns = ansMatch[1].trim();
          //       const level = levelMatch[1].trim();
          //       const avgTime = timeMatch[1].trim();
          //       const solution = solMatch[1].trim();
          //       const type = typeMatch[1].trim();
          //       let questions = {
          //         question: modifiedQue,
          //         options: [optionA, optionB, optionC, optionD],
          //         correctAns: correctAns,
          //         level: level,
          //         avgTime: avgTime,
          //         solution: solution,
          //         type: type,
          //         subjectId: subjectId.toString(),
          //         fileId: fileId,
          //         attempts: 0,
          //         gotRight: '0 %'
          //       };
          //       console.log("Questions",questions)
          //       // this.questionService.create(questions);
          //     }
          //   } else {
          //     // Split using '[' if (a) is not present
          //     const questionParts = questionText.split('[');

          //     if (questionParts.length > 0) {
          //       //extract the question
          //       const questionNumberPattern = /^\s*(\d+)\s+/;
          //       const question = questionParts[0].replace(
          //         questionNumberPattern,
          //         '',
          //       );

          //       //extract Answer from text
          //       let ansPattern = /Ans:\s*(.*?)\]/;
          //       let ansMatch = ansPattern.exec(questionParts[1]);
          //       if (!ansMatch) {
          //         console.log(
          //           `Skipping question ${i} as Ans pattern is missing.`,
          //         );
          //         continue;
          //         // throw new Error(
          //         //   `In question ${i}: Missing 'Ans' pattern in solution.`,
          //         // );
          //       }

          //       //extract level from text
          //       const levelPattern = /Level:\s*(.*?)\]/;
          //       let levelMatch = levelPattern.exec(questionParts[2]);
          //       if (!levelMatch) {
          //         console.log(
          //           `Skipping question ${i} as Level pattern is missing.`,
          //         );
          //         continue;
          //         // throw new Error(
          //         //   `In question ${i}: Missing 'Level' pattern in solution.`,
          //         // );
          //       }

          //       //extract average time from text
          //       const timePattern = /Avg Time:\s*(.*?)\]/;
          //       let timeMatch = timePattern.exec(questionParts[3]);
          //       if (!timeMatch) {
          //         console.log(
          //           `Skipping question ${i} as Time pattern is missing.`,
          //         );
          //         continue;
          //         // throw new Error(
          //         //   `In question ${i}: Missing 'Avg Time' pattern in solution.`,
          //         // );
          //       }

          //       //extract solution from text
          //       const solPattern = /Sol:(.*?)\]/s;
          //       let solMatch = solPattern.exec(questionParts[4]);
          //       if (!solMatch) {
          //         console.log(
          //           `Skipping question ${i} as Solution pattern is missing.`,
          //         );
          //         continue;
          //         // throw new Error(
          //         //   `In question ${i}: Missing 'Sol' pattern in solution.`,
          //         // );
          //       }

          //       //extract type from text
          //       const typePattern = /Type:\s*(.*?)\]/;
          //       let typeMatch = typePattern.exec(questionParts[5]);
          //       if (!typeMatch) {
          //         throw new Error(
          //           `In question ${i}: Missing 'Type' pattern in solution.`,
          //         );
          //       }
          //       //removes extra spaces
          //       const modifiedQue = question.trim();
          //       const correctAns = ansMatch[1].trim();
          //       const level = levelMatch[1].trim();
          //       const avgTime = timeMatch[1].trim();
          //       const solution = solMatch[1].trim();
          //       const type = typeMatch[1].trim();
          //       let questions = {
          //         question: modifiedQue,
          //         options: [],
          //         correctAns: correctAns,
          //         level: level,
          //         avgTime: avgTime,
          //         solution: solution,
          //         type: type,
          //         subjectId: subjectId.toString(),
          //         fileId: fileId,
          //         attempts: 0,
          //         gotRight: '0 %'
          //       };
          //       console.log("Questions",questions);
          //       // this.questionService.create(questions);
          //     }
          //   }
          // }
        });
        // .catch((err) => {
        //   console.error(err);
        // });
      });
      return { status: 200, message: 'File uploaded successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const deletedFile = await this.fileUploadService.delete(id);
    if (deletedFile) {
      return {
        success: true,
        status_code: 200,
        message: 'File deleted successfully',
      };
    } else {
      return {
        success: false,
        status_code: 400,
        message: 'File not found',
      };
    }
  }
}
