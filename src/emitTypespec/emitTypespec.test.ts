import { beforeAll, beforeEach, describe } from "vitest"
import {
  closeVscode,
  contrastResult,
  installExtensionForCommand,
  preContrastResult,
  startWithRightClick,
  startWithCommandPalette,
} from "../common/commonSteps"
import {
  emitSelectLanguage,
  emitSelectLanguageForOpenapi,
  emitSelectType,
  emiChooseEmitter
} from "../common/emiSteps"
import { screenShot, sleep, test } from "../common/utils"
import path from "node:path"
import fs from "node:fs"
import { EmitCasesConfigList } from "./config"

beforeAll(() => {
  screenShot.setCreateType("emit")
})

beforeEach(() => {
  let dir = path.resolve(__dirname, "../../EmitTypespecProject/tsp-output")
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.resolve(dir, file)
      fs.rmSync(filePath, { recursive: true, force: true })
    }
  }
  dir = path.resolve(__dirname, "../../EmitTypespecProjectStubJs/tsp-output")
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.resolve(dir, file)
      fs.rmSync(filePath, { recursive: true, force: true })
    }
  }
})

describe.each(EmitCasesConfigList)("EmitTypespecProject", async (item) => {
  const {
    caseName,
    selectType,
    selectTypeLanguage,
    triggerType,
    expectedResults,
  } = item
  test(caseName, async ({ launch }) => {
    screenShot.setDir(caseName)
    const isServerStubJS =
      selectType === "Server Stub" && selectTypeLanguage === "JavaScript"
    const workspacePath = path.resolve(
      __dirname,
      `../../EmitTypespecProject${isServerStubJS ? "StubJs" : ""}`
    )

    const { page, extensionDir } = await launch({
      workspacePath,
    })

    await installExtensionForCommand(page, extensionDir)
    if (triggerType === "Command") {
      await startWithCommandPalette(page, {
        folderName: "EmitTypespecProject",
        command: "Emit from Typespec",
      })
    } else if (triggerType === "Click") {
      await startWithRightClick(page, "Emit from TypeSpec", "file")
    }

    await screenShot.screenShot("emitter_list.png")

    await sleep(3)
    await emiChooseEmitter(page)
    await emitSelectType(page, selectType)
    if (selectTypeLanguage === "OpenAPI3") {
      await emitSelectLanguageForOpenapi(page)
    } else {
      await emitSelectLanguage(page, selectTypeLanguage, selectType)
    }

    const contrastMessage = selectTypeLanguage + "...Succeeded"
    await preContrastResult(
      page,
      contrastMessage,
      "Failed to emit project Successful",
      [10, 3]
    )

    await screenShot.screenShot("close_vscode.png")
    await closeVscode()

    const resultFilePath = path.resolve(workspacePath, "./tsp-output/@typespec")
    await contrastResult(expectedResults, resultFilePath)
  })
})
