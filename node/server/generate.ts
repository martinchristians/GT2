import { resolve } from 'path'
import fs from 'fs'

import * as TJS from 'typescript-json-schema'

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
}

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
}

// optionally pass a base path
const basePath = '.'

const program = TJS.getProgramFromFiles(
  [resolve('./src/messages.ts')],
  compilerOptions,
  basePath,
)

const generator = TJS.buildGenerator(program, settings)

if (!generator) {
  throw new Error('Could not build generator')
}
const symbols = generator.getUserSymbols()

const serverMessage = generator.getSchemaForSymbol('ServerMessage')
const clientMessage = generator.getSchemaForSymbol('ClientMessage')
const gameMessage = generator.getSchemaForSymbol('GameMessage')

const messages = `// generated file! do not edit!
import { Schema } from "jsonschema"
export const schemaServerMessage: Schema = ${JSON.stringify(
  serverMessage,
  null,
  2,
)}\n
export const schemaClientMessage: Schema = ${JSON.stringify(
  clientMessage,
  null,
  2,
)}\n
export const schemaGameMessage: Schema = ${JSON.stringify(
  gameMessage,
  null,
  2,
)}\n`
// save to .json file
const fileName = './src/messages-schema.ts'
const json = messages
fs.writeFileSync(fileName, json)
