import { MediaStorageConfig } from '../../../schemas/configuration/mediaStorage'
import { getMockFastify } from '../../../utils/testUtils'
import { FsClient } from '../fsClient'
import { buildMediaStorageClient, GET_MEDIA_BASE_PATH, MediaStorageClient, registerGetMediaRoute } from '../index'

jest.mock('../fsClient', () => ({ FsClient: jest.fn() }))

describe('Media storage client', () => {
  const mockHandler = jest.fn()
  const mockBuildGetMediaHandler = jest.fn().mockReturnValue(mockHandler)
  const mockClient = { buildGetMediaHandler: mockBuildGetMediaHandler } as unknown as MediaStorageClient

  const mockConfig = {} as unknown as MediaStorageConfig

  const buildMockService = (config?: MediaStorageConfig, client?: MediaStorageClient) => {
    return getMockFastify({
      configuration: { mediaStorage: config },
      mediaStorageClient: client,
    })
  }

  describe('buildMediaStorageClient', () => {
    it('should return undefined if no config', () => {
      const mockService = buildMockService()

      const result = buildMediaStorageClient(mockService)
      expect(result).toBeUndefined()
    })

    it('should correctly build fileSystem client', () => {
      const config: MediaStorageConfig = {
        type: 'fileSystem',
        configuration: { folderPath: 'folder_path' },
      }

      const mockService = buildMockService(config)

      const result = buildMediaStorageClient(mockService)

      expect(result).toBeInstanceOf(FsClient)

      expect(FsClient).toHaveBeenCalledTimes(1)
      expect(FsClient).toHaveBeenCalledWith(mockService, config.configuration)
    })
  })

  describe('registerGetMediaRoute', () => {
    it('should do nothing if no client', () => {
      const service = buildMockService(mockConfig)
      registerGetMediaRoute(service)

      expect(mockBuildGetMediaHandler).toHaveBeenCalledTimes(0)
      expect(service.get).toHaveBeenCalledTimes(0)
    })

    it('should register route', () => {
      const service = buildMockService(mockConfig, mockClient)
      registerGetMediaRoute(service)

      expect(mockBuildGetMediaHandler).toHaveBeenCalledTimes(1)

      expect(service.get).toHaveBeenCalledTimes(1)
      expect(service.get).toHaveBeenCalledWith(`${GET_MEDIA_BASE_PATH}/:id`, mockHandler)
    })
  })
})
