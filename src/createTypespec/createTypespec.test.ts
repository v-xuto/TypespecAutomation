import { beforeAll, beforeEach, describe } from "vitest"
import {
  contrastResult,
  startWithCommandPalette,
  selectFolder,
  preContrastResult,
  closeVscode,
  installExtensionForCommand,
  createTestFile,
  deleteTestFile,
  notEmptyFolderContinue,
} from "../common/commonSteps"
import { screenShot, test } from "../common/utils"
import fs from "node:fs"
import path from "node:path"
import {
  inputProjectName,
  selectEmitters,
  selectTemplate,
  startWithClick,
} from "../common/createSteps"
import {
  CreateCasesConfigList,
  CreateProjectTriggerType,

} from "./config"

beforeAll(() => {
  screenShot.setCreateType("create")
})

beforeEach(() => {
  const dir = path.resolve(__dirname, "../../CreateTypespecProject")
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.resolve(dir, file)
      fs.rmSync(filePath, { recursive: true, force: true })
    }
  } else {
    fs.mkdirSync(dir, { recursive: true })
  }
})

describe.each(CreateCasesConfigList)("CreateTypespecProject", (item) => {
  const {
    caseName,
    triggerType,
    templateName,
    templateNameDescription,
    isEmptyFolder,
    expectedResults,
  } = item

  test.only(caseName, async ({ launch }) => {
    screenShot.setDir(caseName)
    const workspacePath = path.resolve(__dirname, "../../CreateTypespecProject")

    try {
      const { page, extensionDir } = await launch({
        workspacePath:
          triggerType === CreateProjectTriggerType.Command
            ? workspacePath
            : "test",
      })

      if (!isEmptyFolder) {
        createTestFile(workspacePath)
      }

      await installExtensionForCommand(page, extensionDir)

      if (triggerType === CreateProjectTriggerType.Command) {
        await startWithCommandPalette(page, {
          folderName: "CreateTypespecProject",
          command: "Create Typespec Project",
        })
      } else {
        await startWithClick(page)
      }

      await selectFolder(
        triggerType === CreateProjectTriggerType.Command ? "" : workspacePath
      )

      if (!isEmptyFolder) {
        await notEmptyFolderContinue(page)
        deleteTestFile(workspacePath)
      }
    
      await selectTemplate(page, templateName, templateNameDescription)

      await inputProjectName(page)

      if (templateName === "Generic Rest API") {
        await selectEmitters(page)
      } 

      await preContrastResult(
        page,
        "Project created",
        "Failed to create project Successful",
        [20, 20]
      )
      await closeVscode()
      await contrastResult(expectedResults, workspacePath)
    } finally {
      // 无论测试成功还是失败，都保存截图
      screenShot.save()
    }
  })
})
