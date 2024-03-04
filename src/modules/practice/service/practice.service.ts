import { Injectable } from '@nestjs/common';
import { Practice } from '../schema/practice.schema';
import { PracticeDetails } from '../schema/practiceDetails.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from 'src/modules/question/schema/question.schema';

interface SubjectAnalyticsData {
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  topics: Set<string>;
}

@Injectable()
export class PracticeService {
  constructor(
    @InjectModel(Practice.name) private practiceModel: Model<Practice>,
    @InjectModel(PracticeDetails.name)
    private practiceDetailModel: Model<PracticeDetails>,
    @InjectModel(Question.name) private queModel: Model<Question>,
  ) {}

  async findAnayticsById(id: string): Promise<any[]> {
    const practiceDetail = await this.practiceDetailModel.findById(id);
    if (!practiceDetail) {
      throw new Error('Practice Details not found');
    }
    const practice = await this.practiceModel
      .findById(practiceDetail.practiceId)
      .populate({
        path: 'queArr',
        populate: { path: 'subject' },
      });
    const analytics = [];
    // Initialize variables
    let totalQuestions = 0;
    let allQueTiming = 0;
    let correctQuestions = 0;
    let wrongQuestions = 0;
    let skippedQuestions = 0;
    let correctQueTiming = 0;
    let wrongQueTiming = 0;
    let skippedQueTiming = 0;
    let totalGotRight = 0;
    const subjectData: { [key: string]: SubjectAnalyticsData } = {};

    practiceDetail.queArr.forEach((question: any) => {
      totalQuestions++;
      const timeInSeconds = this.convertTimeToSeconds(question.timeTaken);
      allQueTiming += timeInSeconds;
      if (question.isAttempted) {
        if (question.isCorrect) {
          correctQuestions++;
          correctQueTiming += timeInSeconds;
        } else {
          wrongQuestions++;
          wrongQueTiming += timeInSeconds;
        }
      } else {
        skippedQuestions++;
        skippedQueTiming += timeInSeconds;
      }
    });

    practice.queArr.forEach((question: any) => {
      const detail = practiceDetail.queArr.find(
        (d) => (d as any).qId === question._id.toString(),
      ) as any;
      totalGotRight += parseInt(question.gotRight, 10);
      if (detail) {
        const subjectName = (question as any).subject.subjectName;
        if (!subjectData[subjectName]) {
          subjectData[subjectName] = {
            totalQuestions: 0,
            correctAnswers: 0,
            totalTime: 0,
            topics: new Set(),
          };
        }
        subjectData[subjectName].totalQuestions++;
        subjectData[subjectName].topics.add((question as any).topic);
        subjectData[subjectName].totalTime += this.convertTimeToSeconds(
          detail.timeTaken,
        );
        if (detail.isCorrect) {
          subjectData[subjectName].correctAnswers++;
        }
      }
    });
  
    const globalAccuracy = totalQuestions > 0 ? (totalGotRight / totalQuestions) : 0;
    // console.log(totalGotRight/totalQuestions,"feg")

    for (const [subjectName, data] of Object.entries(subjectData)) {
      const accuracy = (data.correctAnswers / data.totalQuestions) * 100;
      const avgTime = data.totalTime / data.totalQuestions;
      const levelName = this.getLevelName(accuracy);
      analytics.push({
        subjectName,
        LevelName: levelName,
        percentage: `${accuracy.toFixed(2)}%`,
        totalQue: data.totalQuestions,
        concepts: data.topics.size,
        accuracy: `${accuracy.toFixed(2)}%`,
        avgTime: this.formatTime(Math.round(avgTime)),
      });
    }

    const queAnalytics = [
      {
        allQue: totalQuestions,
        allQueTiming: allQueTiming,
        correctQues: correctQuestions,
        correctQueTiming: correctQueTiming,
        wrongQues: wrongQuestions,
        wrongQueTiming: wrongQueTiming,
        skippedQues: skippedQuestions,
        skippedQueTiming: skippedQueTiming,
      },
    ];
    // Update practiceDetail with queAnalytics
    practiceDetail.queAnalytics = queAnalytics;

    // Save the updated practiceDetail
    await practiceDetail.save();

    return [{ globalAccuracy:globalAccuracy, analtyics: analytics }];
    // return analytics
  }

