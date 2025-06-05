import { beforeAll, beforeEach, describe } from "vitest"
import { retry, screenShot, test } from "../common/utils"
import { PreviewCasesConfigList, PreviewProjectTriggerType } from "./config"
import path from "node:path"
import {
  closeVscode,
  installExtensionForCommand,
  startWithCommandPalette,
  startWithRightClick,
} from "../common/commonSteps"
import fs from "node:fs"

beforeAll(() => {
  screenShot.setCreateType("preview")
})

beforeEach(() => {
  const previewTypespec = path.resolve(
    __dirname,
    "../../PreviewTypespecProject"
  )
  if (fs.existsSync(previewTypespec)) {
    let hasMainTsp = false
    for (const file of fs.readdirSync(previewTypespec)) {
      if (file === "main.tsp") {
        hasMainTsp = true
      } else {
        const filePath = path.resolve(previewTypespec, file)
        fs.rmSync(filePath, { recursive: true, force: true })
      }
    }
    if (!hasMainTsp) {
      throw new Error("Failed to find main.tsp file")
    }
  } else {
    throw new Error("Failed to find PreviewTypespecProject directory")
  }
})

describe.each(PreviewCasesConfigList)("PreviewAPIDocument", async (item) => {
  const { caseName, triggerType } = item
  test(caseName, async ({ launch }) => {
    screenShot.setDir(caseName)
    const workspacePath = path.resolve(
      __dirname,
      "../../PreviewTypespecProject"
    )
    const { page, extensionDir } = await launch({
      workspacePath,
    })
    await installExtensionForCommand(page, extensionDir)
    if (triggerType === PreviewProjectTriggerType.Command) {
      await page
        .getByRole("treeitem", { name: "main.tsp" })
        .locator("a")
        .click()
      await startWithCommandPalette(page, {
        folderName: "PreviewTypespecProject",
        command: "Preview API Documentation",
      })
    } else {
      await startWithRightClick(page, "Preview API Documentation")
    }
    await screenShot.screenShot("preview_api_document.png")
    await retry(
      10,
      async () => {
        const previewContent = page
          .locator("iframe")
          .contentFrame()
          .locator("html")
          .first()
        return (await previewContent.count()) > 0
      },
      "Failed to compilation completed successfully",
      3
    )
    await closeVscode()
  })
})
