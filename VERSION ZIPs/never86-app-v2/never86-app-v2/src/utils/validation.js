export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateNumber = (value, min = null, max = null) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  return true;
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value, 0);
};

export const validateTime = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const validateUsername = (username) => {
  // Username should be 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const getFieldError = (value, rules) => {
  for (const rule of rules) {
    if (rule.required && !validateRequired(value)) {
      return rule.requiredMessage || 'This field is required';
    }
    if (rule.email && !validateEmail(value)) {
      return rule.emailMessage || 'Please enter a valid email address';
    }
    if (rule.minLength && value.length < rule.minLength) {
      return rule.minLengthMessage || `Minimum length is ${rule.minLength} characters`;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.maxLengthMessage || `Maximum length is ${rule.maxLength} characters`;
    }
    if (rule.min !== undefined && !validateNumber(value, rule.min)) {
      return rule.minMessage || `Value must be at least ${rule.min}`;
    }
    if (rule.max !== undefined && !validateNumber(value, null, rule.max)) {
      return rule.maxMessage || `Value must be at most ${rule.max}`;
    }
    if (rule.positive && !validatePositiveNumber(value)) {
      return rule.positiveMessage || 'Value must be positive';
    }
    if (rule.time && !validateTime(value)) {
      return rule.timeMessage || 'Please enter a valid time (HH:MM)';
    }
    if (rule.custom && !rule.custom(value)) {
      return rule.customMessage || 'Invalid value';
    }
  }
  return null;
};

export default {
  validateEmail,
  validateRequired,
  validateNumber,
  validatePositiveNumber,
  validateTime,
  validateUsername,
  getFieldError
};

