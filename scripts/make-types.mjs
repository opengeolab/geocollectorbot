/* eslint-disable no-console */
import { writeFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { compileFromFile } from 'json-schema-to-typescript'

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url))

const bannerComment = '/* eslint-disable */\n/**\n* This file was automatically generated by json-schema-to-typescript.\n* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,\n* and run `yarn make-types` to regenerate this file.\n*/'

const main = async () => {
  const inputFilePath = resolve(__dirname, '../src/schemas/config.schema.json')
  const outputFilePath = resolve(__dirname, '../src/schemas/config.d.ts')

  const compileProps = {
    $refOptions: { resolve: { external: true } },
    bannerComment,
    style: { semi: false },
  }

  try {
    const compiledTypes = await compileFromFile(inputFilePath, compileProps)
    await writeFile(outputFilePath, compiledTypes)

    console.log('\x1b[32m%s\x1b[0m', '✔ /schemas/config.schema.json compiled successfully')
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', '✖ Failed compiling /schemas/config.schema.json')
    console.error(err)
  }
}

main().catch(err => console.error(err))
