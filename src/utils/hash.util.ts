import * as bcrypt from 'bcrypt';

export const hash = async (value: string): Promise<string> => {
	const salt = await bcrypt.genSalt();
	return bcrypt.hash(value, salt);
};

export const isMatch = async (
	value: string,
	hash: string
): Promise<boolean> => {
	return bcrypt.compare(value, hash);
};