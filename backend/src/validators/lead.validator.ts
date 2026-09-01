export const validateLeadInput = (data: any) => {
  const errors: string[] = [];
  if (!data.first_name || data.first_name.trim() === '') errors.push('First name is required');
  if (!data.last_name || data.last_name.trim() === '') errors.push('Last name is required');
  if (!data.email || !data.email.includes('@')) errors.push('Valid email is required');
  return { isValid: errors.length === 0, errors };
};
