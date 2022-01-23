import { DecoratedContext } from '../../models/DecoratedContext'
import { BaseInteractionKeys, InteractionState } from '../../models/Interaction'
import { ProcessError } from '../../utils/Errors'
import { getMockContext, getMockDataStorageClient, getMockFastify } from '../../utils/testUtils'
import { updateInteraction } from '../interactionHandler'

describe('Interaction Handler', () => {
  const mockUpdateInteraction = jest.fn()
  const mockDataStorageClient = getMockDataStorageClient({ updateInteraction: mockUpdateInteraction })

  const mockService = getMockFastify({ dataStorageClient: mockDataStorageClient })

  const mockContext = getMockContext({
    interaction: { id: 'interaction_id' },
    currStep: { persistAs: 'persist_as' },
    nextStep: { id: 'next_step_id' },
  })

  it('should throw if data storage fails', async () => {
    mockUpdateInteraction.mockRejectedValue(new Error('error'))

    await expect(updateInteraction(mockService, mockContext, 'step_value'))
      .rejects
      .toEqual(new ProcessError('Error updating interaction', 'translation_errors.updateInteraction'))

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(1)

    expect(mockContext.t).toHaveBeenCalledTimes(1)
    expect(mockContext.t).toHaveBeenCalledWith('errors.updateInteraction')
  })

  it('should work if has next step', async () => {
    mockUpdateInteraction.mockResolvedValue(undefined)

    await updateInteraction(mockService, mockContext, 'step_value')

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(1)
    expect(mockUpdateInteraction).toHaveBeenCalledWith('interaction_id', {
      persist_as: 'step_value',
      [BaseInteractionKeys.CURRENT_STEP_ID]: 'next_step_id',
    })

    expect(mockContext.t).toHaveBeenCalledTimes(0)
  })

  it('should work if does not have next step', async () => {
    mockUpdateInteraction.mockResolvedValue(undefined)

    const ctx = { ...mockContext, nextStep: undefined } as unknown as DecoratedContext

    await updateInteraction(mockService, ctx, 'step_value')

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(1)
    expect(mockUpdateInteraction).toHaveBeenCalledWith('interaction_id', {
      persist_as: 'step_value',
      [BaseInteractionKeys.INTERACTION_STATE]: InteractionState.COMPLETED,
    })

    expect(mockContext.t).toHaveBeenCalledTimes(0)
  })
})
