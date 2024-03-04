import { Chapter } from "src/modules/chapter/schema/chapter.schema";

export class SubjectForApiDto {
    _id : string;
    subjectName: string;
    isActive: boolean;
    chapters: Chapter
}