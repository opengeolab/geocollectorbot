export {}
// import {FastifyInstance} from 'fastify'
// import {MiddlewareFn, Context} from 'telegraf'
//
// import {StorageClient} from '../../clients/storage'
// import {Configuration} from '../../models/Configuration'
// import {Flow} from '../../models/Flow'
// import {DataStorageConfig} from '../../schemas/configuration/dataStorage'
// import * as localizer from '../../utils/localizer'
// import {mockLogger} from '../../utils/testUtils'
// import mockStorageClient from '../__mocks__/mockStorageClient'
// import {buildCollectCommandHandler} from '../collectCommandHandler'
//
// describe('Collect command handler', () => {
//   jest.spyOn(localizer, 'resolveLocalizedText')
//
//   const mockReply = jest.fn()
//
//   const mockStorageConfig: DataStorageConfig = {
//     type: 'postgres',
//     configuration: {
//       user: 'user',
//       password: 'password',
//       host: 'host',
//       database: 'database',
//       port: 80,
//       interactionsTable: 'interactions_table',
//     },
//   }
//
//   type MockService = {
//     storageClient: StorageClient
//     configuration: Configuration
//     log: FastifyInstance['log']
//   }
//
//   const buildMockService = (flowConfig: Flow): MockService => ({
//     storageClient: mockStorageClient,
//     configuration: {dataStorage: mockStorageConfig, flow: flowConfig},
//     log: mockLogger,
//   })
//
//   afterEach(() => {
//     jest.clearAllMocks()
//     jest.resetAllMocks()
//   })
//
//   it('should send an error if no chat id is found', async () => {
//     const mockService = buildMockService({firstStepId: 'id', steps: {id: {question: 'question'}}})
//
//     const mockContext = {reply: mockReply}
//
//     const handler = buildCollectCommandHandler(mockService) as MiddlewareFn<Context>
//     await handler(mockContext as unknown as Context, jest.fn())
//
//     expect(mockReply).toHaveBeenCalledTimes(1)
//     expect(mockReply).toHaveBeenCalledWith('Error! Cannot recognize the chat')
//
//     expect(mockStorageClient.createInteraction).toHaveBeenCalledTimes(0)
//   })
//
//   it('should send an error if cannot create interaction', async () => {
//     (mockStorageClient.createInteraction as jest.Mock).mockRejectedValue(new Error('error'))
//
//     const mockService = buildMockService({firstStepId: 'id', steps: {id: {question: 'question'}}})
//
//     const mockContext = {
//       chat: {id: 123},
//       reply: mockReply,
//     }
//
//     const handler = buildCollectCommandHandler(mockService) as MiddlewareFn<Context>
//     await handler(mockContext as unknown as Context, jest.fn())
//
//     expect(mockReply).toHaveBeenCalledTimes(1)
//     expect(mockReply).toHaveBeenCalledWith('Sorry, an error occurred on our side')
//
//     expect(mockStorageClient.createInteraction).toHaveBeenCalledTimes(1)
//     expect(mockStorageClient.createInteraction).toHaveBeenCalledWith(123, 'id')
//
//     expect(localizer.resolveLocalizedText).toHaveBeenCalledTimes(0)
//   })
//
//   it('should send the first question without locale', async () => {
//     (localizer.resolveLocalizedText as jest.Mock).mockReturnValue('localized_question')
//
//     const mockService = buildMockService({firstStepId: 'id', steps: {id: {question: 'question'}}})
//
//     const mockContext = {
//       chat: {id: 123},
//       reply: mockReply,
//     }
//
//     const handler = buildCollectCommandHandler(mockService) as MiddlewareFn<Context>
//     await handler(mockContext as unknown as Context, jest.fn())
//
//     expect(mockReply).toHaveBeenCalledTimes(1)
//     expect(mockReply).toHaveBeenCalledWith('localized_question')
//
//     expect(mockStorageClient.createInteraction).toHaveBeenCalledTimes(1)
//     expect(mockStorageClient.createInteraction).toHaveBeenCalledWith(123, 'id')
//
//     expect(localizer.resolveLocalizedText).toHaveBeenCalledTimes(1)
//     expect(localizer.resolveLocalizedText).toHaveBeenCalledWith('question', undefined)
//   })
//
//   it('should send the first question with locale', async () => {
//     (localizer.resolveLocalizedText as jest.Mock).mockReturnValue('localized_question')
//
//     const mockService = buildMockService({firstStepId: 'id', steps: {id: {question: 'question'}}})
//
//     const mockContext = {
//       chat: {id: 123},
//       from: {language_code: 'it'},
//       reply: mockReply,
//     }
//
//     const handler = buildCollectCommandHandler(mockService) as MiddlewareFn<Context>
//     await handler(mockContext as unknown as Context, jest.fn())
//
//     expect(mockReply).toHaveBeenCalledTimes(1)
//     expect(mockReply).toHaveBeenCalledWith('localized_question')
//
//     expect(mockStorageClient.createInteraction).toHaveBeenCalledTimes(1)
//     expect(mockStorageClient.createInteraction).toHaveBeenCalledWith(123, 'id')
//
//     expect(localizer.resolveLocalizedText).toHaveBeenCalledTimes(1)
//     expect(localizer.resolveLocalizedText).toHaveBeenCalledWith('question', 'it')
//   })
// })
