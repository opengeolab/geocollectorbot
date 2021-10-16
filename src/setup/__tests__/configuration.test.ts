import {join} from 'path'

import {decorateConfiguration} from '../configuration'
import configmap from '../../__mocks__/configmap.json'
import {baseEnv} from '../../utils/testUtils'

describe('Configuration', () => {
  const validConfigMapPath = join(__dirname, '../../__mocks__/configmap.json')
  const invalidConfigMapPath = join(__dirname, '../../__mocks__/invalidConfigMap.json')

  const mockDecorate = jest.fn()

  afterEach(() => jest.clearAllMocks())

  it('should throw if configuration is not valid', async() => {
    const mockService = {env: {...baseEnv, CONFIGURATION_PATH: invalidConfigMapPath}, decorate: mockDecorate}

    try {
      await decorateConfiguration(mockService)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error.message).toContain('Invalid configuration:')
      expect(mockDecorate).toHaveBeenCalledTimes(0)
    }
  })

  it('should decorate correct configuration', async() => {
    const mockService = {env: {...baseEnv, CONFIGURATION_PATH: validConfigMapPath}, decorate: mockDecorate}

    try {
      await decorateConfiguration(mockService)
    } catch (error) {
      expect(true).toBeFalsy()
    }

    expect(mockDecorate).toHaveBeenCalledTimes(1)
    expect(mockDecorate).toHaveBeenCalledWith('configuration', configmap)
  })
})
