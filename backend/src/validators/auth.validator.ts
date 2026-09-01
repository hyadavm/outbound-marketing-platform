export const validateRegisterInput = (data: any) => {
  const errors: string[] = [];
  if (!data.email || !data.email.includes('@')) errors.push('Valid email is required');
  if (!data.password || data.password.length < 6) errors.push('Password must be at least 6 characters');
  if (!data.name || data.name.trim().length === 0) errors.push('Name is required');
  return { isValid: errors.length === 0, errors };
};

export const validateLoginInput = (data: any) => {
  const errors: string[] = [];
  if (!data.email || !data.email.includes('@')) errors.push('Valid email is required');
  if (!data.password) errors.push('Password is required');
  return { isValid: errors.length === 0, errors };
};
