export const MULTIPLE_CHOICE_DATA_PREFIX = 'mcq'
export const MULTIPLE_CHOICE_DATA_DIVIDER = '::'

export type MultipleChoiceDataSegments = {
  prefix: string
  stepId: string
  value: string
}

export const buildCallbackData = (stepId: string, value: string): string => {
  const segments: string[] = [MULTIPLE_CHOICE_DATA_PREFIX, stepId, value]
  return segments.join(MULTIPLE_CHOICE_DATA_DIVIDER)
}

export const parseCallbackData = (callbackData: string): MultipleChoiceDataSegments => {
  const segments = callbackData.split(MULTIPLE_CHOICE_DATA_DIVIDER)

  return {
    prefix: segments[0],
    stepId: segments[1],
    value: segments[2],
  }
}
