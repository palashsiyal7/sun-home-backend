import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schema/user.schema';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../dto/user-login.dto';
import { jwtConstants } from '../constants';
import { ReferService } from 'src/modules/refer/refer.service';
import { Role } from 'src/modules/role/schema/role.schema';
import { TransactionHistory } from 'src/modules/transaction-history/schema/transaction-history.schema';
import { Subject } from 'src/modules/subject/schema/subject.schema';
import { Topic } from 'src/modules/topic/schema/topic.schema';
import { Chapter } from 'src/modules/chapter/schema/chapter.schema';
import { Video } from 'src/modules/video/schema/video.schema';
import { Course } from 'src/modules/course/schema/course.schema';
import { Practice } from 'src/modules/practice/schema/practice.schema';
import { PracticeDetails } from 'src/modules/practice/schema/practiceDetails.schema';
import { firebaseAdmin } from 'src/firebase/firebase-admin.service';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * This class use for user CRUD logic
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Practice.name) private readonly practiceModel: Model<Practice>,
    @InjectModel(PracticeDetails.name)
    private readonly practiceDetailsModel: Model<PracticeDetails>,
    @InjectModel(TransactionHistory.name)
    private readonly transactionHistoryModel: Model<TransactionHistory>,
    private readonly referService: ReferService,
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
    @InjectModel(Topic.name) private topicModel: Model<Topic>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private jwtService: JwtService,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(TransactionHistory.name)
    private readonly transactionModel: Model<TransactionHistory>,
  ) {}

  async findUsersByTypeAndPaymentStatus(userType, isPaid) {
    return await this.userModel.find({ userType: userType, isPaid: isPaid });
  }

  async findUsersWithToken() {
    return await this.userModel.find({ token: { $exists: true, $ne: null } });
  }

  // @Cron(CronExpression.EVERY_10_SECONDS) // Adjust the cron timing as needed
  // @Cron('*/10 * * * * *') // Cron expression for every 10 seconds
  // async sendFCMNotification(userId, message) {
  //   const user = await this.userModel.findById(userId);
  //   if (!user || !user.token) {
  //     throw new Error('User or FCM token not found');
  //   }

  //   const messagePayload = {
  //     notification: {
  //       title: 'Helium Education',
  //       body: message,
  //     },
  //     token: user.token,
  //   };

  //   await firebaseAdmin.messaging().send(messagePayload);
  // }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .populate('courses')
      .populate('subjects')
      .exec();
  }

  private intersectArrays = (c1: string[], c2: string[]) => {
    return c2.filter((element) => c1.includes(element));
  };

  // Returns all data by user with populated params
  // async findById(id: string): Promise<any> {
  //   const user = await (
  //     await (
  //       await (await this.userModel.findById(id)).populate('subjects')
  //     ).populate('courses')
  //   ).populate('videos');

  //   const userSubjects = user.subjects.map((sub) => sub.toString());

  //   const result = await Promise.all(
  //     user.subjects.map(async (subject) => {
  //       const chapters = await this.chapterModel
  //         .find({ subject: subject._id.toString() })
  //         .exec();
  //       const chapterData = chapters.map(async (chapter) => {
  //         const topics = await this.topicModel
  //           .find({ chapter: chapter._id.toString() })
  //           .exec();
  //         const topicData = topics.map(async (topic) => {
  //           const topicVideo = await this.videoModel
  //             .findOne({
  //               isLatest: true,
  //               teacher: user._id.toString(),
  //               topic: topic._id.toString(),
  //             })
  //             .populate('subject')
  //             .populate('chapter');
  //           return {
  //             topicName: topic.topicName,
  //             _id: topic._id,
  //             isActive: topic.isActive,
  //             topicNo: topic.topicNo,
  //             topicVideo: topicVideo ? topicVideo : '',
  //           };
  //         });
  //         return {
  //           chapterName: chapter.chapterName,
  //           _id: chapter._id,
  //           isActive: chapter.isActive,
  //           chapterNo: chapter.chapterNo,
  //           topics: await Promise.all(topicData),
  //         };
  //       });
  //       return {
  //         //@ts-ignore
  //         subjectName: subject.subjectName,
  //         _id: subject._id,
  //         //@ts-ignore
  //         isActive: subject.isActive,
  //         chapters: await Promise.all(chapterData),
  //       };
  //     }),
  //   );

  //   const Courses = user.courses.map(async (course) => {
  //     const courseDetail = await this.courseModel
  //       .findById(course)
  //       .populate('subjects');
  //     return courseDetail;
  //   });

  //   const userVideos = await Promise.all(
  //     await this.videoModel.find({
  //       teacher: user._id.toString(),
  //     }),
  //   );

  //   const finalData = await this.userModel
  //     .findById(id)
  //     .populate({
  //       path: 'courses',
  //       populate: {
  //         path: 'subjects',
  //         model: 'Subject', // Ensure this matches your Subject model name
  //       },
  //     })
  //     .exec();

  //   return {
  //     data: {
  //       courses: await Promise.all(Courses),
  //       user: user,
  //       userVideos: userVideos ? userVideos : [],
  //       result: await Promise.all(result),
  //       finalData: finalData,
  //     },
  //   };
  //   // return {
  //   //   courses: await Promise.all(Courses),
  //   //   user: user,
  //   //   userVideos: userVideos ? userVideos : [],
  //   //   result: await Promise.all(result),
  //   //   finalData: finalData,
  //   // };
  // }
  async findById(id: string): Promise<any> {
    const user = await (
      await (
        await (await this.userModel.findById(id)).populate('subjects')
      ).populate('courses')
    ).populate('videos');

    const Courses = user.courses.map(async (course) => {
      const courseDetail = await this.courseModel
        .findById(course._id)
        .populate('subjects');

      const courseSubjects = courseDetail.subjects.filter((sub) => {
        return user.subjects.filter((userSub) => userSub === sub._id);
      });

      // console.log(courseSubjects);

      const subjectsData = await Promise.all(
        courseDetail.subjects.map(async (subject) => {
          // courseSubjects.map(async (subject) => {
          const chapters = await this.chapterModel
            .find({ subject: subject._id.toString() })
            .exec();

          const chapterData = chapters.map(async (chapter) => {
            const topics = await this.topicModel
              .find({ chapter: chapter._id.toString() })
              .exec();

            const topicData = topics.map(async (topic) => {
              const topicVideo = await this.videoModel
                .findOne({
                  course: course._id,
                  teacher: user._id.toString(),
                  topic: topic._id.toString(),
                })
                .sort({ createdAt: -1 })
                .populate('subject')
                .populate('chapter');

              return {
                topicName: topic.topicName,
                _id: topic._id,
                isActive: topic.isActive,
                topicNo: topic.topicNo,
                topicVideo: topicVideo ? topicVideo : '',
              };
            });

            return {
              chapterName: chapter.chapterName,
              _id: chapter._id,
              isActive: chapter.isActive,
              chapterNo: chapter.chapterNo,
              topics: await Promise.all(topicData),
            };
          });

          return {
            //@ts-ignore
            subjectName: subject.subjectName,
            _id: subject._id,
            //@ts-ignore
            isActive: subject.isActive,
            chapters: await Promise.all(chapterData),
          };
        }),
      );

      return {
        courseName: courseDetail.courseName,
        _id: courseDetail._id,
        isActive: courseDetail.isActive,
        subjects: subjectsData,
      };
    });

    const userVideosPromises = user.videos.map(async (video) => {
      return await this.videoModel
        .find({
          videoURL: video,
        })
        .populate('teacher')
        .populate('subject')
        .populate('chapter')
        .populate('course')
        .populate('topic')
        .populate('videoQuestions');
    });

    const userVideosArrays = await Promise.all(userVideosPromises);
    const userVideos = userVideosArrays.flat();

    const finalData = await Promise.all(Courses);

    return {
      data: {
        courses: finalData,
        user: user,
        userVideos,
        // userVideos
      },
    };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async loginBasedOnType(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      return { error: 'User Not Found' };
    }

    const transaction = await this.transactionHistoryModel.findOne({
      user: user._id,
    });
    if (user?.password !== password) {
      // throw new HttpException('Invalid organization credentials.', HttpStatus.UNAUTHORIZED)
      return { error: 'Invalid login credentials' };
    }

    const token = this.jwtService.sign(
      { userId: user._id },
      { expiresIn: '10d', secret: jwtConstants.secret },
    );
    return {
      access_token: token,
      user: user,
      transaction: transaction,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<User> {
    // return this.userModel.findByIdAndRemove(id).exec();
    // }
    // Retrieve the user
    const user = await this.userModel.findById(id);
    await this.practiceModel.deleteMany({ userId: id });
    await this.practiceDetailsModel.deleteMany({ userId: id });

    if (!user) {
      throw new Error('User not found');
    }

    // Handle the user's transaction history
    await this.handleTransactionHistoryOnUserDeletion(user);

    // Delete the user
    return this.userModel.findByIdAndRemove(id).exec();
  }

  async handleTransactionHistoryOnUserDeletion(user: User): Promise<void> {
    // if (user.refCode) {
    //   const referrer = await this.userModel.findOne({ refCode: user.refCode });
    //   if (referrer) {
    //     await this.transactionHistoryModel.updateOne(
    //       { user: referrer._id },
    //       { $pull: { referredUsers: user._id } },
    //     );
    //   }
    // }
    await this.transactionHistoryModel.deleteMany({ user: user._id });
  }

  async addOrUpdateCourses(userId: string, courseIds: string[]): Promise<User> {
    try {
      // Find the user by ID
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Convert string course IDs to ObjectId
      const objectIdCourseIds = courseIds.map(
        (courseId) => new Types.ObjectId(courseId),
      );

      // Add or update courses for the user
      user.courses = objectIdCourseIds;

      // Save the updated user
      const updatedUser = await user.save();

      return updatedUser;
    } catch (error) {
      throw new Error(
        `Error adding or updating courses for user: ${error.message}`,
      );
    }
  }

  async registerOrUpdateUser(body: CreateUserDto): Promise<User> {
    const { status, phoneNumber, dob, gender, referral = '', password } = body;

    // Password hashing logic if needed

    // Determine roleName based on status
    let roleName;
    switch (status) {
      case 1:
        roleName = 'Student';
        break;
      case 2:
        roleName = 'Teacher';
        break;
      // Add other cases as necessary
      default:
        roleName = ''; // Default case if needed
        break;
    }

    // Find the role's ObjectId based on roleName
    const roleDocument = roleName
      ? await this.roleModel.findOne({ roleName }).exec()
      : null;

    // Common fields for updating or creating a new user
    const commonFields = {
      ...body,
      password, // Assuming password hashing logic is applied here
      userType: status,
      role: roleDocument ? roleDocument._id : null,
      dob: dob || '',
      gender: gender || '',
      referrals: [referral], // Store single referral as an array
    };

    console.log(commonFields, 'common fields');

    if (![0, 1, 2, 3].includes(status)) {
      throw new Error('Invalid status value');
    }

    const existingUser = await this.userModel.findOne({ phoneNumber });

    if (existingUser) {
      // Update existing user
      existingUser.set(commonFields);
      await existingUser.save();

      // Update wallet points based on referral
      await this.updateReferralPoints(referral, existingUser, roleName);

      return existingUser;
    } else {
      // Create new user
      const newUser = new this.userModel({
        ...commonFields,
        refCode: this.generateRandomCode(),
      });

      console.log(newUser, 'new user');

      await newUser.save();

      // Update wallet points based on referral
      await this.updateReferralPoints(referral, newUser, roleName);

      return newUser;
    }
  }

  // async updateReferralPoints(
  //   refCode: string,
  //   user: User,
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   roleName: string,
  // ): Promise<void> {
  //   const referrerUser = await this.userModel.findOne({ refCode }).exec();

  //   if (referrerUser) {
  //     //     // Create or update a transaction history record
  //     const defaultPoints =
  //       await this.referService.getDefaultPointsForRefer(roleName);

  //     let transaction = await this.transactionHistoryModel.findOne({
  //       user: referrerUser._id,
  //     });
  //     if (!transaction) {
  //       transaction = new this.transactionHistoryModel({
  //         user: referrerUser._id,
  //         userName: referrerUser.userName,
  //         refCode: referrerUser.refCode,
  //         defaultPoints: defaultPoints,
  //         referredUsers: [user._id],
  //         totalWalletPoints: referrerUser.walletPoint,
  //       });
  //     } else {
  //       transaction.referredUsers.push(user._id);
  //       transaction.totalWalletPoints = referrerUser.walletPoint;
  //     }
  //     await transaction.save();
  //   }
  // }

  // async updateReferralPoints(
  //   refCode: string,
  //   user: User,
  //   roleName: string,
  // ): Promise<void> {
  //   const referrerUser = await this.userModel.findOne({ refCode }).exec();

  //   if (referrerUser) {
  //     // Get default points for the referral
  //     const defaultPoints =
  //       await this.referService.getDefaultPointsForRefer(roleName);

  //     // Update wallet points for both referrer and referred user
  //     referrerUser.walletPoint += defaultPoints;
  //     user.walletPoint += defaultPoints; // Assuming 'user' is the referred user

  //     await referrerUser.save();
  //     await user.save();

  //     // Update or create a transaction history record
  //     let transaction = await this.transactionHistoryModel.findOne({
  //       user: referrerUser._id,
  //     });
  //     if (!transaction) {
  //       transaction = new this.transactionHistoryModel({
  //         user: referrerUser._id,
  //         userName: referrerUser.userName,
  //         refCode: referrerUser.refCode,
  //         defaultPoints: defaultPoints,
  //         referredUsers: [user._id],
  //         totalWalletPoints: referrerUser.walletPoint,
  //       });
  //     } else {
  //       transaction.referredUsers.push(user._id);
  //       transaction.totalWalletPoints = referrerUser.walletPoint;
  //     }
  //     await transaction.save();
  //   }
  // }

  async updateUserTransactionHistory(
    user: User,
    roleName: string,
  ): Promise<void> {
    if (user.walletPoint > 0) {
      // Fetch defaultPoints from the Refer service or model
      const defaultPoints =
        await this.referService.getDefaultPointsForRefer(roleName);

      let transaction = await this.transactionHistoryModel.findOne({
        user: user._id,
      });

      if (!transaction) {
        transaction = new this.transactionHistoryModel({
          user: user._id,
          userName: user.userName,
          refCode: user.refCode, // Assuming you have refCode in User model
          defaultPoints: defaultPoints,
          referredUsers: [], // Initialize with empty array
          totalWalletPoints: user.walletPoint,
        });
      } else {
        // Update existing transaction history
        transaction.defaultPoints = defaultPoints; // Update defaultPoints
        transaction.totalWalletPoints = user.walletPoint; // Update total wallet points
      }
      await transaction.save();
    }
  }

  // async updateReferralPoints(
  //   refCode: string,
  //   user: User,
  //   roleName: string,
  // ): Promise<void> {
  //   const referrerUser = await this.userModel.findOne({ refCode }).exec();

  //   if (referrerUser) {
  //     // Get default points for the referral
  //     const defaultPoints =
  //       await this.referService.getDefaultPointsForRefer(roleName);

  //     // Find or create the transaction history record
  //     let transaction = await this.transactionHistoryModel.findOne({
  //       user: referrerUser._id,
  //     });

  //     if (!transaction) {
  //       transaction = new this.transactionHistoryModel({
  //         user: referrerUser._id,
  //         userName: referrerUser.userName,
  //         refCode: referrerUser.refCode,
  //         defaultPoints: defaultPoints,
  //         referredUsers: [],
  //         totalWalletPoints: referrerUser.walletPoint,
  //       });
  //     }

  //     // Check if the number of referred users is less than four
  //     if (transaction.referredUsers.length < 4) {
  //       // Update wallet points for both referrer and referred user
  //       referrerUser.walletPoint += defaultPoints;
  //       user.walletPoint += defaultPoints; // Assuming 'user' is the referred user

  //       await referrerUser.save();
  //       await user.save();

  //       // Update transaction history
  //       transaction.referredUsers.push(user._id);
  //       transaction.totalWalletPoints = referrerUser.walletPoint;
  //       await transaction.save();
  //     }
  //   }
  // }

  async updateReferralPoints(
    refCode: string,
    user: User,
    roleName: string,
  ): Promise<void> {
    const referrerUser = await this.userModel.findOne({ refCode }).exec();

    if (referrerUser && referrerUser._id.toString() !== user._id.toString()) {
      const defaultPoints =
        await this.referService.getDefaultPointsForRefer(roleName);

      // Find the transaction history record for the referrer
      let referrerTransaction = await this.transactionHistoryModel.findOne({
        user: referrerUser._id,
      });

      if (!referrerTransaction) {
        referrerTransaction = new this.transactionHistoryModel({
          user: referrerUser._id,
          userName: referrerUser.userName,
          refCode: referrerUser.refCode,
          defaultPoints: defaultPoints,
          referredUsers: [],
          totalWalletPoints: referrerUser.walletPoint,
        });
      }

      // Check if the number of referred users is less than four
      if (referrerTransaction.referredUsers.length < 4) {
        // Update wallet points for both referrer and referred user
        referrerUser.walletPoint += defaultPoints;
        user.walletPoint += defaultPoints;

        await referrerUser.save();
        await user.save();

        // Update transaction history for the referrer
        referrerTransaction.referredUsers.push(user._id);
        referrerTransaction.totalWalletPoints = referrerUser.walletPoint;
        await referrerTransaction.save();

        // Update transaction history for the referred user
        await this.updateUserTransactionHistory(user, roleName);
        // if (referrerUser.userType === 2) {
        //   await this.notifyTeacherOnReferralUsed(refCode);
        // }

        if (referrerUser.userType === 2) {
          await this.notifyTeacherOnReferralUsed(refCode, user._id);
        }
      }
    }
  }

  private generateRandomCode(): string {
    // Implement logic to generate a random alphanumeric 6-digit code
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  async findByRefCode(refCode: string): Promise<User | null> {
    const user = await this.userModel.findOne({ refCode }).exec();
    if (!user) {
      throw new Error('Referral code not found');
    }
    return user;
  }

  async findUserSubjects(userId: string, courseId: string) {
    const user = await this.userModel.findById(userId).populate('subjects');
    const selectedCourse = await this.courseModel.findById(courseId);

    if (!user || !selectedCourse) {
      throw new Error('User or Course not found');
    }

    // Extract the subject IDs from the user's subjects
    const userSubjectIds = user.subjects.map((subject) =>
      subject._id.toString(),
    );

    // Filter the course's subjects to include only those that the user is assigned to
    const commonSubjects = selectedCourse.subjects.filter((subject) =>
      userSubjectIds.includes(subject._id.toString()),
    );

    const subjects = commonSubjects.map(async (cmnSub) => {
      return await this.subjectModel.findById(cmnSub);
    });

    return {
      user: user,
      course: selectedCourse,
      commonSubjects: await Promise.all(subjects),
    };
  }

  async findUnpaidTypeOneUsers() {
    console.log('first');
    return await this.userModel.find({ userType: 1, isPaid: false });
  }

  async notifyTeacherOnReferralUsed(
    refCode: string,
    referredUserId: string,
  ): Promise<void> {
    // Find the teacher associated with the referral code
    const teacher = await this.findByRefCode(refCode);

    // Find the student (referred user) who used the referral code
    const referredUser = await this.userModel.findById(referredUserId).exec();

    if (teacher && teacher.userType === 2 && referredUser) {
      const title = 'Referral Code Used';
      const message = `Your referral code has been used by ${referredUser.userName}. Total wallet points: ${teacher.walletPoint}.`;

      if (teacher.token) {
        await this.sendFCMNotification(
          teacher.id,
          title,
          message,
          teacher.token,
        );
      } else {
        console.log(`Teacher ${teacher.id} does not have a valid FCM token.`);
      }
    }
  }

  private async sendFCMNotification(
    userId: string,
    title: string,
    message: string,
    token: string,
  ) {
    const messagePayload = {
      notification: {
        title: title,
        body: message,
      },
      token: token,
    };

    await firebaseAdmin.messaging().send(messagePayload);
  }
}
