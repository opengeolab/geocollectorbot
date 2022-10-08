import axios from 'axios'
import { MiddlewareFn } from 'telegraf'
import { Message } from 'telegraf/typings/core/types/typegram'

import * as messageHandler from '../../lib/messageHandler'
import { StepProps } from '../../lib/messageHandler'
import { DecoratedContext } from '../../models/DecoratedContext'
import { MediaStepSubtype, StepType } from '../../models/Flow'
import { ProcessError } from '../../utils/Errors'
import { getMockContext, getMockFastify, getMockMediaStorageClient } from '../../utils/testUtils'
import { buildMediaHandler } from '../mediaHandler'

jest.mock('axios', () => ({ get: jest.fn() }))

describe('Photo handler', () => {
  const mockHandleIncomingMessage = jest.spyOn(messageHandler, 'handleIncomingMessage')

  const mockSaveMedia = jest.fn()
  const mockMediaStorageClient = getMockMediaStorageClient({ saveMedia: mockSaveMedia })

  const mockService = getMockFastify({ mediaStorageClient: mockMediaStorageClient })

  const mockGetFile = jest.fn()
  const mockGetFileLink = jest.fn()
  const mockTelegram = { getFile: mockGetFile, getFileLink: mockGetFileLink }

  const mockContext = getMockContext({ telegram: mockTelegram })

  let handler: MiddlewareFn<DecoratedContext>

  beforeEach(() => { handler = buildMediaHandler(mockService, { mediaType: MediaStepSubtype.PHOTO }) as MiddlewareFn<DecoratedContext> })

  it('should build correctly', async () => {
    mockHandleIncomingMessage.mockResolvedValue()

    await handler(mockContext, jest.fn())

    expect(mockHandleIncomingMessage).toHaveBeenCalledTimes(1)
    expect(mockHandleIncomingMessage).toHaveBeenCalledWith(mockService, mockContext, expect.any(Function), expect.any(Function))
  })

  describe('stepValidator', () => {
    it('should throw if wrong step type', async () => {
      mockHandleIncomingMessage.mockResolvedValue()

      await handler(mockContext, jest.fn())

      const props = {
        service: mockService,
        ctx: mockContext,
        currStep: { config: { type: 'wrong_type' } },
      } as unknown as StepProps<Message.TextMessage>

      const [[,, valueBuilder]] = mockHandleIncomingMessage.mock.calls

      expect(() => valueBuilder(props))
        .toThrow(new ProcessError('Wrong current step type', 'translation_errors.wrongStepType'))

      expect(mockContext.t).toHaveBeenCalledTimes(1)
      expect(mockContext.t).toHaveBeenCalledWith('errors.wrongStepType')
    })

    it('should throw if wrong media type', async () => {
      mockHandleIncomingMessage.mockResolvedValue()

      await handler(mockContext, jest.fn())

      const props = {
        service: mockService,
        ctx: mockContext,
        currStep: { config: { type: StepType.SINGLE_MEDIA, acceptOnly: MediaStepSubtype.VIDEO } },
      } as unknown as StepProps<Message.TextMessage>

      const [[,, valueBuilder]] = mockHandleIncomingMessage.mock.calls

      expect(() => valueBuilder(props))
        .toThrow(new ProcessError('Wrong current step type', 'translation_errors.wrongStepType'))

      expect(mockContext.t).toHaveBeenCalledTimes(1)
      expect(mockContext.t).toHaveBeenCalledWith('errors.wrongMediaType', { acceptedMediaType: MediaStepSubtype.VIDEO })
    })

    it('should return if right step type', async () => {
      mockHandleIncomingMessage.mockResolvedValue()

      await handler(mockContext, jest.fn())

      const props = {
        service: mockService,
        ctx: mockContext,
        currStep: { config: { type: StepType.SINGLE_MEDIA } },
      } as unknown as StepProps<Message.TextMessage>

      const [[,, valueBuilder]] = mockHandleIncomingMessage.mock.calls
      valueBuilder(props)

      expect(mockContext.t).toHaveBeenCalledTimes(0)
    })
  })

  describe('stepValueBuilder', () => {
    it('should throw if file path not found', async () => {
      mockHandleIncomingMessage.mockResolvedValue()
      mockGetFile.mockResolvedValue({})

      await handler(mockContext, jest.fn())

      const props = {
        service: mockService,
        ctx: mockContext,
        message: { photo: [{ file_id: 'file_id' }] },
      } as unknown as StepProps<Message.PhotoMessage>

      const [[,,, valueBuilder]] = mockHandleIncomingMessage.mock.calls

      await expect(valueBuilder(props))
        .rejects
        .toEqual(new ProcessError('Error saving media', 'translation_errors.mediaSaving'))

      expect(mockGetFile).toHaveBeenCalledTimes(1)
      expect(mockGetFile).toHaveBeenCalledWith('file_id')

      expect(mockGetFileLink).toHaveBeenCalledTimes(0)
      expect(mockSaveMedia).toHaveBeenCalledTimes(0)
      expect(axios.get).toHaveBeenCalledTimes(0)
    })

    it('should throw if get throws', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('get_error'))
      mockGetFile.mockResolvedValue({ file_path: 'file_path.pdf' })
      mockGetFileLink.mockResolvedValue({ href: 'file_link' })
      mockSaveMedia.mockResolvedValue('save_media_result')

      mockHandleIncomingMessage.mockResolvedValue()

      await handler(mockContext, jest.fn())

      const props = {
        service: mockService,
        ctx: mockContext,
        message: { photo: [{ file_id: 'file_id' }] },
      } as unknown as StepProps<Message.PhotoMessage>

      const [[,,, valueBuilder]] = mockHandleIncomingMessage.mock.calls
      await expect(valueBuilder(props))
        .rejects
        .toEqual(new ProcessError('Error saving media', 'translation_errors.mediaSaving'))

      expect(mockGetFile).toHaveBeenCalledTimes(1)
      expect(mockGetFile).toHaveBeenCalledWith('file_id')

      expect(mockGetFileLink).toHaveBeenCalledTimes(1)
      expect(mockGetFileLink).toHaveBeenCalledWith('file_id')

      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith('file_link', { responseType: 'stream' })

      expect(mockSaveMedia).toHaveBeenCalledTimes(0)
    })

    it('should build value correctly', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: 'file_stream' })
      mockGetFile.mockResolvedValue({ file_path: 'file_path.pdf' })
      mockGetFileLink.mockResolvedValue({ href: 'file_link' })
      mockSaveMedia.mockResolvedValue('save_media_result')

      mockHandleIncomingMessage.mockResolvedValue()

      await handler(mockContext, jest.fn())

      const props = {
        service: mockService,
        ctx: mockContext,
        message: { photo: [{ file_id: 'file_id' }] },
      } as unknown as StepProps<Message.PhotoMessage>

      const [[,,, valueBuilder]] = mockHandleIncomingMessage.mock.calls
      const result = await valueBuilder(props)

      expect(result).toEqual(['save_media_result'])

      expect(mockGetFile).toHaveBeenCalledTimes(1)
      expect(mockGetFile).toHaveBeenCalledWith('file_id')

      expect(mockGetFileLink).toHaveBeenCalledTimes(1)
      expect(mockGetFileLink).toHaveBeenCalledWith('file_id')

      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith('file_link', { responseType: 'stream' })

      expect(mockSaveMedia).toHaveBeenCalledTimes(1)
      expect(mockSaveMedia).toHaveBeenCalledWith('file_stream', 'file_id.pdf')
    })
  })
})
