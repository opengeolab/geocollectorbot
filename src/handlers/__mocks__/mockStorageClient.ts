import {StorageClient} from '../../clients/storage'

const mockStorageClient: StorageClient = {
  getOngoingInteraction: jest.fn(),
  createInteraction: jest.fn(),
  stop: jest.fn(),
}

export default mockStorageClient
