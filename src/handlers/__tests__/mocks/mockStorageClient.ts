import {StorageClient} from '../../../clients/storage'

const mockStorageClient: StorageClient = {
  createInteraction: jest.fn(),
  getOngoingInteractions: jest.fn(),
  updateInteraction: jest.fn(),
  stop: jest.fn(),
}

export default mockStorageClient
