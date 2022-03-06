import { interpolateEnv } from '../envInterpolator'
import { getMockFastify } from '../testUtils'

describe('Env interpolator', () => {
  describe('interpolateEnv', () => {
    const mockService = getMockFastify({ env: { foo: 'bar_env' } })

    it('should interpolate object', () => {
      const obj: Record<string, any> = {
        toInterpolate: '{{foo}}',
        notToInterpolate: 'foo',
        notExistent: '{{bar}}',
        number: 1,
        boolean: true,
        array: ['foo', '{{foo}}'],
        object: {
          toInterpolate: '{{foo}}',
          notToInterpolate: 'foo',
          notExistent: '{{bar}}',
          number: 1,
          boolean: true,
          array: ['foo'],
          object: { foo: 'bar' },
          notDefined: undefined,
          nullProp: null,
        },
        notDefined: undefined,
        nullProp: null,
      }

      interpolateEnv(obj, mockService)

      expect(obj).toStrictEqual({
        toInterpolate: 'bar_env',
        notToInterpolate: 'foo',
        notExistent: '',
        number: 1,
        boolean: true,
        array: ['foo', '{{foo}}'],
        object: {
          toInterpolate: 'bar_env',
          notToInterpolate: 'foo',
          notExistent: '',
          number: 1,
          boolean: true,
          array: ['foo'],
          object: { foo: 'bar' },
          notDefined: undefined,
          nullProp: null,
        },
        notDefined: undefined,
        nullProp: null,
      })
    })
  })
})
