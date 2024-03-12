import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsFilePath = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFilePath',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === null || value === undefined) return true;
          return typeof value === 'string' && /^[a-zA-Z0-9\/\-_]+$/.test(value);
        },
        defaultMessage: (args: ValidationArguments) =>
          `Property ${args.property} is not a valid file path`,
      },
    });
  };
};
