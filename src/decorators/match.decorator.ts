import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
	return (object: unknown, propertyName: string) => {
		registerDecorator({
			name: 'match',
			target: object.constructor,
			propertyName,
			options: {
				...validationOptions,
				message:
					validationOptions?.message ||
					`${propertyName} must match ${property}`,
			},
			constraints: [property],
			validator: {
				validate(value: unknown, args: ValidationArguments) {
					const [relatedProperty] = args.constraints;
					const relatedValue = (
						args.object as Record<string, unknown>
					)[relatedProperty];
					return value === relatedValue;
				},
			},
		});
	};
}
