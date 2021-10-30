export enum InteractionState {
  ONGOING = 'ongoing'
}

export type Interaction = {
  chat_id: string
  curr_step_id: string
  interaction_state: InteractionState
}
