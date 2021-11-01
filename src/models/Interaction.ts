export enum InteractionState {
  ONGOING = 'ongoing'
}

export type Interaction = {
  id: string
  chatId: string
  currStepId: string
  interactionState: InteractionState
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}
