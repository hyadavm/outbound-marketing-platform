export const validateCampaignInput = (data: any) => {
  const errors: string[] = [];
  if (!data.name || data.name.trim() === '') errors.push('Campaign name is required');
  if (!data.subject_line || data.subject_line.trim() === '') errors.push('Subject line is required');
  return { isValid: errors.length === 0, errors };
};
