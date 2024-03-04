import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
  Req,
  HttpStatus,
  ParseFilePipe,
  FileTypeValidator,
  Delete,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
import { VideoService } from '../service/video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadVideoDto } from '../dto/upload-video.dto';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment-timezone';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Controller()
export class VideoController {
  constructor(private videoService: VideoService) {}

  //Get all videos.
  @Get()
  async getAllVideos() {
    const videoData = await this.videoService.getAllVideos();
    return videoData;
  }

  // Get all upcoming videos
  @Get('/upcoming-videos')
  async getUpcomingVideos() {
    const upcomingVideos = await this.videoService.getUpcomingVideos();
    return upcomingVideos;
  }

  // Get all ongoing videos
  @Get('/ongoing-videos')
  async getOngoingVideos() {
    const ongoingVideos = await this.videoService.getOngoingVideos();
    return ongoingVideos;
  }

  // Get all course-wise videos
  @Get('/courses/:courseId/:studentId/all-videos')
  async getCourseVideos(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    try {
      const videos = await this.videoService.getCourseVideos(
        courseId,
        studentId,
      );
      return {
        success: true,
        status_code: 200,
        message: 'Videos retrieved successfully',
        data: videos,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: false,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }

  // Get course-wise upcoming videos
  @Get('/courses/:courseId/upcoming-videos')
  async getCourseWiseUpcomingVideos(@Param('courseId') courseId: string) {
    const videos =
      await this.videoService.getCourseWiseUpcomingVideos(courseId);
    return videos;
  }

  // Get course-wise ongoing videos
  @Get('/courses/:courseId/upcoming-videos')
  async getCourseWiseOngoingVideos(@Param('courseId') courseId: string) {
    const videos = await this.videoService.getCourseWiseOngoingVideos(courseId);
    return videos;
  }

  @Get(':id')
  async getVideoById(@Param('id') id: string) {
    try {
      const videoById = await this.videoService.getVideoById(id);
      return videoById;
    } catch (err) {
      return new NotFoundException();
    }
  }

  // @Get('getvideo/:fileName')
  @Get('getvideo/:id')
  async streamVideo(
    // @Param('fileName') fileName: string,
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // const video = await this.videoService.getVideoToPlay(fileName);
    const video = await this.videoService.getVideoToPlay(id);

    console.log(id);
    console.log(video);

    // const videoPath = await this.videoService.getOldVideoPath(fileName);

    // return videoPath
    // this.videoService.streamVideo(videoPath.pathToVideo)

    const currentTime = new Date();
    // console.log(currentTime);
    const scheduledTime = moment
      .tz(
        `${video.publishDate} ${video.startTime}`,
        'YYYY-MM-DD HH:mm',
        'Asia/Kolkata',
      )
      .toDate();
    // console.log(scheduledTime);

    if (scheduledTime > currentTime) {
      console.log(`Video will be schedule at ${scheduledTime}`);
      // this.videoService.scheduleVideo(videoPath.pathToVideo, scheduledTime);
    } else {
      // const filePath = path.join(__dirname, '../../../../uploads', fileName);
      const filePath = video.videoURL;

      console.log(filePath);
      // Ensure the file exists
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        console.log('stat', stat);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = end - start + 1;
          const file = fs.createReadStream(filePath, { start, end });
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
          };

          res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
          file.pipe(res);
        } else {
          const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
          };
          res.writeHead(HttpStatus.OK, head);
          fs.createReadStream(filePath).pipe(res);
        }
      } else {
        // If the file does not exist, send a 404 response
        res.status(HttpStatus.NOT_FOUND).send('Video not found');
        console.log('video not found');
      }
    }
  }

  private extractStreamKey(videoURL: string) {
    const splitArr = videoURL.split('hls/');

    // Last element of splitArr
    let lastElement = splitArr[splitArr.length - 1];
    lastElement = lastElement.split('.')[0];

    console.log(lastElement);

    return lastElement;
  }

  // For S3 BUCKET
  // @Post('fileUpload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new FileTypeValidator({
  //           fileType:
  //             'video/mp4' ||
  //             'video/avi' ||
  //             'video/mov' ||
  //             'video/wmv' ||
  //             'video/mkv' ||
  //             'video/x-matroska',
  //         }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  //   @Body(ValidationPipe) uploadVideoDto: UploadVideoDto,
  // ) {

  //   const uploadedToS3 = await this.videoService.uploadToS3(
  //     uploadVideoDto.title,
  //     file.buffer,
  //   );

  //   const fileKey = uploadedToS3.updatedFileName

  //   const fileVideoURL = `https://helium-video-bucket.s3.ap-south-1.amazonaws.com/${fileKey}`;

  //   const responseObject = {
  //     ...uploadVideoDto,
  //     videoURL: fileVideoURL,
  //   };

  //   console.log(responseObject.videoURL);

  //   const streamKey = this.generateStreamKey();

  //   const savedVideoSession = await this.videoService.createVideo(
  //     responseObject,
  //     streamKey,
  //   );

  //   // Generate thumbnail using incoming video
  //   const generateThumbnail =
  //     await this.videoService.generateVideoThumbnail(fileVideoURL);

  //   // Update video entry with thumbnail
  //   const videoWithThumbnailUpdated = await this.videoService.addThumbnailUrl(
  //     generateThumbnail,
  //     fileVideoURL,
  //   );

  //   // Update teacher video array with fileVideoURL
  //   const updatedTeacher = await this.videoService.updateTeacherVideoArr(
  //     fileVideoURL,
  //     uploadVideoDto.teacher,
  //   );

  //   const currentTime = new Date();

  //   const scheduledTime = moment
  //     .tz(
  //       `${savedVideoSession.createdVideo.publishDate} ${savedVideoSession.createdVideo.startTime}`,
  //       'YYYY-MM-DD HH:mm',
  //       'Asia/Kolkata',
  //     )
  //     .toDate();

  //   if (scheduledTime > currentTime) {
  //     this.videoService.scheduleVideo(fileVideoURL, scheduledTime, streamKey);
  //   }

  //   return {
  //     videoEntry: videoWithThumbnailUpdated,
  //     updatedTeacher: updatedTeacher,
  //   };
  // }

  @Post('fileUpload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:
              'video/mp4' ||
              'video/avi' ||
              'video/mov' ||
              'video/wmv' ||
              'video/mkv' ||
              'video/x-matroska',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body(ValidationPipe) uploadVideoDto: UploadVideoDto,
  ) {
    const uploadToFirebase = await this.videoService.uploadVideoToFirebase(
      file,
      uploadVideoDto.title,
    );

    const fileVideoURL = uploadToFirebase.url;

    const responseObject = {
      ...uploadVideoDto,
      videoURL: fileVideoURL,
    };

    console.log(responseObject.videoURL);

    const streamKey = this.generateStreamKey();

    const savedVideoSession = await this.videoService.createVideo(
      responseObject,
      streamKey,
    );

    // Generate thumbnail using incoming video
    // const generateThumbnail = await this.videoService.generateVideoThumbnail(
    //   fileVideoURL,
    //   streamKey,
    // );

    // // Update video entry with thumbnail
    // const videoWithThumbnailUpdated = await this.videoService.addThumbnailUrl(
    //   generateThumbnail,
    //   fileVideoURL,
    // );

    // Update teacher video array with fileVideoURL
    const updatedTeacher = await this.videoService.updateTeacherVideoArr(
      fileVideoURL,
      uploadVideoDto.teacher,
    );

    const currentTime = new Date();

    const scheduledTime = moment
      .tz(
        `${savedVideoSession.createdVideo.publishDate} ${savedVideoSession.createdVideo.startTime}`,
        'YYYY-MM-DD HH:mm',
        'Asia/Kolkata',
      )
      .toDate();

    if (scheduledTime > currentTime) {
      this.videoService.scheduleVideo(fileVideoURL, scheduledTime, streamKey);
    }

    return {
      videoEntry: savedVideoSession,
      updatedTeacher: updatedTeacher,
    };
  }

  @Post('rescheduleVideo')
  async rescheduleVideo(@Body(ValidationPipe) uploadVideoDto: UploadVideoDto) {
    const extractedVideo = await this.videoService.getVideoByURL(
      uploadVideoDto.videoURL,
      uploadVideoDto.thumbnailURL,
    );

    // const updatedVideo = await this.videoService.rescheduleVideoForStreaming(
    //   uploadVideoDto.videoURL,
    //   uploadVideoDto.publishDate,
    //   uploadVideoDto.startTime,
    //   uploadVideoDto.endTime,
    //   uploadVideoDto.title,
    //   uploadVideoDto.description,
    // );

    const currentTime = new Date();

    const streamKey = this.extractStreamKey(extractedVideo.streamingURL);

    const createNewVideoEntry = await this.videoService.createVideo(
      uploadVideoDto,
      streamKey,
    );

    const scheduledTime = moment
      .tz(
        `${uploadVideoDto.publishDate} ${uploadVideoDto.startTime}`,
        'YYYY-MM-DD HH:mm',
        'Asia/Kolkata',
      )
      .toDate();

    console.log(scheduledTime);
    console.log(currentTime);

    // send video to schedule for streaming
    if (scheduledTime > currentTime) {
      this.videoService.scheduleVideo(
        uploadVideoDto.videoURL,
        scheduledTime,
        streamKey,
      );
    }

    return {
      message: `Video rescheduled at ${uploadVideoDto.startTime} on ${uploadVideoDto.publishDate} with streamKey ${streamKey}`,
      createdVideoEntry: createNewVideoEntry,
    };
  }

  @Post('addVideoWithThumbnailUrls')
  async addVideoWithThumbnailUrls(
    @Body(ValidationPipe) uploadVideoDto: UploadVideoDto,
  ) {
    const streamKey = this.generateStreamKey();

    const createdVideoEntry = await this.videoService.createVideo(
      uploadVideoDto,
      streamKey,
    );

    const updatedTeacher = await this.videoService.updateTeacherVideoArr(
      uploadVideoDto.videoURL,
      uploadVideoDto.teacher,
    );

    if (
      uploadVideoDto.publishDate &&
      uploadVideoDto.startTime &&
      uploadVideoDto.endTime
    ) {
      const currentTime = new Date();
      const scheduledTime = moment
        .tz(
          `${uploadVideoDto.publishDate} ${uploadVideoDto.startTime}`,
          'YYYY-MM-DD HH:mm',
          'Asia/Kolkata',
        )
        .toDate();

      if (scheduledTime > currentTime) {
        this.videoService.scheduleVideo(
          uploadVideoDto.videoURL,
          scheduledTime,
          streamKey,
        );
      }

      return {
        message: `Video scheduled at ${scheduledTime} with streamKey ${streamKey}`,
        createdVideoEntry: createdVideoEntry,
        updatedTeacher,
      };
    }

    return {
      message: `Video entry saved successfully to database`,
      createdVideoEntry,
      updatedTeacher,
    };
  }

  private async sendVideoToPlay(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = path.join(__dirname, 'path_to_videos', fileName);

    // Ensure the file exists
    if (fs.existsSync(filePath)) {
      // Set the appropriate content type, e.g., 'video/mp4'
      res.contentType('video/mp4');

      // Create a read stream and pipe it to the response
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } else {
      // If the file does not exist, send a 404 response
      res.status(404).send('Video not found');
    }
  }

  private generateStreamKey() {
    return crypto.randomBytes(14).toString('hex').slice(0, 14);
  }
}