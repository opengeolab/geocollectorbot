import {baseEnv} from '../../utils/testUtils'
import {decorateEnv} from '../environment'

describe('Environment', () => {
  describe('decorateEnv', () => {
    const mockDecorate = jest.fn()
    const mockService = {decorate: mockDecorate}

    afterEach(() => jest.clearAllMocks())

    it('should decorate with given environment', async() => {
      decorateEnv(mockService, baseEnv)

      expect(mockDecorate).toHaveBeenCalledTimes(1)
      expect(mockDecorate).toHaveBeenCalledWith('env', baseEnv)
    })
  })
})
