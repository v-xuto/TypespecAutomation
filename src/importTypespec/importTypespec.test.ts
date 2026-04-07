import { beforeAll, beforeEach, describe } from "vitest"
import { screenShot, test } from "../common/utils"
import fs from "node:fs"
import path from "node:path"
import {
  closeVscode,
  contrastResult,
  installExtensionForCommand,
  notEmptyFolderContinue,
  preContrastResult,
  selectFolder,
  startWithCommandPalette,
  startWithRightClick
} from "../common/commonSteps"
import { ImportCasesConfigList } from "./config"

beforeAll(() => {
  screenShot.setCreateType("import")
})

beforeEach(() => {
  const importTypespec = path.resolve(
    __dirname,
    "../../ImportTypespecProjectOpenApi3"
  )
  const importTypespecEmptyFolder = path.resolve(
    __dirname,
    "../../ImportTypespecProjectOpenApi3/ImportTypespecProjectEmptyFolder"
  )
  if (fs.existsSync(importTypespec)) {
    let hasOpenapi3File = false
    for (const file of fs.readdirSync(importTypespec)) {
      if (file === "openapi.3.0.yaml") {
        hasOpenapi3File = true
      } else if (file != "ImportTypespecProjectEmptyFolder") {
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
  if (fs.existsSync(importTypespecEmptyFolder)) {
    for (const file of fs.readdirSync(importTypespecEmptyFolder)) {
      const filePath = path.resolve(importTypespecEmptyFolder, file)
      fs.rmSync(filePath, { recursive: true, force: true })
    }
  } else if (!fs.existsSync(importTypespecEmptyFolder)){
    fs.mkdirSync(importTypespecEmptyFolder, { recursive: true })
  }
})

describe.each(ImportCasesConfigList) ("ImportTypespecFromOpenApi3", async ( item ) => {
  const {
    caseName,
    triggerType,
    selectFolderEmptyOrNonEmpty,
    expectedResults,
  } = item
  test(caseName, async ({ launch }) => {
    screenShot.setDir("ImportTypespecFromOpenApi3")
    console.log(caseName)
    const workspacePath = path.resolve(
      __dirname,
      "../../ImportTypespecProjectOpenApi3"
    )
    const { page, extensionDir } = await launch({
      workspacePath,
    })
    await installExtensionForCommand(page, extensionDir)

    if (triggerType === "CommandPalette") {
      await startWithCommandPalette(page, {
        command: "Import TypeSpec from Openapi 3",
      })
    } else if (triggerType === "RightClickOnFile") {
      await startWithRightClick(page, "Import TypeSpec from Openapi 3", "file")
    } else if (triggerType === "RightClickOnFolder" && selectFolderEmptyOrNonEmpty == "empty") {
      await startWithRightClick(page, "Import TypeSpec from Openapi 3", "emptyfolder")    
    } else if (triggerType === "RightClickOnFolder" && selectFolderEmptyOrNonEmpty == "non-empty") {
      await startWithRightClick(page, "Import TypeSpec from Openapi 3", "folder")    
    }

    await screenShot.screenShot("after_start_list.png")

    if (selectFolderEmptyOrNonEmpty === "empty" && triggerType != "RightClickOnFolder") {
      await selectFolder("ImportTypespecProjectEmptyFolder")
      await selectFolder()
    } else if (selectFolderEmptyOrNonEmpty === "non-empty") {
      await selectFolder()
      await notEmptyFolderContinue(page)  
    }
    
    await selectFolder("openapi.3.0.yaml")
    await screenShot.screenShot("result_list.png")

    await preContrastResult(
      page,
      "OpenAPI succeeded",
      "Failed to import project successfully",
      [10, 3]
    )
    await closeVscode()
    await contrastResult(expectedResults, workspacePath)
  })
})

