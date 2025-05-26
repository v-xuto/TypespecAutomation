import { afterEach, beforeAll, beforeEach } from "vitest"
import { screenShot, sleep, test } from "./common/utils"
import fs from "node:fs"
import path from "node:path"
import {
  closeVscode,
  contrastResult,
  installExtension,
  installExtensionForFile,
  notEmptyFolderContinue,
  preContrastResult,
  selectFolder,
  start,
} from "./common/commonSteps"

beforeAll(() => {
  screenShot.setCreateType("import")
})

beforeEach(() => {
  const importTypespec = path.resolve(
    __dirname,
    "../ImportTypespecProjectOpenApi3"
  )
  if (fs.existsSync(importTypespec)) {
    let hasOpenapi3File = false
    for (const file of fs.readdirSync(importTypespec)) {
      if (file === "openapi.3.0.yaml") {
        hasOpenapi3File = true
      } else {
        const filePath = path.resolve(importTypespec, file)
        fs.rmSync(filePath, { recursive: true, force: true })
      }
    }
    if (!hasOpenapi3File) {
      throw new Error("Failed to find openapi3 file")
    }
  } else {
    throw new Error("Failed to find ImportTypespecProjectOpenApi3 directory")
  }
})

test("ImportTypespecFromOpenApi3", async ({ launch }) => {
  screenShot.setDir("ImportTypespecFromOpenApi3")
  const workspacePath = path.resolve(
    __dirname,
    "../ImportTypespecProjectOpenApi3"
  )
  const { page } = await launch({
    workspacePath,
  })
  await installExtensionForFile(
    page,
    path.resolve(__dirname, "../extension.vsix"),
    workspacePath
  )
  // await installExtension(page)
  console.log("install extension")

  await start(page, {
    folderName: "importTypespecProjectOpenApi3",
    command: "Import TypeSpec from OpenAPI 3",
  })
  console.log("top input")

  await selectFolder()
  console.log("selected folder")

  await notEmptyFolderContinue(page)
  console.log("yes")

  await selectFolder()
  console.log("selected file")

  await preContrastResult(
    page,
    "OpenAPI succeeded",
    "Failed to import project successfully",
    [10, 10]
  )
  await contrastResult(["openapi.3.0.yaml", "main.tsp"], workspacePath)
})
