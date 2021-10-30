import {RawFlow} from '../../schemas/configuration/flow'
import {mockLogger} from '../../utils/testUtils'
import {parseFlow} from '../flow'

describe('Flow', () => {
  it('should throw if firstStepId not found', () => {
    const rawFlow: RawFlow = {
      firstStepId: 'unknown_step',
      steps: [{id: 'step_1', question: 'question_1', nextStepId: 'step_2'}],
    }

    try {
      parseFlow(rawFlow, mockLogger)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error.message).toEqual('Error parsing flow configuration: cannot find first step')
    }
  })

  it('should throw if step id not unique', () => {
    const rawFlow: RawFlow = {
      firstStepId: 'step_1',
      steps: [
        {id: 'step_1', question: 'question_1', nextStepId: 'step_3'},
        {id: 'step_1', question: 'question_2', nextStepId: 'step_3'},
        {id: 'step_3', question: 'question_3', nextStepId: 'step_3'},
      ],
    }

    try {
      parseFlow(rawFlow, mockLogger)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error.message).toEqual('Error parsing steps configuration: id is not unique')
    }
  })

  it('should throw if next step not found', () => {
    const rawFlow: RawFlow = {
      firstStepId: 'step_1',
      steps: [
        {id: 'step_1', question: 'question_1', nextStepId: 'step_2'},
        {id: 'step_2', question: 'question_2', nextStepId: 'step_3'},
      ],
    }

    try {
      parseFlow(rawFlow, mockLogger)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error.message).toEqual('Error parsing steps configuration: cannot find next step')
    }
  })

  it('should throw if circular', () => {
    const rawFlow: RawFlow = {
      firstStepId: 'step_1',
      steps: [{id: 'step_1', question: 'question_1', nextStepId: 'step_1'}],
    }

    try {
      parseFlow(rawFlow, mockLogger)
      expect(true).toBeFalsy()
    } catch (error: any) {
      expect(error.message).toEqual('Error parsing steps configuration: circular dependency')
    }
  })

  it('should parse flow', () => {
    const rawFlow: RawFlow = {
      firstStepId: 'step_1',
      steps: [
        {id: 'step_1', question: 'question_1', nextStepId: 'step_2'},
        {id: 'step_2', question: 'question_2'},
      ],
    }

    const expectedFlow = {
      firstStepId: 'step_1',
      steps: {
        step_1: {
          id: 'step_1',
          question: 'question_1',
          nextStepId: 'step_2',
        },
        step_2: {
          id: 'step_2',
          question: 'question_2',
          nextStepId: undefined,
        },
      },
    }

    const flow = parseFlow(rawFlow, mockLogger)

    expect(flow).toStrictEqual(expectedFlow)
  })
})
