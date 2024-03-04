import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from 'src/modules/question/schema/question.schema';
import { File } from '../schema/file-upload.schema';
const fs = require('fs');

@Injectable()
export class FileUploadService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<File>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async saveFile(file, subjectId: string): Promise<File> {
    const createdFile = new this.fileModel({
      originalName: file.originalname,
      fileName: file.filename,
      filePath: file.path,
      subjectId: subjectId,
    });
    const savedfile = await createdFile.save();
    return savedfile;
  }

  async getAllFiles(): Promise<File[]> {
    return this.fileModel.find().exec();
  }

  async findByFileId(id: string): Promise<File> {
    const file = await this.fileModel.findById(id);

    if (!file) {
      throw new Error('File not found.');
    }

    return file;
  }
  async findBySubjectId(id: string): Promise<File[]> {
    const file = await this.fileModel.find({ subjectId: id });

    if (!file) {
      throw new Error('File not found.');
    }

    return file;
  }

  async delete(id: string): Promise<boolean> {
    // Find and delete the chapter
    const deletedFile = await this.fileModel.findByIdAndDelete(id).exec();

    if (!deletedFile) {
      // If the chapter doesn't exist, return false
      return false;
    }

    // Delete the file from the "uploads" folder
    //@ts-ignore
    const filePath = `./uploads/${deletedFile.fileName}`;
    // Replace the above path with the correct path to your "uploads" folder

    try {
      // Use the fs.unlinkSync method to delete the file synchronously
      fs.unlinkSync(filePath);
      console.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file: ${filePath}`, error);
    }

    //@ts-ignore
    const fileIdString = deletedFile._id.toString();

    await this.questionModel.deleteMany({ file: fileIdString }).exec();

    return true;
  }
}
