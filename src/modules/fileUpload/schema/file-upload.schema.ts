import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class File {
  @Prop()
  originalName: string;

  @Prop()
  fileName: string;

  @Prop()
  filePath: string;

  @Prop({ type: Types.ObjectId, ref: 'Subject' })
  subjectId: Types.ObjectId;
  
}

export const FileSchema = SchemaFactory.createForClass(File);
