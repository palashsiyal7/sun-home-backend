import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from '../schema/question.schema';
import { CreateQueDto } from '../dto/create-que.dto';
import { Model, Types } from 'mongoose';
import { Topic } from 'src/modules/topic/schema/topic.schema';
import { Practice } from 'src/modules/practice/schema/practice.schema';
import { Chapter } from 'src/modules/chapter/schema/chapter.schema';
import { User } from 'src/modules/user/schema/user.schema';
import { PracticeDetails } from 'src/modules/practice/schema/practiceDetails.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private queModel: Model<Question>,
    @InjectModel(Chapter.name) private chaptModel: Model<Chapter>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Topic.name) private topicModel: Model<Topic>,
    @InjectModel(Practice.name) private practiceModel: Model<Practice>,
    @InjectModel(PracticeDetails.name)
    private practiceDetailsModel: Model<PracticeDetails>,
  ) {}

  async findAll(): Promise<Question[]> {
    return this.queModel.find().exec();
  }

  async findById(id: string): Promise<Question> {
    const question = await this.queModel.findById(id);
    if (!question) {
      throw new Error('Question not found.');
    }
    return question;
  }

  async findQueByFileId(id: string): Promise<Question[]> {
    const question = await this.queModel.find({ file: id });
    if (!question) {
      throw new Error('Question not found.');
    }
    return question;
  }

  async findQueBySubjectId(id: string): Promise<Question[]> {
    const question = await this.queModel.find({ subject: id });
    if (!question) {
      throw new Error('Question not found.');
    }
    return question;
  }
  async findQueByChapterId(id: string): Promise<Question[]> {
    const question = await this.queModel.find({ chapter: id });
    if (!question) {
      throw new Error('Question not found.');
    }
    return question;
  }

  async findQueByTopicId(id: string): Promise<Question[]> {
    const question = await this.queModel.find({ topic: id });
    if (!question) {
      throw new Error('Question not found.');
    }
    return question;
  }

  async findRandomQueByChapterId(queData: {
    userId: string;
    chapterId: string;
  }): Promise<Practice> {
    if (!queData.userId || !queData.chapterId) {
      throw new Error('userId and chapterId are required fields');
    }
    const chapter = await this.chaptModel.findById(queData.chapterId);
    const user = await this.userModel.findById(queData.userId);
    if (!chapter) {
      throw new Error('Chapter Not Found');
    }
    if (!user) {
      throw new Error('User Not Found');
    }
    const allQuestions = await this.queModel.find({
      chapter: queData.chapterId,
    });
    const allQuestionIds: Types.ObjectId[] = allQuestions.map((question: any) =>
      question._id.toString(),
    );
    const totalQuestions = 6;

    const practices = await this.practiceModel.find({
      userId: queData.userId,
      isCustom: false,
      chapters: { $elemMatch: { $eq: chapter._id } },
    });
    const practiceIds = practices.map((practice) => practice._id.toString());
    // Query PracticeDetails model to find attempted questions for this chapter
    const attemptedPracticesDetails = await this.practiceDetailsModel.find({
      userId: queData.userId,
      practiceId: { $in: practiceIds }, // Assumes practice._id is the correct reference
    });
    // 1st array: attemptedQuestions containing all the isAttempted true question's Id
    const attemptedQuestions = attemptedPracticesDetails.flatMap((detail) =>
      // detail.queArr
      (detail.queArr as any[])
        .filter((question) => question.isAttempted)
        .map((question) => question.qId),
    );
    // Finding unattempted questions
    const unattemptedQuestions = allQuestionIds.filter(
      (question) => !attemptedQuestions.includes(question),
    );

    // 2nd array: falseAttemptedQuestions containing all the isAttempted true and isCorrect true's Ids
    const falseAttemptedQuestions = attemptedPracticesDetails.flatMap(
      (detail) =>
        (detail.queArr as any[])
          .filter((question) => question.isAttempted && !question.isCorrect)
          .map((question) => question.qId),
    );

    // 3rd array: trueAttemptedQuestions containing all the isAttempted true and isCorrect true's Ids
    const trueAttemptedQuestions = attemptedPracticesDetails.flatMap((detail) =>
      (detail.queArr as any[])
        .filter((question) => question.isAttempted && question.isCorrect)
        .map((question) => question.qId),
    );

    // console.log('all Questions', allQuestionIds);
    // console.log('Attempted Questions:', attemptedQuestions);
    // console.log('Unattempted Question IDs:', unattemptedQuestions);
    // console.log('False Attempted Questions:', falseAttemptedQuestions);
    // console.log('true Attempted Questions:', trueAttemptedQuestions);

    // Initialize an array for the final set of questions
    let finalQuestionSet = [];

    // Add false attempted questions
    finalQuestionSet.push(...falseAttemptedQuestions.slice(0, totalQuestions));

    // If more questions are needed, add unattempted questions
    if (finalQuestionSet.length < totalQuestions) {
      const remainingSlots = totalQuestions - finalQuestionSet.length;
      finalQuestionSet.push(...unattemptedQuestions.slice(0, remainingSlots));
    }

    // If still more questions are needed, add true attempted questions
    if (finalQuestionSet.length < totalQuestions) {
      const remainingSlots = totalQuestions - finalQuestionSet.length;
      finalQuestionSet.push(...trueAttemptedQuestions.slice(0, remainingSlots));
    }

    // Ensure the final set is not larger than totalQuestions
    finalQuestionSet = finalQuestionSet.slice(0, totalQuestions);
    // console.log('finalQuestionSet', finalQuestionSet);
   
    this.shuffleArray(finalQuestionSet);
    if (!allQuestions) {
      throw new Error('Question not found.');
    }

    let chapters = [];
    chapters.push(queData.chapterId);
    // Now allQuestionIds contains an array of _id values as strings
    const practice = new this.practiceModel({
      userId: queData.userId,
      queArr: finalQuestionSet,
      chapters: chapters,
      isCustom: false, // Assuming this is not a custom practice
    });

    const savedPractice = await practice.save();

    const practiceInfo = await this.practiceModel
      .findById(savedPractice._id)
      .populate('queArr');

    return practiceInfo;
  }

  private shuffleArray = (array: Question[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  async create(queData: CreateQueDto): Promise<Question> {
    const createdQue = new this.queModel(queData);
    return createdQue.save();
  }

  // async customPratice(queData: {
  //   chapters: string[];
  //   level: string;
  //   noOfQue: number;
  //   timing: string;
  // }): Promise<Question[]> {
  //   const { chapters } = queData;
  //   const { level } = queData;
  //   const { noOfQue } = queData;
  //   const chapterObjectIds = chapters.map((chapterId) => {
  //     return chapterId;
  //   });
  //   // const topics = await this.topicModel.find({
  //   //   isActive: true,
  //   //   chapter: { $in: chapterObjectIds },
  //   // });
  //   // // Extract topic IDs from the obtained topics
  //   // const topicIds = topics.map((topic) => topic._id.toString());
  //   // Find questions with matching topic IDs
  //   const allQuestions = await this.queModel.find({
  //     chapter: { $in: chapterObjectIds },
  //   });
  //   // // console.log(allQuestions.length,"allque")
  //   // let percentageDistribution = {
  //   //   easy: 0.7, // Adjusted percentages to ensure the sum is 1.0
  //   //   medium: 0.2,
  //   //   hard: 0.1,
  //   // };
  //   // if (level === process.env.QUESTION_LEVEL_EASY) {
  //   //   percentageDistribution = {
  //   //     easy: 0.7,
  //   //     medium: 0.2,
  //   //     hard: 0.1,
  //   //   };
  //   // } else if (level === process.env.QUESTION_LEVEL_MEDIUM) {
  //   //   percentageDistribution = {
  //   //     easy: 0.2,
  //   //     medium: 0.7,
  //   //     hard: 0.1,
  //   //   };
  //   // } else if (level === process.env.QUESTION_LEVEL_HARD) {
  //   //   percentageDistribution = {
  //   //     easy: 0.2,
  //   //     medium: 0.1,
  //   //     hard: 0.7,
  //   //   };
  //   // }

  //   // const distributeQuestions = (questions: Question[], percentage: number) => {
  //   //   const count = Math.round(noOfQue * percentage);
  //   //   // console.log('count ', count);
  //   //   this.shuffleArray(questions);
  //   //   return questions.slice(0, count);
  //   // };

  //   // const easyQuestions = allQuestions.filter(
  //   //   (question) => question.level === process.env.QUESTION_LEVEL_EASY,
  //   // );
  //   // const mediumQuestions = allQuestions.filter(
  //   //   (question) => question.level === process.env.QUESTION_LEVEL_MEDIUM,
  //   // );
  //   // const hardQuestions = allQuestions.filter(
  //   //   (question) => question.level === process.env.QUESTION_LEVEL_HARD,
  //   // );

  //   // const selectedQuestions = [
  //   //   ...distributeQuestions(easyQuestions, percentageDistribution.easy),
  //   //   ...distributeQuestions(mediumQuestions, percentageDistribution.medium),
  //   //   ...distributeQuestions(hardQuestions, percentageDistribution.hard),
  //   // ];

  //   // this.shuffleArray(selectedQuestions);
  //   // // console.log(selectedQuestions.length,"sddwe")
  //   const Questions = [...allQuestions.slice(0, noOfQue)];
  //   if (!allQuestions) {
  //     throw new Error('Question not found.');
  //   }
  //   const allQuestionIds: Types.ObjectId[] = Questions.map((question: any) =>
  //     question._id.toString(),
  //   );
  //   return Questions;
  // }
  async customPratice(queData: {
    userId: string;
    chapters: string[];
    level: string;
    typeOfQue: string[];
    noOfQue: number;
    timing: string;
  }): Promise<Practice> {
    // Validate queData fields
    const requiredFields = [
      'userId',
      'chapters',
      'level',
      'typeOfQue',
      'noOfQue',
      'timing',
    ];
    const missingFields = requiredFields.filter((field) => !queData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing or invalid fields: ${missingFields.join(', ')}`);
    }
    const user = await this.userModel.findById(queData.userId);
    if (!user) {
      throw new Error('User Not Found');
    }
    const { chapters } = queData;
    const { noOfQue } = queData;
    const { typeOfQue } = queData;
    let Questions = [];
    // let allQuestions = [];
    const chapterObjectIds = chapters.map((chapterId) => {
      return chapterId;
    });
    // if (typeOfQue.every((type) => type === 'ALL')) {
    //   allQuestions = await this.queModel.find({
    //     chapter: { $in: chapterObjectIds },
    //   });
    // } else {
    const allQuestions = await this.queModel.find({
      chapter: { $in: chapterObjectIds },
      type: { $in: typeOfQue },
    });
    // }
    if (allQuestions.length < queData.noOfQue) {
      throw new Error(
        'Not enough type of questions are present in selected Chapters',
      );
    }
    const easyQues = allQuestions.filter(
      (q) => q.level === process.env.QUESTION_LEVEL_EASY,
    );
    const hardQues = allQuestions.filter(
      (q) => q.level === process.env.QUESTION_LEVEL_HARD,
    );
    const mediumQues = allQuestions.filter(
      (q) => q.level === process.env.QUESTION_LEVEL_MEDIUM,
    );
    if (queData.level === process.env.QUESTION_LEVEL_EASY) {
      if (easyQues.length >= queData.noOfQue) {
        Questions = [...easyQues.slice(0, noOfQue)];
      } else {
        const remainQue = queData.noOfQue - easyQues.length;
        if (mediumQues.length >= remainQue) {
          Questions = [...easyQues, ...mediumQues.slice(0, noOfQue)];
        } else {
          const remainQue =
            queData.noOfQue - (easyQues.length + mediumQues.length);
          if (hardQues.length >= remainQue) {
            Questions = [
              ...easyQues,
              ...mediumQues,
              ...hardQues.slice(0, noOfQue),
            ];
          } else {
            throw new Error(
              'Not enough questions are present in selected Chapters',
            );
          }
        }
      }
    } else if (queData.level === process.env.QUESTION_LEVEL_MEDIUM) {
      if (mediumQues.length >= queData.noOfQue) {
        Questions = [...mediumQues.slice(0, noOfQue)];
      } else {
        const remainQue = queData.noOfQue - mediumQues.length;
        if (easyQues.length >= remainQue) {
          Questions = [...mediumQues, ...easyQues.slice(0, noOfQue)];
        } else {
          const remainQue =
            queData.noOfQue - (easyQues.length + mediumQues.length);
          if (hardQues.length >= remainQue) {
            Questions = [
              ...easyQues,
              ...mediumQues,
              ...hardQues.slice(0, noOfQue),
            ];
          } else {
            throw new Error(
              'Not enough questions are present in selected Chapters',
            );
          }
        }
      }
    } else if (queData.level === process.env.QUESTION_LEVEL_HARD) {
      if (hardQues.length >= queData.noOfQue) {
        Questions = [...hardQues.slice(0, noOfQue)];
      } else {
        const remainQue = queData.noOfQue - hardQues.length;
        if (easyQues.length >= remainQue) {
          Questions = [...hardQues, ...easyQues.slice(0, noOfQue)];
        } else {
          const remainQue =
            queData.noOfQue - (easyQues.length + hardQues.length);
          if (mediumQues.length >= remainQue) {
            Questions = [
              ...hardQues,
              ...easyQues,
              ...mediumQues.slice(0, noOfQue),
            ];
          } else {
            throw new Error(
              'Not enough questions are present in selected Chapters',
            );
          }
        }
      }
    }
    const allQuestionIds: Types.ObjectId[] = Questions.map((question: any) =>
      question._id.toString(),
    );
    // Now allQuestionIds contains an array of _id values as strings
    const practice = new this.practiceModel({
      userId: queData.userId,
      queArr: allQuestionIds,
      chapters: queData.chapters,
      isCustom: true, // Assuming this is not a custom practice
    });

    const savedPractice = await practice.save();

    const practiceInfo = await this.practiceModel
      .findById(savedPractice._id)
      .populate('queArr');

    return practiceInfo;
  }
}
