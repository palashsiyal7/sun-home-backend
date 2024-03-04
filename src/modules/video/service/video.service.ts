import { Injectable, Param, Res, StreamableFile } from '@nestjs/common';
import { firebaseAdmin } from '../../../firebase/firebase-admin.service';
import { UploadVideoDto } from '../dto/upload-video.dto';
import { Video } from '../schema/video.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';
import * as path from 'path';
import * as cron from 'cron';
import { exec } from 'child_process';
import * as moment from 'moment-timezone';
import * as ffmpeg from 'fluent-ffmpeg';
import { Course } from 'src/modules/course/schema/course.schema';
import { Attendance } from 'src/modules/attendance/schema/attendance.schema';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { VideoQuestions } from 'src/modules/video-questions/schema/video-questions.schema';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(VideoQuestions.name) private videoQuestionModel: Model<Video>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
    private readonly configService: ConfigService,
  ) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });

  // S3 bucket file upload
  async uploadToS3(fileName: string, file: Buffer) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const updatedFileName = fileName.replace(/\s/g, '') + '_' + uniqueSuffix;

    const uploadedFile = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'helium-video-bucket',
        Key: updatedFileName,
        Body: file,
      }),
    );

    return {
      uploadedFile,
      updatedFileName,
    };
  }

  // get file from s3
  // Generate a pre-signed URL for an S3 object
  async generatePresignedUrl(key: string): Promise<string> {
    const params = {
      Bucket: 'helium-video-bucket',
      Key: key,
      Expires: 7200, // The URL will expire in 2 hour (adjust as needed)
    };

    try {
      const signedUrl = await getSignedUrl(
        this.s3Client,
        new GetObjectCommand(params),
      );
      return signedUrl;
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      throw error;
    }
  }

  // Delete a file from S3
  async deleteFileFromS3(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: 'your-bucket-name',
          Key: key,
        }),
      );
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw error;
    }
  }

  // Array to store cron jobs
  private scheduledJobs: cron.CronJob[] = [];

  // Check if videoURL is of existing video or not
  async checkVideo(videoURL: string): Promise<Boolean> {
    const video = await this.videoModel.findOne({
      videoURL: videoURL,
    });

    if (video) {
      console.log(video);
      return true;
    } else {
      return false;
    }
  }

  // Reschedule video for streaming
  async rescheduleVideoForStreaming(
    videoURL: string,
    publishDate: string,
    startTime: string,
    endTime: string,
    title: string,
    description: string,
  ) {
    const video = await this.videoModel.findOneAndUpdate(
      { videoURL: videoURL },
      {
        $set: {
          publishDate: publishDate, // Update: set new publishDate
          startTime: startTime, // Update: set new startTime
          endTime: endTime, // Update: set new endTime
          title: title, // Update: set new title
          description: description, // Update: set new description
        },
      },
      { new: true },
    );
    return video;
  }

  //Get video by videoURL
  async getVideoByURL(videoURL: string, thumbnailURL: string): Promise<Video> {
    const video = await this.videoModel.findOne({
      videoURL: videoURL,
      thumbnailURL: thumbnailURL,
    });
    return video;
  }

  // Upload video to firebase
  async uploadVideoToFirebase(videoFile: Express.Multer.File, title: string) {
    const bucket = firebaseAdmin.storage().bucket();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = title.replace(/\s/g, '') + '_' + uniqueSuffix;
    const file = bucket.file(fileName);
    await file.save(videoFile.buffer, {
      metadata: {
        contentType: videoFile.mimetype,
      },
    });

    // Get the signed URL for the uploaded video
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '07-07-2024', // Set an expiration date (e.g., far in the future)
    });

    // return url;
    return {
      url: url,
      fileName: fileName,
    };
  }

  // Save video entry with streamingURL
  async createVideo(uploadVideoDto: UploadVideoDto, streamKey: string) {
    console.log('before creating');
    const createdVideo = new this.videoModel({
      videoURL: uploadVideoDto.videoURL,
      // streamingURL: `rtmp://65.0.55.186/live/${streamKey}`,
      streamingURL: `http://65.0.55.186/hls/${streamKey}.m3u8`,
      thumbnailURL: uploadVideoDto.thumbnailURL,
      title: uploadVideoDto.title,
      description: uploadVideoDto.description,
      teacher: uploadVideoDto.teacher,
      course: uploadVideoDto.course,
      subject: uploadVideoDto.subject,
      chapter: uploadVideoDto.chapter,
      topic: uploadVideoDto.topic,
      isLatest: uploadVideoDto.isLatest ? uploadVideoDto.isLatest : true,
      publishDate: uploadVideoDto?.publishDate,
      startTime: uploadVideoDto?.startTime,
      endTime: uploadVideoDto?.endTime,
    });
    createdVideo.save();

    return {
      createdVideo: createdVideo,
      streamKey: streamKey,
    };
  }

  // Update teacher's video array with updated video
  async updateTeacherVideoArr(
    videoURL: string,
    teacherId: string,
  ): Promise<User> {
    const user = await this.userModel.findById(teacherId);

    if (!user) {
      throw new Error('User not found');
    }

    user.videos.push(videoURL);

    const updatedUser = await user.save();

    return updatedUser;
  }

  // Get all videos
  async getAllVideos(): Promise<Video[]> {
    return this.videoModel.find();
  }

  // Get all upcoming videos
  async getUpcomingVideos(): Promise<Video[]> {
    const currentTime = new Date();
    // console.log(currentTime);

    const videos = await this.videoModel.find();

    const upcomingVideos = videos.filter((video) => {
      const scheduledTime = moment
        .tz(
          `${video.publishDate} ${video.startTime}`,
          'YYYY-MM-DD HH:mm',
          'Asia/Kolkata',
        )
        .toDate();
      return scheduledTime > currentTime;
    });

    return upcomingVideos;
  }

  // Get all ongoing videos
  async getOngoingVideos(): Promise<Video[]> {
    const currentTime = new Date();

    const videos = await this.videoModel.find();

    const ongoingVideos = videos.filter((video) => {
      const startTime = moment
        .tz(
          `${video.publishDate} ${video.startTime}`,
          'YYYY-MM-DD HH:mm',
          'Asia/Kolkata',
        )
        .toDate();
      const endTime = moment
        .tz(
          `${video.publishDate} ${video.endTime}`,
          'YYYY-MM-DD HH:mm',
          'Asia/Kolkata',
        )
        .toDate();

      return currentTime >= startTime && currentTime <= endTime;
    });

    return ongoingVideos;
  }

  // Get all course-wise videos (upcoming, ongoing, completed, absent, prev-streamed)
  async getCourseVideos(courseId: string, studentId: string) {
    const currentTime = new Date();

    const course = await this.courseModel
      .findById(courseId)
      .populate('subjects');

    // const courseSubjects = course.subjects.map((sub) => sub.toString());

    const courseSubjects = await Promise.all(
      course.subjects.map(async (sub) => {
        const videos = await this.videoModel
          .find({ subject: sub, course: course })
          .populate('teacher')
          .populate('subject')
          .populate('chapter')
          .populate('course')
          .populate('topic')
          .populate({
            path: 'videoPolls',
            model: 'VideoPolls', // Provide the model name of VideoPoll
          })
          .populate({
            path: 'videoQuestions',
            populate: { path: 'student' },
          });

        // Filter for upcoming videos
        const upcomingVideos = videos
          .filter((video) => {
            const scheduledTime = moment
              .tz(
                `${video.publishDate} ${video.startTime}`,
                'YYYY-MM-DD HH:mm',
                'Asia/Kolkata',
              )
              .toDate();
            return scheduledTime > currentTime;
          })
          .sort((a, b) => {
            const timeA = new Date(a.publishDate);
            const timeB = new Date(b.publishDate);
            //@ts-ignore
            return timeA - timeB; // Descending order
          });

        // Filter for ongoing videos
        const ongoingVideos = videos
          .filter((video) => {
            const startTime = moment
              .tz(
                `${video.publishDate} ${video.startTime}`,
                'YYYY-MM-DD HH:mm',
                'Asia/Kolkata',
              )
              .toDate();
            const endTime = moment
              .tz(
                `${video.publishDate} ${video.endTime}`,
                'YYYY-MM-DD HH:mm',
                'Asia/Kolkata',
              )
              .toDate();

            return currentTime >= startTime && currentTime <= endTime;
          })
          .sort((a, b) => {
            const timeA = new Date(a.publishDate);
            const timeB = new Date(b.publishDate);
            //@ts-ignore
            return timeA - timeB; // Descending order
          });

        // Filter for old videos
        const previouslyStreamedVideos = videos.filter((video) => {
          const startTime = moment
            .tz(
              `${video.publishDate} ${video.startTime}`,
              'YYYY-MM-DD HH:mm',
              'Asia/Kolkata',
            )
            .toDate();
          const endTime = moment
            .tz(
              `${video.publishDate} ${video.endTime}`,
              'YYYY-MM-DD HH:mm',
              'Asia/Kolkata',
            )
            .toDate();

          return startTime < currentTime;
        });

        // Videos watched by the specific student
        let attendedLectures = await Promise.all(
          videos.map(async (video) => {
            // console.log(video.id);
            const attendance = await this.attendanceModel.findOne({
              lecture: video.id,
              student: studentId,
            });
            if (attendance) {
              return video;
            } else {
              return;
            }
          }),
        );
        attendedLectures = (await Promise.all(attendedLectures))
          .filter((v) => v)
          .sort((a, b) => {
            const timeA = new Date(a.publishDate);
            const timeB = new Date(b.publishDate);
            //@ts-ignore
            return timeB - timeA; // Descending order
          });

        // Videos not-watched by the specific student
        let absentLectures = await Promise.all(
          videos.map(async (video) => {
            const scheduledTime = moment
              .tz(
                `${video.publishDate} ${video.startTime}`,
                'YYYY-MM-DD HH:mm',
                'Asia/Kolkata',
              )
              .toDate();
            if (scheduledTime < currentTime) {
              const attendance = await this.attendanceModel.findOne({
                lecture: video.id,
                student: studentId,
              });
              if (attendance) {
                return;
              } else {
                return video;
              }
            }
          }),
        );

        absentLectures = (await Promise.all(absentLectures))
          .filter((v) => v)
          .sort((a, b) => {
            const timeA = new Date(a.publishDate);
            const timeB = new Date(b.publishDate);
            //@ts-ignore
            return timeB - timeA; // Descending order
          });

        // Sort the filtered videos by their starting time (latest first)
        // upcomingVideos.sort((a, b) => {
        //   const startTimeA = moment
        //     .tz(
        //       `${a.publishDate} ${a.startTime}`,
        //       'YYYY-MM-DD HH:mm',
        //       'Asia/Kolkata',
        //     )
        //     .toDate();
        //   const startTimeB = moment
        //     .tz(
        //       `${b.publishDate} ${b.startTime}`,
        //       'YYYY-MM-DD HH:mm',
        //       'Asia/Kolkata',
        //     )
        //     .toDate();
        //   return startTimeB - startTimeA;
        // });

        // ongoingVideos.sort((a, b) => {
        //   // Similar sorting logic as above for ongoing videos
        //   // ...

        //   return startTimeB - startTimeA;
        // });

        // attendedLectures.sort((a, b) => {
        //   // Similar sorting logic as above for attended lectures
        //   // ...

        //   return startTimeB - startTimeA;
        // });

        // absentLectures.sort((a, b) => {
        //   // Similar sorting logic as above for absent lectures
        //   // ...

        //   return startTimeB - startTimeA;
        // });

        // Returning a combined list or an object with all lists
        return {
          subject: sub,
          upcomingVideos,
          ongoingVideos,
          attendedLectures,
          absentLectures,
          previouslyStreamedVideos,
        };
      }),
    );

    return {
      course: course,
      subjects: courseSubjects,
    };
  }

  // Get course-wise upcoming videos
  async getCourseWiseUpcomingVideos(courseId: string): Promise<Video[]> {
    const videos = await this.videoModel
      .find({
        course: courseId,
      })
      .populate('course')
      .populate('subject')
      .populate('teacher');

    const currentTime = new Date();
    const upcomingVideos = videos.filter((video) => {
      const scheduledTime = moment
        .tz(
          `${video.publishDate} ${video.startTime}`,
          'YYYY-MM-DD HH:mm',
          'Asia/Kolkata',
        )
        .toDate();
      return scheduledTime > currentTime;
    });

    return upcomingVideos;
  }

  // Get course-wise ongoing videos
  async getCourseWiseOngoingVideos(courseId: string): Promise<Video[]> {
    const videos = await this.videoModel.find({
      course: courseId,
    });

    const currentTime = new Date();
    const ongoingVideos = videos.filter((video) => {
      const startTime = moment
        .tz(
          `${video.publishDate} ${video.startTime}`,
          'YYYY-MM-DD HH:mm',
          'Asia/Kolkata',
        )
        .toDate();
      const endTime = moment
        .tz(
          `${video.publishDate} ${video.endTime}`,
          'YYYY-MM-DD HH:mm',
          'Asia/Kolkata',
        )
        .toDate();

      return currentTime >= startTime && currentTime <= endTime;
    });

    return ongoingVideos;
  }

  // Get video by ID
  async getVideoById(id: string) {
    const video = await this.videoModel
      .findById(id)
      .populate('teacher')
      .populate('subject')
      .populate('chapter')
      .populate('course')
      .populate('topic')
      .populate({
        path: 'videoPolls',
        model: 'VideoPolls', // Provide the model name of VideoPoll
      })
      // Important
      .populate({
        path: 'videoQuestions',
        populate: { path: 'student' },
      });

    return {
      video,
    };
  }

  async processVideoWithFFmpeg(videoFile: Express.Multer.File) {
    return {
      data: videoFile,
      type: typeof videoFile,
      // message: `${videoFile.mimetype} file received`
    };
  }

  // async getVideoToPlay(fileName: string) {
  //   const urlToFind = `uploads/${fileName}`;
  async getVideoToPlay(id: string) {
    const video = await this.videoModel.findById(id);

    return video;
  }

  // Returns path of video for streaming purpose
  async getvideoPath(fileName: string) {
    const extractedFileName = fileName.split('/')[1];
    const pathToMovie = path.join(
      __dirname,
      '../../../../uploads',
      extractedFileName,
    );
    return {
      pathToVideo: pathToMovie,
    };
  }

  async getOldVideoPath(fileName: string) {
    const pathToMovie = path.join(__dirname, '../../../../uploads', fileName);
    return {
      pathToVideo: pathToMovie,
    };
  }

  // Stream the video
  private async streamVideo(filePath: string, streamKey: string) {
    const command = `ffmpeg -re -i '${filePath}' -c:v copy -c:a aac -ar 44100 -ac 1 -f flv 'rtmp://65.0.55.186/live/${streamKey}'`;

    console.log(command);

    try {
      const process = exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
        }
        console.log(`Stdout: ${stdout}`);
      });

      process.on('close', (code) => {
        console.log(`Streaming process exited with code ${code}`);
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Schedule uploaded video for streaming
  async scheduleVideo(filePath: string, scheduleTime: Date, streamKey: string) {
    const job = new cron.CronJob(scheduleTime, () => {
      this.streamVideo(filePath, streamKey);
    });

    console.log(`Video will stream at ${scheduleTime}`);

    job.start();
    this.scheduledJobs.push(job);
  }

  // // Generate thumbnail for uploaded video
  // async generateVideoThumbnail(filePath: string): Promise<string> {
  //   const thumbnailName = this.generateStreamKey();
  //   const outputPath = path.join(__dirname, '../../../../uploads');
  //   const screenshotPath = path.join(outputPath, `${thumbnailName}.jpg`);

  //   const thumbNailAwsURL = `https://helium-video-bucket.s3.ap-south-1.amazonaws.com/${thumbnailName}`;

  //   // Return a new Promise
  //   return new Promise(async (resolve, reject) => {
  //     // Generate the screenshot
  //     ffmpeg(filePath)
  //       .on('end', async () => {
  //         console.log('Screenshot taken');
  //         try {
  //           // Read and upload the file to S3 bucket
  //           await this.s3Client.send(
  //             new PutObjectCommand({
  //               Bucket: 'helium-video-bucket',
  //               Key: thumbnailName,
  //               Body: fs.readFileSync(screenshotPath),
  //             }),
  //           );

  //           // Optionally delete the local file
  //           fs.unlinkSync(screenshotPath);

  //           // Resolve the Promise with the URL
  //           resolve(thumbNailAwsURL);
  //         } catch (err) {
  //           console.error('Error in uploading screenshot:', err);
  //           reject(err); // Reject the Promise in case of an error
  //         }
  //       })
  //       .on('error', (err) => {
  //         console.error('Error in taking screenshot:', err);
  //         reject(err); // Reject the Promise in case of an error
  //       })
  //       .screenshots({
  //         timestamps: ['7%'],
  //         filename: `${thumbnailName}.jpg`,
  //         folder: outputPath,
  //       });
  //   });
  // }

  // Generate thumbnail for uploaded video
  async generateVideoThumbnail(
    filePath: string,
    streamKey: string,
  ): Promise<string> {
    const thumbnailName = streamKey;
    const outputPath = path.join(__dirname, '../../../../uploads');
    const screenshotPath = path.join(outputPath, `${thumbnailName}.jpg`);

    // Return a new Promise
    return new Promise(async (resolve, reject) => {
      // Generate the screenshot
      ffmpeg(filePath)
        .on('end', async () => {
          console.log('Screenshot taken');
          try {
            // Read and upload the file to Firebase Storage
            const bucket = firebaseAdmin.storage().bucket();
            const file = bucket.file(`${thumbnailName}.jpg`);
            await file.save(fs.readFileSync(screenshotPath), {
              metadata: {
                contentType: 'image/jpeg',
              },
            });

            // Get the signed URL
            const [thumbNailFirebaseURL] = await file.getSignedUrl({
              action: 'read',
              expires: '07-07-2024', // Set an appropriate expiration date
            });

            // Optionally delete the local file
            fs.unlinkSync(screenshotPath);

            // Resolve the Promise with the URL
            resolve(thumbNailFirebaseURL);
          } catch (err) {
            console.error('Error in uploading screenshot:', err);
            reject(err); // Reject the Promise in case of an error
          }
        })
        .on('error', (err) => {
          console.error('Error in taking screenshot:', err);
          reject(err); // Reject the Promise in case of an error
        })
        .screenshots({
          timestamps: ['7%'],
          filename: `${thumbnailName}.jpg`,
          folder: outputPath,
        });
    });
  }

  // Update video data entry with generated thumbnail path
  async addThumbnailUrl(thumbnailUrl: string, videoURL: string) {
    const video = await this.videoModel.findOneAndUpdate(
      { videoURL: videoURL },
      { $set: { thumbnailURL: thumbnailUrl } },
      { new: true },
    );
    return video;
  }

  // Private function to generate streamkey
  private generateStreamKey() {
    return crypto.randomBytes(14).toString('hex').slice(0, 14);
  }

  // Private function to generate streamkey
  // private generateStreamKey(filePath: string) {
  //   const splitArr = filePath.split('?');
  //   let lastElement = splitArr[0];
  //   lastElement = lastElement.split('_')[1];
  //   // lastElement = lastElement.split('-')[1]
  //   return lastElement;
  // }
}