export enum InteractionState {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  ABORTED = 'aborted'
}

export enum BaseInteractionKeys {
  ID = 'id',
  CHAT_ID = 'chatId',
  USERNAME = 'username',
  CURRENT_STEP_ID = 'currStepId',
  INTERACTION_STATE = 'interactionState',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt'
}

export type Interaction = {
  [BaseInteractionKeys.ID]: string | number
  [BaseInteractionKeys.CHAT_ID]: number
  [BaseInteractionKeys.USERNAME]?: string
  [BaseInteractionKeys.CURRENT_STEP_ID]: string
  [BaseInteractionKeys.INTERACTION_STATE]: InteractionState
  [BaseInteractionKeys.CREATED_AT]: string
  [BaseInteractionKeys.UPDATED_AT]: string
  [key: string]: unknown
}
