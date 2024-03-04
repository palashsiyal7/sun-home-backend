import { IsNotEmpty, IsString } from "class-validator";

export class AttendanceEntryDto {
    @IsNotEmpty()
    @IsString()
    courseId: string;

    @IsNotEmpty()
    @IsString()
    videoId: string

    @IsNotEmpty()
    @IsString()
    userId: string
}