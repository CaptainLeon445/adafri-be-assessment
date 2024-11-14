export const isProductionEnv = process.env.NODE_ENV === 'production';
export const isDevelopmentEnv = process.env.NODE_ENV === 'development';
export const isTestENV = process.env.NODE_ENV === 'test';

export const isValuePresent = (value: any): boolean => {
  return value !== '' && value !== null && value !== undefined;
};
