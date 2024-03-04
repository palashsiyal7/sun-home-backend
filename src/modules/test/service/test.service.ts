import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question } from 'src/modules/question/schema/question.schema';
import { Subject } from 'src/modules/subject/schema/subject.schema';
import { TestDetail } from '../schema/test.schema';
import * as moment from 'moment-timezone';
import { TestData } from '../schema/testData.schema';
import { User } from 'src/modules/user/schema/user.schema';

@Injectable()
export class TestService {
  @InjectModel(Question.name) private queModel: Model<Question>;
  @InjectModel(Subject.name) private subjectModel: Model<Subject>;
  @InjectModel(TestDetail.name) private testModel: Model<TestDetail>;
  @InjectModel(TestData.name) private testDataModel: Model<TestData>;
  @InjectModel(User.name) private userModel: Model<User>;

  async findAll(): Promise<TestDetail[]> {
    return this.testModel.find().populate('course').populate('subjects');
  }

  async createTestData(testData: {
    testTitle: string;
    description: string;
    startTime: string;
    endTime: string;
    testType: string;
    duration: number;
    correctMarks: number;
    inCorrectMarks: number;
    sections: any[];
    courseId: string;
  }): Promise<any> {
    // Extracting all selectedSubjects from sections
    const selectedSubjects: string[] = [];
    const selectedChapters: string[] = [];
    let totalNoOfQues = 0;
    const queArr = [];
    const testSections = [];
    for (const sec of testData.sections) {
      const subjectName = await this.subjectModel.findById(sec.selectedSubject);
      selectedSubjects.push(sec.selectedSubject);
      selectedChapters.push(...sec.selectedChapters);

      const subject = sec.selectedSubject;
      const chapters = sec.selectedChapters;
      const noOfQue = sec.numberOfQuestions;
      const typeOfQue = sec.selectedTypeOfQues;
      totalNoOfQues += parseInt(noOfQue);
      const chapterObjectIds = chapters.map((chapterId) => {
        return chapterId;
      });

      const allQuestions = await this.queModel.find({
        chapter: { $in: chapterObjectIds },
        type: { $in: typeOfQue },
      });

      if (allQuestions.length < noOfQue) {
        throw new Error(
          'Not enough type of questions are present in selected Chapters',
        );
      }

      this.shuffleArray(allQuestions);
      const finalQuestions = allQuestions.slice(0, noOfQue);
      queArr.push({
        _id: subjectName._id.toString(),
        subjectName: subjectName.subjectName,
        questions: finalQuestions,
      });
      testSections.push({
        subjectName: subjectName.subjectName,
        subQues: sec.numberOfQuestions,
      });
    }
    const totalMarks = totalNoOfQues * testData.correctMarks;
    const instructions = await this.createInstructions(
      testData.duration,
      totalMarks,
      totalNoOfQues,
      testData.correctMarks,
      testData.inCorrectMarks,
      testSections,
    );
    const postData = {
      testTitle: testData.testTitle,
      description: testData.description,
      startTime: testData.startTime,
      endTime: testData.endTime,
      duration: testData.duration,
      attemptCount: 0,
      correctMarks: testData.correctMarks,
      inCorrectMarks: testData.inCorrectMarks,
      course: testData.courseId,
      subjects: selectedSubjects,
      chapters: selectedChapters,
      isSurprise: testData.testType === 'normal' ? false : true,
      isCustom: false,
      queArr: queArr,
      totalNoOfQues: totalNoOfQues,
      instructions: instructions,
    };

    const test = new this.testModel(postData);

    const savedTest = await test.save();

    return savedTest;
  }