  async findAllDetailsByUserId(id: string): Promise<any[]> {
    const practices = await this.practiceModel.find({ userId: id }).populate({
      path: 'chapters',
      populate: { path: 'subject' },
    });

    const result = await Promise.all(
      practices.map(async (practice) => {
        const practiceDetails = await this.practiceDetailModel.find({
          practiceId: practice._id.toString(),
        });

        const practiceAny = practice as any;
        const createdAt = practiceAny.createdAt;
        const localDate = this.convertToLocaleString(createdAt);
        // Assuming there is always one practiceDetail per practice
        const practiceDetail = (practiceDetails[0] as any) || {};

        return {
          practiceId: practice._id.toString(),
          isCustom: practice.isCustom,
          chapters: practice.chapters,
          createdAt: localDate,
          analytics: practiceDetail.analytics || [],
          queAnalytics: practiceDetail.queAnalytics || [],
        };
      }),
    );

    return result;
  }

  async updateAnalytics(
    practiceDetailId: string,
    analyticsData: any[],
  ): Promise<any> {
    try {
      const updatedPracticeDetail =
        await this.practiceDetailModel.findByIdAndUpdate(
          practiceDetailId,
          { analytics: analyticsData },
          { new: true },
        );

      if (!updatedPracticeDetail) {
        throw new Error('Practice Details not found');
      }

      return updatedPracticeDetail;
    } catch (error) {
      throw new Error(`Failed to update analytics: ${error.message}`);
    }
  }

  private convertTimeToSeconds(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedHours}:${formattedMins}:${formattedSecs}`;
  }

  private getLevelName(accuracy: number): string {
    if (accuracy >= 86 && accuracy <= 100) return 'Superb';
    if (accuracy >= 61 && accuracy <= 85) return 'Satisfactory';
    if (accuracy >= 0 && accuracy <= 60) return 'Improvable';
    return 'Bad';
  }

  private convertToLocaleString(utcDate) {
    const date = new Date(utcDate);
    return date.toLocaleString(); // Converts to local date and time string
  }
  
  async createPracticeDetails(
    practiceData: PracticeDetails,
  ): Promise<PracticeDetails> {
    if (!practiceData.userId || !practiceData.practiceId) {
      throw new Error('userId and practiceId are required fields');
    }
    const practiceId = practiceData.practiceId;
    const practice = await this.practiceModel.findById(practiceId);

    if (!practice) {
      throw new Error('Practice not found');
    }
    if (practice.userId !== practiceData.userId) {
      throw new Error('This practice is not assoiciated with this User ');
    }
    if (practice.queArr.length === practiceData.queArr.length) {
      const dbIds = practice.queArr.map((q) => {
        return q.toString();
      });
      const reqqueIds = practiceData.queArr.map((q: { qId: string }) => {
        return q.qId;
      });
      // Check if every element in reqqueIds matches the corresponding element in dbIds
      const allIdsMatch = reqqueIds.every(
        (reqId, index) => reqId === dbIds[index],
      );
      if (!allIdsMatch) {
        throw new Error(
          'One or more question IDs from the request do not match the database records.',
        );
      }
    } else {
      throw new Error(
        'Provide all the Questions details which are presenet in Practice',
      );
    }
    await this.updateQuestionDetails(practiceData.queArr);
    const createdPractice = new this.practiceDetailModel(practiceData);
    return createdPractice.save();
  }

  private async updateQuestionDetails(queArr) {
    for (const question of queArr) {
      const questionRecord = await this.queModel.findById(question.qId);

      if (!questionRecord) {
        throw new Error(`Question not found with ID: ${question.qId}`);
      }

      // Initialize attempts and correctAttempts to 0 if they are undefined or null
      questionRecord.attempts = questionRecord.attempts || 0;
      questionRecord.correctAttempts = questionRecord.correctAttempts || 0;

      // Update attempts
      if (question.isAttempted) {
        questionRecord.attempts += 1;
      }

      // Update correct attempts
      if (question.isAttempted && question.isCorrect) {
        questionRecord.correctAttempts += 1;
      }

      // Calculate and update gotRight
      if (questionRecord.attempts > 0) {
        questionRecord.gotRight = Math.round(
          (questionRecord.correctAttempts / questionRecord.attempts) * 100,
        ).toFixed(2);
      } else {
        questionRecord.gotRight = '0.00'; // Handle division by zero
      }

      await questionRecord.save();
    }
  }
}
