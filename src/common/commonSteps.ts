import { Locator, Page } from "playwright"
import { retry, screenShot, sleep } from "./utils"
import { keyboard, Key } from "@nut-tree-fork/nut-js"
import fs from "node:fs"
import path from "node:path"

/**
 * Before comparing the results, you need to check whether the conditions for result comparison are met.
 * @param page vscode object
 * @param text The text in which the element appears
 * @param errorMessage Error message when element does not appear
 * @param [count, sleep] count: Retry times, sleep: Sleep time between retries
 */
async function preContrastResult(
  page: Page,
  text: string,
  errorMessage: string,
  [count, sleep]: number[] = [10, 5]
) {
  await retry(
    count,
    async () => {
      const contrastResult = page.getByText(new RegExp(text)).first()
      console.log("checking", +new Date())

      return (await contrastResult.count()) > 0
    },
    errorMessage,
    sleep
  )
}

/**
 * Results comparison
 * @param res List of expected files
 * @param dir The directory to be compared needs to be converted into an absolute path using path.resolve
 */
async function contrastResult(res: string[], dir: string) {
  let resLength = 0
  if (fs.existsSync(dir)) {
    console.log(fs.readdirSync(dir))
    resLength = fs.readdirSync(dir).length
  }
  if (resLength !== res.length) {
    await screenShot.screenShot("error.png")
    screenShot.save()
    throw new Error("Failed to matches all files")
  }
}

/**
 * All cases need to execute the steps. Click the top input box and enter the command
 * @param page vscode object
 * @param {folderName, command}
 * folderName: The text in the top input box is usually the current open root directory,
 * command: After the top input box pops up, the command to be executed
 */
async function start(
  page: Page,
  { folderName, command }: { folderName: string; command: string }
) {
  await sleep(2)
  await page.locator("li").filter({ hasText: folderName }).first().click()
  console.log("top click")
  await sleep(2)
  // await screenShot.screenShot("open_top_panel.png")
  await page.getByRole("textbox", {name: "Search files by name (append"}).first().fill(`>Typespec: ${command}`)
  console.log("top input")

  let listForCreate: Locator
  await retry(
    5,
    async () => {
      listForCreate = page
        .locator("a")
        .filter({ hasText: `TypeSpec: ${command}` })
        .first()
      return (await listForCreate.count()) > 0
    },
    "Failed to find the specified option"
  )
  // await screenShot.screenShot("input_command.png")
  await listForCreate!.click()
}

/**
 * In vscode, when you need to select a folder or a file, call this method
 * @param file When selecting a file, just pass it in. If you need to select a folder, you do not need to pass this parameter in.
 */
async function selectFolder(file: string = "") {
  await sleep(10)
  await screenShot.screenShot("select_folder.png")
  await keyboard.pressKey(Key.Enter)
  await keyboard.releaseKey(Key.Enter)
}

/**
 * If the current folder is not empty, sometimes a pop-up will appear
 * asking "Do you want to continue selecting the current folder as the root directory?".
 * In this method, select "yes" because selecting "no" does not make sense.
 * @param page vscode object
 */
async function notEmptyFolderContinue(page: Page) {
  let yesBtn: Locator
  await retry(
    5,
    async () => {
      yesBtn = page.locator("a").filter({ hasText: "Yes" }).first()
      return (await yesBtn.count()) > 0
    },
    "Failed to find yes button",
    1
  )
  await screenShot.screenShot("not_empty_folder_continue.png")
  await yesBtn!.click()
}

/**
 * Install plugins directly from vscode
 * @param page vscode object
 */
async function installExtension(page: Page) {
  await page
    .getByRole("tab", { name: /Extensions/ })
    .locator("a")
    .click()
  await page.keyboard.type("Typespec")
  await page
    .getByLabel(/TypeSpec/)
    .getByRole("button", { name: "Install" })
    .click()
  await page.getByRole("button", { name: "Trust Publisher & Install" }).click()
  await sleep(20)
  await page
    .getByRole("tab", { name: /Explorer/ })
    .locator("a")
    .click()
}

/**
 * Install plugins directly from a local file
 * @param page vscode object
 * @param fullFilePath The absolute address of the plugin `vsix` needs to be obtained using the path.resolve method
 * @param workspacePath The workspace path of the given test case
 */
async function installExtensionForFile(page: Page, fullFilePath: string, workspacePath: string) {

  await fs.promises.copyFile(fullFilePath, path.resolve(workspacePath, "extension.vsix"))
  await sleep(8)
  await retry(
    10,
    async () => {
      await page.getByRole('heading', { name: 'Explorer', exact: true }).click()
      await sleep(5)
      await page.getByRole("treeitem", { name : "extension.vsix" }).locator('a').click({button: "right"})
      let locator = page.getByRole('menuitem', { name: 'Install Extension VSIX'})
      return await locator.count() > 0
    },
    `Failed to locate "Install Extension VSIX"`,
    1
  )

  await sleep(3)
  await page.getByRole('menuitem', { name: 'Install Extension VSIX'})
    .click()

  await retry(
    10,
    async () => {
      let completeLocator = page.getByText("Completed installing")
      return await completeLocator.count() > 0
    },
    "Fail to install the extension.",
    1
  )
  await sleep(3)
  await fs.promises.rm(path.resolve(workspacePath, "extension.vsix"))
  await screenShot.screenShot("install_extension_file.png")
}

async function closeVscode() {
  await keyboard.pressKey(Key.LeftAlt, Key.F4)
  await keyboard.releaseKey(Key.LeftAlt, Key.F4)
}

export {
  start,
  contrastResult,
  selectFolder,
  preContrastResult,
  notEmptyFolderContinue,
  installExtension,
  installExtensionForFile,
  closeVscode,
}
