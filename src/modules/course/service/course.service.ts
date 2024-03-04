import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../schema/course.schema';
import { Chapter } from 'src/modules/chapter/schema/chapter.schema';
import { Topic } from 'src/modules/topic/schema/topic.schema';
import { Subject } from 'src/modules/subject/schema/subject.schema';
import { Question } from 'src/modules/question/schema/question.schema';
import { Practice } from 'src/modules/practice/schema/practice.schema';
import { PracticeDetails } from 'src/modules/practice/schema/practiceDetails.schema';
import { Discount } from 'src/modules/discounts/discounts.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Topic.name) private topicModel: Model<Topic>,
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
    @InjectModel(Question.name) private queModel: Model<Question>,
    @InjectModel(Practice.name) private practiceModel: Model<Practice>,
    @InjectModel(PracticeDetails.name)
    private practiceDetailsModel: Model<PracticeDetails>,
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().populate('subjects').exec();
  }

  async findAllTrue(): Promise<Course[]> {
    return this.courseModel.find({ isActive: true }).exec();
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id);

    if (!course) {
      throw new Error('Course not found.');
    }

    return course;
  }

  async findAllDetailsByCourseId(id: string): Promise<{}> {
    const course = await this.courseModel.findById(id).exec();

    if (!course) {
      throw new Error('Course Not Found in database');
    }

    const subjects = await this.subjectModel
      .find({ _id: { $in: course.subjects }, isActive: true })
      .exec();

    const result = subjects.map(async (subject) => {
      const chapters = await this.chapterModel
        .find({ subject: subject._id.toString(), isActive: true })
        .exec();
      const subQues = await this.queModel.find({
        subject: subject._id.toString(),
      });
      const chapterData = chapters.map(async (chapter) => {
        const chaptQues = await this.queModel.find({
          chapter: chapter._id.toString(),
        });
        return {
          chapterName: chapter.chapterName,
          chapterNo: chapter.chapterNo,
          _id: chapter._id,
          chaptQues: chaptQues.length,
        };
      });

      return {
        subjectName: subject.subjectName,
        _id: subject._id,
        subQues: subQues.length,
        chapters: await Promise.all(chapterData),
      };
    });

    return await Promise.all(result);
  }

  async findAllCourseDetailsByUserId(queData: {
    userId: string;
    courseId: string;
  }): Promise<any> {
    const course = await this.courseModel.findById(queData.courseId).exec();

    if (!course) {
      throw new Error('Course Not Found in database');
    }

    const subjects = await this.subjectModel
      .find({ _id: { $in: course.subjects }, isActive: true })
      .exec();

    const result = subjects.map(async (subject) => {
      const subQues = await this.queModel.find({
        subject: subject._id.toString(),
      });
      const chapters = await this.chapterModel
        .find({ subject: subject._id.toString(), isActive: true })
        .exec();
      const chapterData = chapters.map(async (chapter) => {
        const practices = await this.practiceModel.find({
          userId: queData.userId,
          isCustom: false,
          chapters: { $elemMatch: { $eq: chapter._id } },
        });
        const practiceIds = practices.map((practice) =>
          practice._id.toString(),
        );

        // Query PracticeDetails model to find attempted questions for this chapter
        const attemptedPracticesDetails = await this.practiceDetailsModel.find({
          userId: queData.userId,
          practiceId: { $in: practiceIds }, // Assumes practice._id is the correct reference
        });

        // Count the number of attempted questions for this chapter
        let attemptedQuestionCount = 0;
        attemptedPracticesDetails.forEach((attempted) => {
          attempted.queArr.forEach((question) => {
            if ((question as any).isAttempted) {
              attemptedQuestionCount++;
            }
          });
        });
        const chaptQues = await this.queModel.find({
          chapter: chapter._id.toString(),
        });
        const topics = await this.topicModel
          .find({ chapter: chapter._id.toString(), isActive: true })
          .exec();

        return {
          chapterName: chapter.chapterName,
          chapterNo: chapter.chapterNo,
          _id: chapter._id,
          attempted: attemptedQuestionCount,
          chaptQue: chaptQues.length,
          topics: topics.map((topic) => ({
            topicName: topic.topicName,
            topicNo: topic.topicNo,
            _id: topic._id,
          })),
        };
      });

      return {
        subjectName: subject.subjectName,
        _id: subject._id,
        subQue: subQues.length,
        chapters: await Promise.all(chapterData),
      };
    });

    return await Promise.all(result);
  }
  async create(courseData: Course): Promise<Course> {
    const createdCourse = new this.courseModel(courseData);
    return createdCourse.save();
  }

  async update(id: string, courseData: Course): Promise<Course> {
    return this.courseModel
      .findByIdAndUpdate(id, courseData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    // Find and delete the course
    const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();

    if (!deletedCourse) {
      // If the course doesn't exist, return false
      return false;
    }
    //@ts-ignore
    const courseIdString = deletedCourse._id.toString();

    await this.subjectModel.deleteMany({ course: courseIdString }).exec();
    await this.chapterModel.deleteMany({ course: courseIdString }).exec();
    await this.topicModel.deleteMany({ course: courseIdString }).exec();

    return true;
  }

  async purchaseCourse(
    courseId: string,
    userId: string,
    discountCode?: string,
  ): Promise<any> {
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    let finalPrice = course.price;

    if (discountCode) {
      const discount = await this.discountModel.findOne({ code: discountCode });
      if (discount && this.isDiscountValid(discount)) {
        finalPrice = this.calculateDiscountedPrice(
          course.price,
          discount.percent,
          discount.maxAmount,
          discount.flatAmount,
        );

        // Increment redemption count and save
        discount.redemptionCount += 1;
        await discount.save();
      }
    }

    // Logic to handle the payment and course enrollment

    return { courseId, userId, finalPrice };
  }

  private isDiscountValid(discount: Discount): boolean {
    const currentDate = new Date();
    const validFrom = new Date(discount.validFrom);
    const validTo = new Date(discount.validTo);

    const isWithinDateRange =
      currentDate >= validFrom && currentDate <= validTo;
    const isWithinRedemptionLimit =
      discount.redemptionCount < discount.redemptionLimit;

    return isWithinDateRange && isWithinRedemptionLimit;
  }

  // private isDiscountValid(discount: Discount): boolean {
  //   // Check if the discount is valid (e.g., within the valid date range)
  //   const currentDate = new Date();
  //   const validFrom = new Date(discount.validFrom);
  //   const validTo = new Date(discount.validTo);

  //   // Check if the current date is within the valid date range of the discount
  //   return currentDate >= validFrom && currentDate <= validTo;
  // }

  // private calculateDiscountedPrice(
  //   originalPrice: number,
  //   percent: number,
  //   maxAmount: number,
  // ): number {
  //   let discountAmount = (originalPrice * percent) / 100;
  //   discountAmount = Math.min(discountAmount, maxAmount);
  //   return originalPrice - discountAmount;
  // }

  private calculateDiscountedPrice(
    originalPrice: number,
    percent: number,
    maxAmount: number,
    flatAmount?: number, // Optional flat discount amount
  ): number {
    // If a flat discount is provided and it is not zero, apply it directly
    if (flatAmount && flatAmount > 0) {
      return Math.max(originalPrice - flatAmount, 0); // Ensure the discounted price doesn't go below 0
    }

    // If no flat discount, apply percentage discount
    let discountAmount = (originalPrice * percent) / 100;
    discountAmount = Math.min(discountAmount, maxAmount);
    return Math.max(originalPrice - discountAmount, 0); // Ensure the discounted price doesn't go below 0
  }
}
