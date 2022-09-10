import { join } from 'path'

import * as flow from '../../lib/configurationParser'
import * as envInterpolator from '../../utils/envInterpolator'
import { getMockFastify, mockLogger } from '../../utils/testUtils'
import { retrieveConfiguration } from '../configuration'

import configmap from './mocks/configmap.json'
import configmapWithMediaStorage from './mocks/configmapWithMediaStorage.json'

describe('Configuration', () => {
  describe('retrieveConfiguration', () => {
    const parseFlowMock = jest.spyOn(flow, 'parseFlow')
    const interpolateEnvMock = jest.spyOn(envInterpolator, 'interpolateEnv')

    const validConfigMapPath = join(__dirname, './mocks/configmap.json')
    const validConfigMapWithMediaStoragePath = join(__dirname, './mocks/configmapWithMediaStorage.json')
    const invalidConfigMapPath = join(__dirname, './mocks/invalidConfigMap.json')

    it('should throw if configuration is not valid', async () => {
      const mockService = getMockFastify({ env: { CONFIGURATION_PATH: invalidConfigMapPath } })

      const executor = retrieveConfiguration(mockService)

      await expect(executor)
        .rejects
        .toEqual(new Error('Invalid configuration: [{"instancePath":"","schemaPath":"#/required","keyword":"required","params":{"missingProperty":"dataStorage"},"message":"must have required property \'dataStorage\'"}]'))

      expect(parseFlowMock).toHaveBeenCalledTimes(0)
    })

    it('should throw if parse flow throws', async () => {
      parseFlowMock.mockImplementation(() => { throw new Error('Parse error') })

      const mockService = getMockFastify({ env: { CONFIGURATION_PATH: validConfigMapPath } })

      const executor = retrieveConfiguration(mockService)

      await expect(executor).rejects.toEqual(new Error('Parse error'))

      expect(parseFlowMock).toHaveBeenCalledTimes(1)
      expect(parseFlowMock).toHaveBeenCalledWith(configmap, mockLogger)
    })

    it('should return correct configuration without media storage', async () => {
      const mockFlow = { firstStepId: 'foo', steps: {} }
      parseFlowMock.mockReturnValue(mockFlow)

      const mockService = getMockFastify({ env: { CONFIGURATION_PATH: validConfigMapPath } })

      const expectedConfiguration = {
        dataStorage: configmap.dataStorage,
        mediaStorage: undefined,
        flow: mockFlow,
      }

      const configuration = await retrieveConfiguration(mockService)

      expect(configuration).toStrictEqual(expectedConfiguration)

      expect(parseFlowMock).toHaveBeenCalledTimes(1)
      expect(parseFlowMock).toHaveBeenCalledWith(configmap, mockLogger)

      expect(interpolateEnvMock).toHaveBeenCalledTimes(1)
      expect(interpolateEnvMock).toHaveBeenCalledWith(configmap.dataStorage)
    })

    it('should return correct configuration with media storage', async () => {
      const mockFlow = { firstStepId: 'foo', steps: {} }
      parseFlowMock.mockReturnValue(mockFlow)

      const mockService = getMockFastify({ env: { CONFIGURATION_PATH: validConfigMapWithMediaStoragePath } })

      const expectedConfiguration = {
        dataStorage: configmapWithMediaStorage.dataStorage,
        mediaStorage: configmapWithMediaStorage.mediaStorage,
        flow: mockFlow,
      }

      const configuration = await retrieveConfiguration(mockService)

      expect(configuration).toStrictEqual(expectedConfiguration)

      expect(parseFlowMock).toHaveBeenCalledTimes(1)
      expect(parseFlowMock).toHaveBeenCalledWith(configmapWithMediaStorage, mockLogger)

      expect(interpolateEnvMock).toHaveBeenCalledTimes(2)
      expect(interpolateEnvMock).toHaveBeenNthCalledWith(1, configmapWithMediaStorage.dataStorage)
      expect(interpolateEnvMock).toHaveBeenNthCalledWith(2, configmapWithMediaStorage.mediaStorage)
    })
  })
})
