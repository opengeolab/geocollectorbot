/* eslint-disable no-sync */
import * as fs from 'fs'
import * as fsPromises from 'fs/promises'
import { Readable } from 'stream'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import { FsConfiguration } from '../../../schemas/configuration/mediaStorage/fs'
import { mockLogger } from '../../../utils/testUtils'
import { FsClient } from '../fsClient'
import { GET_MEDIA_BASE_PATH } from '../index'

jest.mock('fs/promises', () => ({ writeFile: jest.fn() }))
jest.mock('fs', () => ({ existsSync: jest.fn(), mkdirSync: jest.fn() }))

describe('FS client', () => {
  const mockFastifyRegister = jest.fn()
  const mockFastify = { log: mockLogger, register: mockFastifyRegister } as unknown as FastifyInstance

  const mockConfig = { folderPath: 'folder_path' } as unknown as FsConfiguration

  let fsClient: FsClient

  beforeEach(() => { fsClient = new FsClient(mockFastify, mockConfig) })

  describe('constructor', () => {
    it('should build client correctly without existing folder', () => {
      expect(mockFastifyRegister).toHaveBeenCalledTimes(1)
      expect(mockFastifyRegister).toHaveBeenCalledWith(expect.any(Function), { root: 'folder_path' })

      expect(fs.existsSync).toHaveBeenCalledTimes(1)
      expect(fs.existsSync).toHaveBeenCalledWith('folder_path')

      expect(fs.mkdirSync).toHaveBeenCalledTimes(1)
      expect(fs.mkdirSync).toHaveBeenCalledWith('folder_path')
    })
  })

  describe('saveMedia', () => {
    const mockMediaStream = Readable.from('media_stream')

    it('should should throw if write file throws', async () => {
      (fsPromises.writeFile as jest.Mock).mockRejectedValue(new Error('write_file_error'))

      const executor = fsClient.saveMedia(mockMediaStream, 'file_id')
      await expect(executor)
        .rejects
        .toStrictEqual(new Error('write_file_error'))

      expect(fsPromises.writeFile).toHaveBeenCalledTimes(1)
      expect(fsPromises.writeFile).toHaveBeenCalledWith('folder_path/file_id', mockMediaStream)
    })

    it('should return correctly', async () => {
      (fsPromises.writeFile as jest.Mock).mockResolvedValue(undefined)

      const result = await fsClient.saveMedia(mockMediaStream, 'file_id')
      expect(result).toEqual(`${GET_MEDIA_BASE_PATH}/file_id`)

      expect(fsPromises.writeFile).toHaveBeenCalledTimes(1)
      expect(fsPromises.writeFile).toHaveBeenCalledWith('folder_path/file_id', mockMediaStream)
    })
  })

  describe('buildGetMediaHandler', () => {
    const mockSendFile = jest.fn()
    const mockRequest = { params: { id: 'media_id' } } as unknown as FastifyRequest
    const mockReply = { sendFile: mockSendFile } as unknown as FastifyReply

    it('should send file', () => {
      const handler = fsClient.buildGetMediaHandler()
      handler.bind(mockFastify)(mockRequest, mockReply)

      expect(mockSendFile).toHaveBeenCalledTimes(1)
      expect(mockSendFile).toHaveBeenCalledWith('media_id')
    })
  })
})
