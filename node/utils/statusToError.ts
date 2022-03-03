import { AuthenticationError, ForbiddenError, UserInputError } from '@vtex/api'

type StatusToError = {
  status: number
  message: string
}

export function statusToError(response: Required<StatusToError>): Error {
  if (!response) {
    throw new Error('statusToError: response is required')
  }

  const { status, message } = response

  if (status === 401) {
    throw new AuthenticationError(message)
  }

  if (status === 403) {
    throw new ForbiddenError(message)
  }

  if (status === 400) {
    throw new UserInputError(message)
  }

  throw new Error(message)
}
