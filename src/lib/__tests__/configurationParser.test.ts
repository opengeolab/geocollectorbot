import * as dataStorage from '../../clients/dataStorage'
import { ParsedFlow, MediaStepSubtype, StepType } from '../../models/Flow'
import { BaseInteractionKeys } from '../../models/Interaction'
import { BotConfiguration, DataStorage, Flow, MediaStorage } from '../../schemas/config'
import { mockLogger } from '../../utils/testUtils'
import { parseFlow } from '../configurationParser'

describe('Flow', () => {
  describe('parseFlow', () => {
    const mockGetDataStorageBaseKeys = jest
      .spyOn(dataStorage, 'getDataStorageBaseKeys')
      .mockReturnValue(['storage_base_key_1'])

    const mockDataStorageConfig = { type: 'data_storage_type' } as unknown as DataStorage

    const getRowConfig = (flow: Flow, mediaStorage?: MediaStorage): BotConfiguration => ({
      flow,
      dataStorage: mockDataStorageConfig,
      mediaStorage,
    })

    it('should throw if firstStepId not found', () => {
      const rawFlow: Flow = {
        firstStepId: 'unknown_step',
        steps: [
          {
            id: 'step_1',
            question: 'question_1',
            config: { type: StepType.TEXT },
            nextStepId: 'step_2',
          },
        ],
      }

      expect(() => parseFlow(getRowConfig(rawFlow), mockLogger))
        .toThrow(new Error('Error parsing flow configuration: cannot find first step'))

      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledTimes(0)
    })

    it('should throw if step id not unique', () => {
      const rawFlow: Flow = {
        firstStepId: 'step_1',
        steps: [
          {
            id: 'step_1',
            question: 'question_1',
            config: { type: StepType.TEXT },
            nextStepId: 'step_3',
          },
          {
            id: 'step_1',
            question: 'question_2',
            config: { type: StepType.TEXT },
            nextStepId: 'step_3',
          },
          {
            id: 'step_3',
            question: 'question_3',
            config: { type: StepType.TEXT },
            nextStepId: 'step_3',
          },
        ],
      }

      expect(() => parseFlow(getRowConfig(rawFlow), mockLogger))
        .toThrow(new Error('Error parsing steps configuration: id is not unique'))

      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledTimes(1)
      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledWith('data_storage_type')
    })

    it('should throw if next step not found', () => {
      const rawFlow: Flow = {
        firstStepId: 'step_1',
        steps: [
          {
            id: 'step_1',
            question: 'question_1',
            config: { type: StepType.TEXT },
            nextStepId: 'step_2',
          },
          {
            id: 'step_2',
            question: 'question_2',
            config: { type: StepType.TEXT },
            nextStepId: 'step_3',
          },
        ],
      }

      expect(() => parseFlow(getRowConfig(rawFlow), mockLogger))
        .toThrow(new Error('Error parsing steps configuration: cannot find next step'))

      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledTimes(1)
      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledWith('data_storage_type')
    })

    it('should throw if circular', () => {
      const rawFlow: Flow = {
        firstStepId: 'step_1',
        steps: [
          {
            id: 'step_1',
            question: 'question_1',
            config: { type: StepType.TEXT },
            nextStepId: 'step_1',
          },
        ],
      }

      expect(() => parseFlow(getRowConfig(rawFlow), mockLogger))
        .toThrow(new Error('Error parsing steps configuration: circular dependency'))

      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledTimes(1)
      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledWith('data_storage_type')
    })

    it('should throw if duplicate db key found', () => {
      const rawFlow_1: Flow = {
        firstStepId: 'step_1',
        steps: [
          {
            id: 'step_1',
            question: 'question_1',
            config: { type: StepType.TEXT },
            persistAs: 'db_key',
            nextStepId: 'step_2',
          },
          {
            id: 'step_2',
            question: 'question_2',
            config: { type: StepType.TEXT },
            persistAs: 'db_key',
          },
        ],
      }

      expect(() => parseFlow(getRowConfig(rawFlow_1), mockLogger))
        .toThrow(new Error('Error parsing steps configuration: duplicate db key'))

      const rawFlow_2: Flow = {
        firstStepId: 'db_key',
        steps: [
          {
            id: 'db_key',
            question: 'question_1',
            config: { type: StepType.TEXT },
            nextStepId: 'step_2',
          },
          {
            id: 'step_2',
            question: 'question_2',
            config: { type: StepType.TEXT },
            persistAs: 'db_key',
          },
        ],
      }

      expect(() => parseFlow(getRowConfig(rawFlow_2), mockLogger))
        .toThrow(new Error('Error parsing steps configuration: duplicate db key'))

      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledTimes(2)
      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledWith('data_storage_type')
    })

    it('should throw if db key is reserved', () => {
      const rawFlow_1: Flow = {
        firstStepId: 'step_1',
        steps: [
          {
            id: 'step_1',
            question: 'question_1',
            config: { type: StepType.TEXT },
            persistAs: 'storage_base_key_1',
          },
        ],
      }

      expect(() => parseFlow(getRowConfig(rawFlow_1), mockLogger))
        .toThrow(new Error('Error parsing steps configuration: cannot use a db reserved key'))

      const rawFlow_2: Flow = {
        firstStepId: BaseInteractionKeys.CHAT_ID,
        steps: [
          {
            id: BaseInteractionKeys.CHAT_ID,
            question: 'question_1',
            config: { type: StepType.TEXT },
          },
        ],
      }

      expect(() => parseFlow(getRowConfig(rawFlow_2), mockLogger))
        .toThrow(new Error('Error parsing steps configuration: cannot use a db reserved key'))

      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledTimes(2)
      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledWith('data_storage_type')
    })

    it('should throw if step of type media and no media storage config', () => {
      const rawFlow: Flow = {
        firstStepId: 'step_1',
        steps: [
          {
            id: 'step_1',
            question: 'question_1',
            config: { type: StepType.SINGLE_MEDIA, acceptOnly: MediaStepSubtype.PHOTO },
          },
        ],
      }

      expect(() => parseFlow(getRowConfig(rawFlow), mockLogger))
        .toThrow(new Error('Error parsing steps configuration: missing media storage config'))

      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledTimes(1)
      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledWith('data_storage_type')
    })

    it('should parse flow', () => {
      const mediaConfig: MediaStorage = {
        type: 'fileSystem',
        configuration: { folderPath: '' },
      }

      const rawFlow: Flow = {
        firstStepId: 'step_1',
        steps: [
          {
            id: 'step_1',
            question: 'question_1',
            config: { type: StepType.TEXT },
            nextStepId: 'step_2',
          },
          {
            id: 'step_2',
            question: 'question_2',
            config: { type: StepType.SINGLE_MEDIA, acceptOnly: MediaStepSubtype.PHOTO },
            persistAs: 'persist_as',
          },
        ],
      }

      const expectedFlow: ParsedFlow = {
        firstStepId: 'step_1',
        steps: {
          step_1: {
            id: 'step_1',
            question: 'question_1',
            config: { type: StepType.TEXT },
            persistAs: 'step_1',
            nextStepId: 'step_2',
          },
          step_2: {
            id: 'step_2',
            question: 'question_2',
            config: { type: StepType.SINGLE_MEDIA, acceptOnly: MediaStepSubtype.PHOTO },
            persistAs: 'persist_as',
            nextStepId: undefined,
          },
        },
      }

      const config = getRowConfig(rawFlow, mediaConfig)

      expect(parseFlow(config, mockLogger)).toStrictEqual(expectedFlow)

      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledTimes(1)
      expect(mockGetDataStorageBaseKeys).toHaveBeenCalledWith('data_storage_type')
    })
  })
})
