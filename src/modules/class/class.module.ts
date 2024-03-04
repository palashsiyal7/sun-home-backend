import { Module } from '@nestjs/common';
import { ClassController } from './controllers/class.controller';
import { ClassService } from './service/class.service';
import { Class, ClassSchema } from './schema/class.schema';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]), // Add this line to configure Mongoose
  ],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}