  async createCustomTestData(testData: {
    duration: number;
    section: any[];
    courseId: string;
    userId: string;
    noOfQues: number;
    level: string;
  }): Promise<any> {
    const requiredFields = [
      'userId',
      'courseId',
      'noOfQues',
      'level',
      'duration',
      'section',
    ];
    const missingFields = requiredFields.filter((field) => !testData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(', ')}`);
    }
    const totalnoOfQue = testData.noOfQues;
    const selectedSubjects: string[] = [];
    const selectedChapters: string[] = [];
    const queArr = [];
    const totalSections = testData.section.length;

    // Calculate the number of questions per section
    const questionsPerSection = Math.floor(totalnoOfQue / totalSections);
    const remainingQuestions = totalnoOfQue % totalSections;

    const newSections = testData.section.map((sec, index) => {
      const questionsForThisSection =
        index < remainingQuestions
          ? questionsPerSection + 1
          : questionsPerSection;

      return {
        selectedSubject: sec.selectedSubject,
        numberOfQuestions: questionsForThisSection,
        selectedChapters: sec.selectedChapters,
        selectedTypeOfQues: sec.selectedTypeOfQues,
      };
    });
    const testSections = [];
    const arr=[]
    const currentTime = new Date();
    const endTime = new Date(currentTime);
    endTime.setDate(currentTime.getDate() + 1);
    for (const sec of newSections) {
      const subjectName = await this.subjectModel.findById(sec.selectedSubject);
      selectedSubjects.push(sec.selectedSubject);
      selectedChapters.push(...sec.selectedChapters);

      const chapters = sec.selectedChapters;
      const noOfQue = sec.numberOfQuestions;
      const typeOfQue = sec.selectedTypeOfQues;
      const chapterObjectIds = chapters.map((chapterId) => {
        return chapterId;
      });

      const allQuestions = await this.queModel.find({
        chapter: { $in: chapterObjectIds },
        type: { $in: typeOfQue },
      });

      if (allQuestions.length < noOfQue) {
        throw new Error(
          'Not enough type of questions are present in selected Chapters',
        );
      }

      this.shuffleArray(allQuestions);
      const finalQuestions = allQuestions.slice(0, noOfQue);
      queArr.push({
        _id: subjectName._id.toString(),
        subjectName: subjectName.subjectName,
        questions: finalQuestions,
      });
      testSections.push({
        subjectName: subjectName.subjectName,
        subQues: sec.numberOfQuestions,
      });
    }
    // console.log(testSections);
    const instructions = await this.createInstructions(
      testData.duration,
      totalnoOfQue * 4,
      totalnoOfQue,
      '4',
      '-1',
      testSections,
    );
    const postData = {
      testTitle: 'Custom Test',
      description: '',
      startTime: currentTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: testData.duration,
      attemptCount: 0,
      correctMarks: '4',
      inCorrectMarks: '-1',
      course: testData.courseId,
      subjects: selectedSubjects,
      chapters: selectedChapters,
      isSurprise: false,
      isCustom: true,
      queArr: queArr,
      totalNoOfQues: testData.noOfQues,
      instructions: instructions,
    };
    const test = new this.testModel(postData);

    const savedTest = await test.save();

    // const retest= await this.testModel.findById(savedTest._id)
    arr.push(savedTest)
    return arr;
  }

  async getTestData(testData: {
    userId: string;
    courseId: string;
  }): Promise<any> {
    const requiredFields = ['userId', 'courseId'];
    const missingFields = requiredFields.filter((field) => !testData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(', ')}`);
    }
    // Parsing current time and calculating time for the next 7 days
    const currentTime = new Date();
    const sevenDaysLater = new Date(currentTime);
    sevenDaysLater.setDate(currentTime.getDate() + 7);

    // Fetching all tests for the course
    const allTests = await this.testModel.find({ course: testData.courseId });

    // Filter out tests where the user is present
    const filteredTests = allTests.filter((test) => {
      // Check if the user is part of the test
      const isUserPartOfTest = test.users.some(
        (user) => user.userId.toString() === testData.userId.toString(),
      );
      return isUserPartOfTest;
    });
    const result = this.subtractArrays(allTests,filteredTests)
    // Splitting into upcoming and ongoing tests
    const upComingTests = result.filter((test) => {
      const startTime = moment.tz(test.startTime, 'Asia/Kolkata').toDate();
      return currentTime <= startTime && startTime <= sevenDaysLater;
    });

    const onGoingTests = result.filter((test) => {
      const startTime = moment.tz(test.startTime, 'Asia/Kolkata').toDate();
      const endTime = moment.tz(test.endTime, 'Asia/Kolkata').toDate();
      return currentTime >= startTime && currentTime <= endTime;
    });

    // Transformation function
    const transformTests = (tests, isOngoing) => {
      return tests.map((test) => {
        const subjectsMap = new Map();
        test.queArr.forEach((que) => {
          if (!subjectsMap.has(que._id)) {
            subjectsMap.set(que._id, {
              _id: que._id,
              subjectName: que.subjectName,
              isActive: true,
            });
          }
        });
        const uniqueSubjects = Array.from(subjectsMap.values());

        // Shuffle each queArr before mapping
        test.queArr.forEach((que) => this.shuffleArray(que.questions));

        const queArr = test.queArr.map((que) => ({
          _id: que._id,
          subjectName: que.subjectName,
          questions: que.questions.map((question) => ({
            _id: question._id,
            question: question.question,
            options: question.options,
            correctAns: question.correctAns,
            level: question.level,
            avgTime: question.avgTime,
            solution: question.solution,
            type: question.type,
          })),
        }));
        return {
          _id: test._id,
          testTitle: test.testTitle.trim(),
          duration: moment
            .utc(moment.duration(test.duration, 'minutes').asMilliseconds())
            .format('HH:mm:ss'),
          totalQues: String(test.totalNoOfQues),
          totalMarks: String(test.totalNoOfQues * test.correctMarks),
          attemptCount: String(test.users.length),
          description: test.description.trim(),
          instructions: test.instructions.trim(),
          startTime: test.startTime,
          endTime: test.endTime,
          subjects: uniqueSubjects,
          queArr: queArr,
          isSurprise: test.isSurprise,
          isOngoing: isOngoing,
        };
      });
    };

    // Transform and combine upcoming and ongoing tests
    const transformedTests = [
      ...transformTests(onGoingTests, true), // Ongoing tests with isOngoing set to trued
      ...transformTests(upComingTests, false), // Upcoming tests with isOngoing set to false
    ];
    return transformedTests;
  }

  async getTestReportData(testData: {
    userId: string;
    courseId: string;
  }): Promise<any> {
    const requiredFields = ['userId', 'courseId'];
    const missingFields = requiredFields.filter((field) => !testData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(', ')}`);
    }

    const testDatda = await this.testDataModel.find({
      testId: new Types.ObjectId('659bb539bfadd68479cb0516'),
      userId: new Types.ObjectId('65715730b200f8f6cdca4669'),
    });

    // Assuming you have a model for questions (let's call it QuestionModel)
    const questionIds = testDatda[0].queArr.flatMap((subject: any) =>
      subject.questions.map((question) => question._id),
    );
    const questions = await this.queModel.find({ _id: { $in: questionIds } });

    // Now populate queArr with the actual question details
    testDatda[0].queArr.forEach((subject: any) => {
      subject.questions.forEach((question) => {
        const matchingQuestion: any = questions.find((q) =>
          q._id.equals(question._id),
        );
        if (matchingQuestion) {
          // Only copy over the fields you want from matchingQuestion
          question.question = matchingQuestion.question;
          question.correctAns = matchingQuestion.correctAns;
          question.level = matchingQuestion.level;
          question.solution = matchingQuestion.solution;
          // // Replace the existing question with the details from the QuestionModel
          // Object.assign(question, matchingQuestion._doc);
        }
      });
    });
    // Parsing current time and calculating time for the next 7 days
    return testDatda;
  }

  async updateUserTestStatus(testUpdateData: {
    userId: Types.ObjectId;
    testId: Types.ObjectId;
    isCheated: boolean;
  }): Promise<TestDetail> {
    const requiredFields = ['userId', 'testId', 'isCheated'];
    const missingFields = requiredFields.filter(
      (field) => testUpdateData[field] === undefined,
    );
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(', ')}`);
    }
    const test = await this.testModel.findById(testUpdateData.testId);
    if (!test) {
      throw new Error('Test not found');
    }

    const userIndex = test.users.findIndex(
      (u) => u.userId.toString() === testUpdateData.userId.toString(),
    );

    if (userIndex === -1) {
      // User not found in test, add new entry
      test.users.push({
        userId: testUpdateData.userId,
        isCheated: testUpdateData.isCheated,
        Marks: '0',
      });
    } else {
      // User found, update isCheated status
      test.users[userIndex].isCheated = testUpdateData.isCheated;
    }

    await test.save();
    return test;
  }

  async postTestData(testData: {
    userId: Types.ObjectId;
    testId: Types.ObjectId;
    timeTaken: string;
    isCheated: boolean;
    queArr: any[];
  }): Promise<any> {
    const requiredFields = [
      'userId',
      'testId',
      'isCheated',
      'queArr',
      'timeTaken',
    ];
    const currentTime = new Date();
    const missingFields = requiredFields.filter(
      (field) => testData[field] === undefined,
    );
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(', ')}`);
    }
    const test = await this.testModel.findById(testData.testId);
    if (!test) {
      throw new Error('Test not found');
    }
    if (testData.queArr.length === test.queArr.length) {
      // Extract question IDs from testData.queArr
      const submittedQuestionIds = testData.queArr.flatMap((subject) =>
        subject.questions.map((question) => question._id.toString()),
      );

      // Extract question IDs from test.queArr
      const testQuestionIds = test.queArr.flatMap((subject: any) =>
        subject.questions.map((question) => question._id.toString()),
      );

      // Check if every submitted question ID is present in the test
      const allQuestionsMatch = submittedQuestionIds.every((id) =>
        testQuestionIds.includes(id),
      );
      if (
        !allQuestionsMatch ||
        submittedQuestionIds.length !== testQuestionIds.length
      ) {
        throw new Error(
          'The question details provided do not match the questions in the test.',
        );
      }
    } else {
      throw new Error(
        'Provide all the Questions details which are presenet in Test',
      );
    }
    // const reqData={
    //   testData,
    //   completedTime:currentTime
    // }
    // const createdTestData = new this.testDataModel(reqData);
    // Add the completedTime field to testData
    testData['completedTime'] = currentTime.toISOString();
    const createdTestData = new this.testDataModel(testData);
    return createdTestData.save();
  }

  async calculateMarks(id: string): Promise<any> {
    const testData = await this.testDataModel.findById(id);
    const testDetails = await this.testModel.findById(testData.testId);
    const correctMarks = testDetails.correctMarks;
    const inCorrectMarks = testDetails.inCorrectMarks * -1;
    let totalQuestions = 0;
    let correctQuestions = 0;
    let wrongQuestions = 0;
    let skippedQuestions = 0;
    let notVisitedQuestions = 0;
    let skippedQueTiming = 0;
    let totalTestTime = 0;
    const subMarks = [];
    let totalScore = 0;

    testData.queArr.forEach((subject: any) => {
      // subject.questions.forEach((question: any) => {
      //   totalQuestions++;
      //   const timeInSeconds = this.convertTimeToSeconds(question.timeTaken);
      //   if (question.isAttempted) {
      //     if (question.isCorrect) {
      //       correctQuestions++;
      //     } else {
      //       wrongQuestions++;
      //     }
      //   } else {
      //     if (question.isSkipped) {
      //       skippedQuestions++;
      //       skippedQueTiming += timeInSeconds;
      //     } else {
      //       notVisitedQuestions++;
      //     }
      //   }
      // });
      let subjectScore = 0;
      let subjectTime = 0;
      let subjectCorrectQuestions = 0;
      let subjectInCorrectQuestions = 0;
      let subjectTotalQuestions = subject.questions.length;

      subject.questions.forEach((question: any) => {
        totalQuestions++;
        const timeInSeconds = this.convertTimeToSeconds(question.timeTaken);

        if (question.isAttempted) {
          subjectTime += timeInSeconds;
          totalTestTime += timeInSeconds;

          if (question.isCorrect) {
            correctQuestions++;
            subjectCorrectQuestions++;
          } else {
            wrongQuestions++;
            subjectInCorrectQuestions++;
          }
        } else {
          if (question.isSkipped) {
            skippedQuestions++;
          } else {
            notVisitedQuestions++;
          }
        }
      });

      const subjectAccuracy =
        (subjectCorrectQuestions / subjectTotalQuestions) * 100;
      const correctScore = subjectCorrectQuestions * correctMarks;
      const inCorrectScore = subjectInCorrectQuestions * inCorrectMarks;
      subjectScore = correctScore - inCorrectScore;
      totalScore += subjectScore;

      subMarks.push({
        _id: subject._id,
        subjectName: subject.subjectName,
        score: subjectScore,
        timeTaken: this.formatTime(subjectTime),
        correctQues: subjectCorrectQuestions,
        incorrectQues: subjectInCorrectQuestions,
        totalQues: subjectTotalQuestions,
        accuracy: `${subjectAccuracy.toFixed(2)}%`,
      });
    });

    // After calculating totalScore and other analytics
    let updatedUser = false;
    testDetails.users = testDetails.users.map((user) => {
      if (user.userId.toString() === testData.userId.toString()) {
        updatedUser = true;
        return { ...user, Marks: totalScore.toString() };
      }
      return user;
    });

    // If user not found in testDetails, you can handle that scenario here
    if (!updatedUser) {
      // Handle scenario when user is not found (e.g., add the user to the array)
      throw new Error('This user has not attempted this test ');
    }

    // Save updated test details
    await testDetails.save();

    testData.Marks = [
      {
        totalMarks: totalScore,
        subMarks: subMarks,
      },
    ];
    const testAccuracy = (correctQuestions / totalQuestions) * 100;
    testData.queAnalytics = [
      {
        totalQues: totalQuestions,
        correct: correctQuestions,
        inCorrect: wrongQuestions,
        skipped: skippedQuestions,
        notVisited: notVisitedQuestions,
        Accuracy: `${testAccuracy.toFixed(2)}%`,
        timeTaken: testData.timeTaken,
        timeWasted: this.formatTime(skippedQueTiming),
      },
    ];
    // Save updated testData
    await testData.save();

    return testData;
  }

  async generateReport(data: { testId: Types.ObjectId }): Promise<any> {
    const test = await this.testModel.findById(data.testId);
    const testData = await this.testDataModel.find({
      testId: data.testId,
    });

    const reportArray = testData.map((test) => {
      return {
        userId: test.userId.toString(),
        Marks: test.Marks,
      };
    });

    const sortedArray = reportArray.sort((a, b) => {
      const totalMarksA =
        a.Marks && a.Marks.length > 0 ? parseFloat(a.Marks[0].totalMarks) : 0;
      const totalMarksB =
        b.Marks && b.Marks.length > 0 ? parseFloat(b.Marks[0].totalMarks) : 0;

      return totalMarksB - totalMarksA; // For descending order
    });

    // Assuming you have a model for questions (let's call it QuestionModel)
    const userIds = sortedArray.map((data) => data.userId);
    const users = await this.userModel.find({ _id: { $in: userIds } });

    // Now populate queArr with the actual question details
    sortedArray.forEach((data: any) => {
      const matchingUser: any = users.find((q) => q._id.equals(data.userId));
      if (matchingUser) {
        // Only copy over the fields you want from matchingQuestion
        data.userName = matchingUser.userName;
        data.correctAns = matchingUser.correctAns;
        data.city = matchingUser.city;
        data.state = matchingUser.state;

        // // Replace the existing question with the details from the QuestionModel
        // Object.assign(question, matchingQuestion._doc);
      }
    });

    const totalStudents = testData.length;

    const finalArray = sortedArray.map(async (test, index) => {
      const percentile = ((totalStudents - (index + 1)) / totalStudents) * 100;

      // Calculate area of improvement for each subject
      const areaOfImprovement = test.Marks[0]?.subMarks.map((subMark) => {
        const subjectScores = sortedArray.map(
          (t) => t.Marks[0]?.subMarks.find((s) => s._id === subMark._id),
        );
        const topperScore = subjectScores[0]?.score ?? 0;
        const avgScore =
          subjectScores.reduce((acc, curr) => acc + (curr?.score ?? 0), 0) /
          totalStudents;

        return {
          _id: subMark._id,
          subjectName: subMark.subjectName,
          score: subMark.score,
          topperScore: topperScore,
          avgScore: avgScore,
          time: subMark.timeTaken,
          topperTime: subjectScores[0]?.timeTaken ?? '00:00:00',
          avgTime: this.formatTime(
            subjectScores.reduce(
              (acc, curr) =>
                acc + this.convertTimeToSeconds(curr?.timeTaken ?? '00:00:00'),
              0,
            ) / totalStudents,
          ),
          accuracy: subMark.accuracy,
          topperAccuracy: subjectScores[0]?.accuracy ?? '0.00%',
          avgAccuracy:
            subjectScores.reduce(
              (acc, curr) => acc + parseFloat(curr?.accuracy ?? '0.00'),
              0,
            ) /
              totalStudents +
            '%',
        };
      });

      // Find corresponding testData entry and update it
      const correspondingTestData = testData.find(
        (td) => td.userId.toString() === test.userId,
      );
      if (correspondingTestData) {
        correspondingTestData.percentile = percentile.toFixed(2);
        correspondingTestData.AreaOfImprovement = areaOfImprovement;
        // Optionally, save the updated testData here or after the loop
        await correspondingTestData.save();
      }

      return {
        userId: test.userId.toString(),
        percentile: percentile.toFixed(2),
        areaOfImprovement: areaOfImprovement,
      };
    });
    if (test) {
      test.learderBoard = sortedArray;
      // Optionally, save the updated testData here or after the loop
      await test.save();
    }
    return test;
  }

  async delete(id: string): Promise<boolean> {
    const deletedTest = await this.testModel.findByIdAndDelete(id).exec();
    return !!deletedTest;
  }

  private shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  private createInstructions = (
    duration,
    totalMarks,
    noOfQues,
    correctMarks,
    inCorrectMarks,
    sections,
  ) => {
    const instructionsPart1 = `Total duration of test is ${duration} minutes.\n 
    This test is of ${totalMarks} Marks.\n
    There will be ${noOfQues} questions.\n
    For each correct answer, the candidates will be given ${correctMarks} marks; if an answer is wrong, then ${
      inCorrectMarks * -1
    } mark  will be deducted.\n`;

    const sectionWord = sections.length === 1 ? 'section' : 'sections';
    let instructionsPart2 = `\nThere are ${sections.length} ${sectionWord} in the test.\n`;
    sections.forEach((section, index) => {
      instructionsPart2 += `
      Section ${index + 1} is containing ${
        section.subjectName
      } and it is containing ${section.subQues} questions.\n`;
    });
    const instructions = instructionsPart1 + instructionsPart2;
    return instructions;
  };
  private convertTimeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
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
  private subtractArrays(arrayA: any[], arrayB: any[]): any[] {
    return arrayA.filter((item) => !arrayB.includes(item));
  }
}
