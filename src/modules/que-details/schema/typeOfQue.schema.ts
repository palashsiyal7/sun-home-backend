import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class TypeOfQue {
  @Prop()
  typeOfQue: string;
  @Prop()
  isActive: boolean;
}

export const TypeOfQueSchema = SchemaFactory.createForClass(TypeOfQue);
