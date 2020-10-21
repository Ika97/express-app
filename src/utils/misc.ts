export const DESCRIPTION = '';

export const isAppError = (error: Error): boolean => {
  if (error) {
    switch (error.message) {
      case 'NO_ROLE':
        return true;
      case 'NO_CODES':
        return true;
      default:
        return false;
    }
  }
  return true;
};
