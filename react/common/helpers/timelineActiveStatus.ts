import type { requestsStatuses } from '../utils'

type Status = typeof requestsStatuses[keyof typeof requestsStatuses]

type Request = {
  status: Status
}
type StepStatusDictionary = {
  [key in Status]: number
}

/**
 * get current step status as number of step.
 * @param param.status - status of request ("New" , "Processing" , "Picked up from client" , "Pending verification" , "Approved" , "Partially approved" , "Denied" , "Refunded").
 * @returns 1 if status is "New" , 2 if status is "Processing" , 3 if status is "Picked up from client" , 4 if status is "Pending verification" , 5 if status is "Approved" , 5 if status is "Partially approved" , 5 if status is "Denied" , 6 if status is "Refunded".
 */
const getCurrentStep = ({ status }: Request): number => {
  const stepStatusDictionary: StepStatusDictionary = {
    New: 1,
    Processing: 2,
    'Picked up from client': 3,
    'Pending verification': 4,
    'Partially approved': 5,
    Approved: 5,
    Denied: 5,
    Refunded: 6,
  } as const

  return stepStatusDictionary[status]
}

/**
 *
 * @param param.status - status of request ("New" , "Processing" , "Picked up from client" , "Pending verification" , "Approved" , "Partially approved" , "Denied" , "Refunded").
 * @param param.step - current step of request.
 * @returns 1 | 0
 */
const isCurrentStepActive = ({
  status,
  step,
}: Request & { step: number }): 1 | 0 => {
  return getCurrentStep({ status }) >= step ? 1 : 0
}

export default isCurrentStepActive
