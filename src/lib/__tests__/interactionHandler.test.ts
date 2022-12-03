import axios from 'axios'
import { FastifyInstance } from 'fastify'

import { DecoratedContext } from '../../models/DecoratedContext'
import { BaseInteractionKeys, InteractionState } from '../../models/Interaction'
import { ProcessError } from '../../utils/Errors'
import { getMockContext, getMockDataStorageClient, getMockFastify } from '../../utils/testUtils'
import { updateInteraction } from '../interactionHandler'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Interaction Handler', () => {
  const mockUpdateInteraction = jest.fn()
  const mockGetInteractionById = jest.fn()
  const mockDataStorageClient = getMockDataStorageClient({
    updateInteraction: mockUpdateInteraction,
    getInteractionById: mockGetInteractionById,
  })

  const mockService = getMockFastify({ dataStorageClient: mockDataStorageClient })

  const mockConfig = { hooks: { onComplete: { url: 'test-url' } } }

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

    const ctx = { ...mockContext, isInteractionCompleted: false } as unknown as DecoratedContext

    await updateInteraction(mockService, ctx, 'step_value')

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(1)
    expect(mockUpdateInteraction).toHaveBeenCalledWith('interaction_id', {
      persist_as: 'step_value',
      [BaseInteractionKeys.CURRENT_STEP_ID]: 'next_step_id',
    })

    expect(mockContext.t).toHaveBeenCalledTimes(0)
  })

  it('should work if does not have next step', async () => {
    mockUpdateInteraction.mockResolvedValue(undefined)

    const ctx = { ...mockContext, nextStep: undefined, isInteractionCompleted: true } as unknown as DecoratedContext

    await updateInteraction(mockService, ctx, 'step_value')

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(1)
    expect(mockUpdateInteraction).toHaveBeenCalledWith('interaction_id', {
      persist_as: 'step_value',
      [BaseInteractionKeys.INTERACTION_STATE]: InteractionState.COMPLETED,
    })

    expect(mockContext.t).toHaveBeenCalledTimes(0)
  })

  it('should work and send hook with error', async () => {
    mockUpdateInteraction.mockResolvedValue(undefined)
    mockGetInteractionById.mockResolvedValue({ complete: 'interaction' })

    mockedAxios.post.mockRejectedValue(new Error('error'))

    const mockFastify = { ...mockService, configuration: mockConfig } as unknown as FastifyInstance
    const ctx = { ...mockContext, nextStep: undefined, isInteractionCompleted: true } as unknown as DecoratedContext

    await updateInteraction(mockFastify, ctx, 'step_value')

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(1)
    expect(mockUpdateInteraction).toHaveBeenCalledWith('interaction_id', {
      persist_as: 'step_value',
      [BaseInteractionKeys.INTERACTION_STATE]: InteractionState.COMPLETED,
    })

    expect(mockGetInteractionById).toHaveBeenCalledTimes(1)
    expect(mockGetInteractionById).toHaveBeenCalledWith('interaction_id')

    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(mockedAxios.post).toHaveBeenCalledWith('test-url', { complete: 'interaction' })

    expect(mockContext.t).toHaveBeenCalledTimes(0)
  })

  it('should work and send hook without error', async () => {
    mockUpdateInteraction.mockResolvedValue(undefined)
    mockGetInteractionById.mockResolvedValue({ complete: 'interaction' })
    mockedAxios.post.mockResolvedValue(undefined)

    const mockFastify = { ...mockService, configuration: mockConfig } as unknown as FastifyInstance
    const ctx = { ...mockContext, nextStep: undefined, isInteractionCompleted: true } as unknown as DecoratedContext

    await updateInteraction(mockFastify, ctx, 'step_value')

    expect(mockUpdateInteraction).toHaveBeenCalledTimes(1)
    expect(mockUpdateInteraction).toHaveBeenCalledWith('interaction_id', {
      persist_as: 'step_value',
      [BaseInteractionKeys.INTERACTION_STATE]: InteractionState.COMPLETED,
    })

    expect(mockGetInteractionById).toHaveBeenCalledTimes(1)
    expect(mockGetInteractionById).toHaveBeenCalledWith('interaction_id')

    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(mockedAxios.post).toHaveBeenCalledWith('test-url', { complete: 'interaction' })

    expect(mockContext.t).toHaveBeenCalledTimes(0)
  })
})
