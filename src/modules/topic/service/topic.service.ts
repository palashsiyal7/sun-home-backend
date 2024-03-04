import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic } from '../schema/topic.schema';
import { CreateTopicDto } from '../dto/create-topic';
import { UpdateTopicDto } from '../dto/update-topic';
import { Chapter } from 'src/modules/chapter/schema/chapter.schema';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<Topic>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
  ) {}

  async findAll(): Promise<Topic[]> {
    const allTopics = this.topicModel
      .find()
      .populate('chapter')
      .populate('subject')
      // .populate('course');
    return allTopics;
  }

  async findById(id: string): Promise<Topic> {
    const topic = await this.topicModel.findById(id).populate('subject').populate('chapter').exec();

    if (!topic) {
      throw new Error('Topic not found');
    }

    return topic;
  }

  async getTopicByDetails(
    topicNo: number,
    topicName: string,
    chapterId: string,
    subjectId: string,
  ): Promise<Topic> {
    const topic = await this.topicModel.findOne({
      topicName: topicName,
      topicNo: topicNo,
      chapter:chapterId,
      subject:subjectId
    });
    return topic;
  }

  async create(topicData: CreateTopicDto): Promise<Topic> {
    const createdTopic = new this.topicModel(topicData);
    return createdTopic.save();
  }

  async update(id: string, topicData: UpdateTopicDto): Promise<Topic> {
    return this.topicModel
      .findByIdAndUpdate(id, topicData, { new: true })
      .exec();
  }

  async delete(id: string) {
    const deletedTopic = await this.topicModel.findByIdAndDelete(id).exec();

    if (!deletedTopic) {
      throw new Error('Topic not found');
    }

    return deletedTopic;
  }
}
