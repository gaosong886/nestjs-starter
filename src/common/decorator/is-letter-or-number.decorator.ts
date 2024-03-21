import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * 自定义装饰器：校验参数是否只包含中英文或数字
 * @param validationOptions class-validator 校验选项
 */
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
          // 允许空值和空字符串
          if (value === null || value === undefined || value === '')
            return true;
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
