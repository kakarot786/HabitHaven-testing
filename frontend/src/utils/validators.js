


export const validateLogin = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};


export const validateRegister = (values) => {
  const errors = {};

  if (!values.fullName) {
    errors.fullName = 'Full name is required';
  } else if (values.fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!values.username) {
    errors.username = 'Username is required';
  } else if (values.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};


export const validateTask = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = 'Title is required';
  } else if (values.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!values.description) {
    errors.description = 'Description is required';
  } else if (values.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!values.date) {
    errors.date = 'Date is required';
  }

  return errors;
};


export const validateGroup = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Group name is required';
  } else if (values.name.length < 3) {
    errors.name = 'Group name must be at least 3 characters';
  }

  if (!values.description) {
    errors.description = 'Description is required';
  } else if (values.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  return errors;
};

export default {
  validateLogin,
  validateRegister,
  validateTask,
  validateGroup,
};
