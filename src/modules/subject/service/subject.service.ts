import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject } from '../schema/subject.schema';
import { Topic } from 'src/modules/topic/schema/topic.schema';
import { Chapter } from 'src/modules/chapter/schema/chapter.schema';
import { Question } from 'src/modules/question/schema/question.schema';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
    @InjectModel(Topic.name) private topicModel: Model<Topic>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Question.name) private queModel: Model<Question>,
  ) {}

  async findAll(): Promise<Subject[]> {
    const subjects = await this.subjectModel.find();
    return subjects;
  }

  async findAllDetails(): Promise<any> {
    const subjects = await this.subjectModel.find().exec();
    const result = subjects.map(async (subject) => {
      const chapters = await this.chapterModel
        .find({ subject: subject._id.toString() })
        .exec();
      const subQue = await this.queModel.find({
        subject: subject._id.toString(),
      });
      const chapterData = chapters.map(async (chapter) => {
        const topics = await this.topicModel
          .find({ chapter: chapter._id.toString() })
          .exec();
        const chaptQue = await this.queModel.find({
          chapter: chapter._id.toString(),
        });
        const topicData = topics.map(async (topic) => {
          const topicQue = await this.queModel.find({
            topic: topic._id.toString(),
          });
          return {
            topicName: topic.topicName,
            _id: topic._id,
            isActive: topic.isActive,
            topicNo:topic.topicNo,
            noOfQue: topicQue.length,
          };
        });
        return {
          chapterName: chapter.chapterName,
          _id: chapter._id,
          isActive: chapter.isActive,
          chapterNo:chapter.chapterNo,
          noOfQue: chaptQue.length,
          topics: await Promise.all(topicData),
        };
      });

      return {
        subjectName: subject.subjectName,
        _id: subject._id,
        isActive: subject.isActive,
        noOfQue: subQue.length,
        chapters: await Promise.all(chapterData),
      };
    });

    return await Promise.all(result);
  }

  async findAllTrue(): Promise<Subject[]> {
    const subjects = await this.subjectModel.find({ isActive: true });
    return subjects;
  }

  async findById(id: string): Promise<Subject> {
    const subject = await this.subjectModel.findById(id).exec();
    if (!subject) {
      throw new Error('Subject not found');
    }
    return subject;
  }

  async create(subjectData): Promise<Subject> {
    const createdSubject = new this.subjectModel(subjectData);
    return createdSubject.save();
  }

  async update(id: string, subjectData): Promise<Subject> {
    const updatedSubject = await this.subjectModel
      .findByIdAndUpdate(id, subjectData, { new: true })
      .exec();

    // // If the subject is set to isActive:false, update related topics and chapters
    // if (subjectData.isActive === false) {
    //   // Update related chapters
    //   await this.chapterModel.updateMany(
    //     { subject: updatedSubject._id.toString() },
    //     { isActive: false },
    //   );

    //   // Update related topics
    //   await this.topicModel.updateMany(
    //     { subject: updatedSubject._id.toString() },
    //     { isActive: false },
    //   );
    // }

    // if (subjectData.isActive === true) {
    //   // Update related chapters
    //   await this.chapterModel.updateMany(
    //     { subject: updatedSubject._id.toString() },
    //     { isActive: true },
    //   );

    //   // Update related topics
    //   await this.topicModel.updateMany(
    //     { subject: updatedSubject._id.toString() },
    //     { isActive: true },
    //   );
    // }

    return updatedSubject;
  }

  async delete(id: string): Promise<boolean> {
    // Find and delete the subject
    const deletedSubject = await this.subjectModel.findByIdAndDelete(id).exec();

    if (!deletedSubject) {
      // If the subject doesn't exist, return false
      return false;
    }

    //@ts-ignore
    const subjectIdString = deletedSubject._id.toString();

    await this.chapterModel.deleteMany({ subject: subjectIdString }).exec();
    await this.topicModel.deleteMany({ subject: subjectIdString }).exec();
    await this.queModel.deleteMany({ subject: subjectIdString }).exec()

    return true;
  }

  async getAllChapters(id: string): Promise<Chapter[]> {
    const chapters = await this.chapterModel.find({
      subject: id
    })
    return chapters
  }
}
