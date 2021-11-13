import {join} from 'path'

import {baseEnv, mockLogger} from '../../utils/testUtils'
import {decorateConfiguration} from '../configuration'
import * as flow from '../flow'

import configmap from './mocks/configmap.json'

describe('Configuration', () => {
  const parseFlowMock = jest.spyOn(flow, 'parseFlow')

  const validConfigMapPath = join(__dirname, './mocks/configmap.json')
  const invalidConfigMapPath = join(__dirname, './mocks/invalidConfigMap.json')

  const decorateMock = jest.fn()

  const buildMockService = (configPath: string) => ({
    env: {...baseEnv, CONFIGURATION_PATH: configPath},
    decorate: decorateMock,
    log: mockLogger,
  })

  afterEach(() => jest.clearAllMocks())

  it('should throw if configuration is not valid', async () => {
    parseFlowMock.mockReturnValue({firstStepId: 'foo', steps: {}})

    const mockService = buildMockService(invalidConfigMapPath)

    try {
      await decorateConfiguration(mockService)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error.message).toContain('Invalid configuration:')
    }

    expect(decorateMock).toHaveBeenCalledTimes(0)
    expect(parseFlowMock).toHaveBeenCalledTimes(0)
  })

  it('should throw if parse flow throws', async () => {
    parseFlowMock.mockImplementation(() => { throw new Error('Parse error') })

    const mockService = buildMockService(validConfigMapPath)

    try {
      await decorateConfiguration(mockService)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error.message).toEqual('Parse error')
    }

    expect(parseFlowMock).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(parseFlowMock).toHaveBeenCalledWith(configmap.flow, mockLogger)

    expect(decorateMock).toHaveBeenCalledTimes(0)
  })

  it('should decorate correct configuration', async () => {
    const mockFlow = {firstStepId: 'foo', steps: {}}
    parseFlowMock.mockReturnValue(mockFlow)

    const mockService = buildMockService(validConfigMapPath)

    const expectedConfiguration = {
      dataStorage: configmap.dataStorage,
      flow: mockFlow,
    }

    try {
      await decorateConfiguration(mockService)
    } catch (error) {
      expect(true).toBeFalsy()
    }

    expect(parseFlowMock).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(parseFlowMock).toHaveBeenCalledWith(configmap.flow, mockLogger)

    expect(decorateMock).toHaveBeenCalledTimes(1)
    expect(decorateMock).toHaveBeenCalledWith('configuration', expectedConfiguration)
  })
})
