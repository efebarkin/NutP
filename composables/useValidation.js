import { ref } from 'vue';
import { z } from 'zod';

export function useValidation(schema) {
  const errors = ref({});
  const isValid = ref(true);

  const validate = (data) => {
    try {
      schema.parse(data);
      errors.value = {};
      isValid.value = true;
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.value = error.errors.reduce((acc, err) => {
          acc[err.path.join('.')] = err.message;
          return acc;
        }, {});
        isValid.value = false;
        return false;
      }
      throw error;
    }
  };

  const getError = (field) => {
    return errors.value[field];
  };

  const clearErrors = () => {
    errors.value = {};
    isValid.value = true;
  };

  return {
    errors,
    isValid,
    validate,
    getError,
    clearErrors,
  };
}
