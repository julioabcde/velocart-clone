export const ERROR_MSG = {
  GENERAL: 'An unexpected error occurred!',
  CREATE: (obj: string) => `Failed to create new ${obj}!`,
  UPDATE: (obj: string) => `Failed to update ${obj}!`,
  DELETE: (obj: string) => `Failed to delete ${obj}!`,
} as const;

export const SUCCESS_MSG = {
  CREATE: (obj: string) => `${obj} has been created successfully!`,
  UPDATE: (obj: string) => `${obj} has been updated successfully!`,
  DELETE: (obj: string) => `${obj} has been deleted successfully!`,
} as const;