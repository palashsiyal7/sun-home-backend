import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter } from '../schema/chapter.schema';
import { CreateChapterDto } from '../dto/create-chapter.dto';
import { UpdateChapterDto } from '../dto/update-chapter.dto';
import { Subject } from 'src/modules/subject/schema/subject.schema';
import { Topic } from 'src/modules/topic/schema/topic.schema';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Topic.name) private topicModel: Model<Topic>,
  ) {}

  async findAll(): Promise<Chapter[]> {
    return this.chapterModel.find().populate('subject').populate('course');
  }

  async findById(id: string): Promise<Chapter> {
    const chapter = await this.chapterModel.findById(id).exec();

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    return chapter;
  }

  async getByChapterNo(
    chapterNo: number,
    chapterName: string,
    subjectId: string,
  ): Promise<Chapter | null> {
    // Use Mongoose findOne to find a chapter by chapterNo
    const existingChapter = await this.chapterModel
      .findOne({
        chapterNo: chapterNo,
        chapterName: chapterName,
        subject: subjectId,
      })
      .exec();
    return existingChapter;
  }

  async create(chapterData: CreateChapterDto): Promise<Chapter> {
    const createdChapter = new this.chapterModel(chapterData);
    return createdChapter.save();
  }

  async update(id: string, chapterData: UpdateChapterDto): Promise<Chapter> {
    const updatedChapter = await this.chapterModel
      .findByIdAndUpdate(id, chapterData, { new: true })
      .exec();
    // // If the subject is set to isActive:false, update related topics and chapters
    // if (chapterData.isActive === false) {
    //   // Update related topics
    //   await this.topicModel.updateMany(
    //     { chapter: updatedChapter._id.toString() },
    //     { isActive: false },
    //   );
    // }

    // if (chapterData.isActive === true) {
    //   // Update related topics
    //   await this.topicModel.updateMany(
    //     { chapter: updatedChapter._id.toString() },
    //     { isActive: true },
    //   );
    // }
    return updatedChapter;
  }

  async delete(id: string): Promise<boolean> {
    // Find and delete the chapter
    const deletedChapter = await this.chapterModel.findByIdAndDelete(id).exec();

    if (!deletedChapter) {
      // If the chapter doesn't exist, return false
      return false;
    }
    //@ts-ignore
    const chapterIdString = deletedChapter._id.toString();

    await this.topicModel.deleteMany({ chapter: chapterIdString }).exec();

    return true;
  }

  async getAllTopic(id: string): Promise<Topic[]> {
    const topics = await this.topicModel.find({
      chapter: id
    })
    return topics
  }

}
