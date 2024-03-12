import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsStringStrict = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStringStrict',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === null || value === undefined) return true;
          return (
            typeof value === 'string' &&
            /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `Property ${args.property} must contain only letters, numbers and underscores (_).`;
        },
      },
    });
  };
};
