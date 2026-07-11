export type ValidatorResult = {
  isValid: boolean
  errorMessage?: string
}

export function emailValidator(email: string): ValidatorResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email)
  return {
    isValid,
    errorMessage: isValid ? undefined : 'Enter a valid email address.',
  }
}

export function numberValidator(value: string): ValidatorResult {
  const isValid = !isNaN(Number(value))
  return {
    isValid,
    errorMessage: isValid ? undefined : 'Value must be a number.',
  }
}

export function onlyLettersValidator(value: string): ValidatorResult {
  const isValid = /^[A-Za-z]+$/.test(value)
  return {
    isValid,
    errorMessage: isValid ? undefined : 'Value must contain only letters and spaces.',
  }
}
