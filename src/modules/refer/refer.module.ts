import { Module } from '@nestjs/common';
import { ReferService } from './refer.service';
import { ReferController } from './refer.controller';
import { ReferSchema } from './schema/refer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../user/schema/user.schema';
import { Role } from '../role/schema/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Refer', schema: ReferSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: User }]),
    MongooseModule.forFeature([{ name: 'Role', schema: Role }]),
  ],
  controllers: [ReferController],
  providers: [ReferService],
})
export class ReferModule {}
