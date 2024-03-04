import { Module } from '@nestjs/common';
import { QueDetailsController } from './controllers/que-details.controller';
import { QueDetailsService } from './service/que-details.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoOfQue, NoOfQueSchema } from './schema/noOfQue.schema';
import { TypeOfQue, TypeOfQueSchema } from './schema/typeOfQue.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NoOfQue.name, schema: NoOfQueSchema }]),
    MongooseModule.forFeature([{ name: TypeOfQue.name, schema: TypeOfQueSchema }]),
  ],
  controllers: [QueDetailsController],
  providers: [QueDetailsService]
})
export class QueDetailsModule {}
