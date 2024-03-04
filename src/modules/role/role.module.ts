import { Module } from '@nestjs/common';
import { RoleService } from './service/role.service';
import { RoleController } from './controllers/role.controller';
import { RoleSchema } from './schema/role.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }])],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
