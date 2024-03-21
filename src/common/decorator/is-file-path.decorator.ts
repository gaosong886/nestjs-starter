import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * 自定义装饰器：校验参数是否是合法的文件路径
 * @param validationOptions class-validator 校验选项
 */
export function IsFilePath(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFilePath',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          // 允许为空
          if (value === null || value === undefined) return true;
          return typeof value === 'string' && /^[a-zA-Z0-9\/\-_]+$/.test(value);
        },
        defaultMessage: (args: ValidationArguments) =>
          `Property ${args.property} is not a valid file path`,
      },
    });
  };
}
