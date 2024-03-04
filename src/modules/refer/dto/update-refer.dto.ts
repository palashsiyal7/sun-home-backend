import { PartialType } from '@nestjs/mapped-types';
import { CreateReferDto } from './create-refer.dto';

export class UpdateReferDto extends PartialType(CreateReferDto) {}
