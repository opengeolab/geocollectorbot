import { join } from 'path'

import { getMockFastify, mockLogger } from '../../utils/testUtils'
import { retrieveConfiguration } from '../configuration'
import * as flow from '../flow'

import configmap from './mocks/configmap.json'

describe('Configuration', () => {
  describe('retrieveConfiguration', () => {
    const parseFlowMock = jest.spyOn(flow, 'parseFlow')

    const validConfigMapPath = join(__dirname, './mocks/configmap.json')
    const invalidConfigMapPath = join(__dirname, './mocks/invalidConfigMap.json')

    it('should throw if configuration is not valid', async () => {
      const mockService = getMockFastify({ env: { CONFIGURATION_PATH: invalidConfigMapPath } })

      const executor = retrieveConfiguration(mockService)

      await expect(executor)
        .rejects
        .toEqual(new Error('Invalid configuration: [{"instancePath":"","schemaPath":"#/required","keyword":"required","params":{"missingProperty":"flow"},"message":"must have required property \'flow\'"}]'))

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

    it('should return correct configuration', async () => {
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
    })
  })
})
