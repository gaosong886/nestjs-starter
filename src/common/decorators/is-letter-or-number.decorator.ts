import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsLetterOrNumber = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsLetterOrNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === null || value === undefined) return true;
          return (
            typeof value === 'string' &&
            /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `Property ${args.property} must contain only numbers, Chinese or English letters.`;
        },
      },
    });
  };
};
