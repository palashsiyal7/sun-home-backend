import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Class {
  @Prop()
  className: string;

  @Prop()
  isActive: boolean;

}

export const ClassSchema = SchemaFactory.createForClass(Class);
