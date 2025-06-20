import { Page, _electron } from "playwright"
import fs from "node:fs"
import os from "node:os"
import path, { resolve } from "node:path"
import { test as baseTest, inject } from "vitest"
import screenshot from "screenshot-desktop"
import moment from "moment"
import { closeVscode } from "./commonSteps"

interface Context {
  page: Page
  extensionDir: string
}

type LaunchFixture = (options: {
  extensionPath?: string
  workspacePath: string
  trace?: "on" | "off"
}) => Promise<Context>

/**
 * The core method of the test, this method is encapsulated.
 * With the help of the `_electron` object, you can open a vscode and get the page object
 */
const test = baseTest.extend<{
  launch: LaunchFixture
  taskName: string
  logPath: string
}>({
  taskName: async ({ task }, use) => use(`${task.name}-${task.id}`),
  logPath: async ({ taskName }, use) =>
    use(resolve(`./tests-logs-${taskName}.txt`)),
  launch: async ({ taskName, logPath }, use) => {
    const teardowns: (() => Promise<void>)[] = []

    await use(async (options) => {
      const executablePath = inject("executablePath")
      const workspacePath = options.workspacePath
      let envOverrides = {}
      const codePath = path.join(executablePath, "../bin")
      envOverrides = {
        PATH: `${codePath}${path.delimiter}${process.env.PATH}`,
      }
      const tempDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "typespec-automation")
      )

      const app = await _electron.launch({
        executablePath,
        env: {
          ...process.env,
          ...envOverrides,
          VITEST_VSCODE_E2E_LOG_FILE: logPath,
          VITEST_VSCODE_LOG: "verbose",
        },
        args: [
          "--no-sandbox",
          "--disable-gpu-sandbox",
          "--disable-updates",
          "--skip-welcome",
          "--skip-release-notes",
          "--disable-workspace-trust",
          `--extensions-dir=${path.resolve(tempDir, "extensions")}`,
          `--user-data-dir=${path.resolve(tempDir, "user-data")}`,
          `--folder-uri=file:${path.resolve(workspacePath)}`,
        ].filter((v): v is string => !!v),
      })
      const page = await app.firstWindow()
      const userSettingsPath = path.join(
        tempDir,
        "user-data",
        "User",
        "settings.json"
      )
      fs.writeFileSync(
        userSettingsPath,
        JSON.stringify({
          "typespec.initTemplatesUrls": [
            {
              name: "Azure",
              url: "https://aka.ms/typespec/azure-init",
            },
          ],
        })
      )
      // spawn("code", [
      //   "--install-extension",
      //   path.resolve(__dirname, "../../extension.vsix"),
      //   "--extensions-dir",
      //   path.resolve(tempDir, "extensions"),
      // ])
      return { page, extensionDir: path.join(tempDir, "extensions") }
    })

    for (const teardown of teardowns) await teardown()
  },
})

async function sleep(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000))
}

/**
 * @param count Number of retries
 * @param fn Main process retry function, when this function returns true, retry ends
 * @param errMessage If the number of retries reaches 0, an error is thrown
 * @param gap
 * @returns Retry Interval
 */
async function retry(
  count: number,
  fn: () => Promise<boolean>,
  errMessage: string,
  gap: number = 2
) {
  while (count > 0) {
    await sleep(gap)
    if (await fn()) {
      return
    }
    count--
  }
  await screenShot.screenShot("error.png")
  screenShot.save()
  await closeVscode()
  throw new Error(errMessage)
}

/**
 * @description Screenshot class
 * @class Screenshot
 * @property {string} createType - createType: "create" | "emit" | "import"
 * @property {string} currentDir - currentDir: The directory where the screenshots are saved
 * @property {Array} fileList - fileList: Screenshot file list
 * @property {Object} typeMenu - typeMenu: Mapping of folder names corresponding to screenshot types
 * @property {boolean} isLocalSave - isLocalSave: Whether to save screenshots when running locally. Not saved by default, only saved on Ci
 * @method setCreateType - Set the screenshot type. Different types correspond to different folders.
 * @method setDir - Set the directory where the screenshots are saved. Each case has its own directory.
 * @method screenShot - Screenshot method
 */
class Screenshot {
  private createType: "create" | "emit" | "import" | "preview" = "create"
  private currentDir = ""
  private fileList: {
    fullPath: string
    buffer: Buffer
    date: number
  }[] = []
  private typeMenu = {
    create: "CreateTypeSpecProject",
    emit: "EmitFromTypeSpec",
    import: "ImportTypeSpecFromOpenAPI3",
    preview: "PreviewAPIDocument",
  }

  setCreateType(createType: "create" | "emit" | "import" | "preview") {
    this.createType = createType
  }

  save() {
    if (this.fileList.length === 0) {
      return
    }
    // Smaller dates are placed first to keep the files in order
    this.fileList.sort((a, b) => a.date - b.date)
    for (let i = 0; i < this.fileList.length; i++) {
      const fullPathItem = this.fileList[i].fullPath.split("\\")
      if (os.platform() === "win32") {
        fullPathItem[fullPathItem.length - 1] = `${i}_${
          fullPathItem[fullPathItem.length - 1]
        }`
      } else {
        const lastslashIdx = fullPathItem[fullPathItem.length - 1].lastIndexOf("/")
        const fileName = fullPathItem[fullPathItem.length - 1];
        if (lastslashIdx !== -1) {
          const prefix = fileName.substring(0, lastslashIdx + 1);
          const suffix = fileName.substring(lastslashIdx + 1);
          fullPathItem[fullPathItem.length - 1] = `${prefix}${i}_${suffix}`;
        } else {
          fullPathItem[fullPathItem.length - 1] = `${i}_${fileName}`;
        }
      }
      fs.mkdirSync(path.dirname(path.join(...fullPathItem)), {
        recursive: true,
      })
      fs.writeFileSync(path.join(...fullPathItem), this.fileList[i].buffer)
    }
  }

  async screenShot(fileName: string) {
    await sleep(3)
    let img = await screenshot()
    let buffer = Buffer.from(img)
    let rootDir =
      process.env.BUILD_ARTIFACT_STAGING_DIRECTORY ||
      path.resolve(__dirname, "../..")
    const platformDir = os.platform() === "win32" ? "/images-windows" : "/images-linux"
    const fullPath = path.join(
      rootDir,
      platformDir,
      this.typeMenu[this.createType],
      this.currentDir,
      fileName
    )
    this.fileList.push({
      fullPath,
      buffer,
      date: +new Date(),
    })
  }

  setDir(dir: string) {
    this.currentDir = dir + moment().format("_HH_mm_ss")
    this.fileList = []
  }

  getDir() {
    return this.typeMenu[this.createType] + "/" + this.currentDir
  }
}

const screenShot = new Screenshot()

export { sleep, test, retry, screenShot }
