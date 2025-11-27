export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateEmail(email: string): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePassword(password: string): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateTaskTitle(title: string): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!title || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters' });
  } else if (title.length > 200) {
    errors.push({ field: 'title', message: 'Title must not exceed 200 characters' });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateTaskDescription(description: string): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!description || description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters' });
  } else if (description.length > 2000) {
    errors.push({ field: 'description', message: 'Description must not exceed 2000 characters' });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateTask(data: {
  title: string;
  description: string;
}): ValidationResult {
  const errors: ValidationError[] = [];
  
  const titleValidation = validateTaskTitle(data.title);
  const descValidation = validateTaskDescription(data.description);
  
  errors.push(...titleValidation.errors, ...descValidation.errors);
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
