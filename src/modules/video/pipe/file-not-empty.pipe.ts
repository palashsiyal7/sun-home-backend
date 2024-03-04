import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'fileNotEmpty', async: false })
export class FileNotEmpty implements ValidatorConstraintInterface {
  validate(file: Express.Multer.File, args: ValidationArguments) {
    return file !== undefined && file !== null; // You might want to add more file-related validations here
  }

  defaultMessage(args: ValidationArguments) {
    return 'File should not be empty.';
  }
}