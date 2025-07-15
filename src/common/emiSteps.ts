import { Page } from "playwright"
import { retry, screenShot } from "./utils"

/**
 * When emitting a select project event, it will select the project with the given name.
 * @param page vscode project
 * @param text project name
 */
async function emitSelectProject(page: Page, text: string) {
  await page
    .getByRole("option", { name: new RegExp(text) })
    .locator("a")
    .click()
}

/**
 * When emitting a select emit type.
 * @param page vscode project
 * @param type emit type
 */
async function emitSelectType(page: Page, type: string) {
  await screenShot.screenShot("select_emitter_type.png")
  let expectedDescriptionConfig = [
    { name: 'OpenAPI Document', description: 'Emitting OpenAPI3 Document from TypeSpec files.' },
    { name: 'Client Code', description: 'Emitting Client Code from TypeSpec files. Supported languages are .NET, Python, Java, JavaScript.' },
    { name: 'Server Stub', description: 'Emitting Server Stub from TypeSpec files. Supported languages are .NET, JavaScript.' }
  ]
  await retry(
    3,
    async () => {
      let emiSelectTypeBox = page.getByRole('option', { name: type }).locator('label')
      let emiSelectTypeBoxDescriptionArr = await emiSelectTypeBox.allTextContents();
      let emiSelectTypeBoxDescription = emiSelectTypeBoxDescriptionArr[0].slice(type.length)
      const expectedDescription = (expectedDescriptionConfig.find(cfg => cfg.name === type) || {}).description || "";
      if (emiSelectTypeBoxDescription == expectedDescription) {
        return true
      } else {
        console.error(`Description mismatched, expected "${expectedDescription}", got "${emiSelectTypeBoxDescription}".`)
        return false
      }
    },
    "Failed to find the emitSelectType description."
  )
  if (type == "OpenAPI Document" || type == "DefaultEmitterType") {
    await page.locator("a").filter({ hasText: type }).click()
  } else if (type == "Client Code") {
    await page.locator("a").filter({ hasText: "Client Code"}).first().click()
  } else if (type == "Server Stub") {
    await page.locator("a").filter({ hasText: /^Server Stub$/}).click()
  } else {
    await screenShot.screenShot("select_emitter_type_error.png")
    // 移除这里的 screenShot.save()，统一在测试的 finally 块中保存
    throw new Error("Unsupported emit type")
  }
}

/**
 * If the emit type is `OpenApiDocument`, the language will be selected next. Call this method to select
 * @param page vscode project
 */
async function emitSelectLanguageForOpenapi(page: Page) {
  await screenShot.screenShot("select_language_openapi.png")
  let expectedName = "OpenAPI3"
  let selectLangName
  let expectedDescription = "Emit openapi code for OpenAPI3 by TypeSpec library @typespec/openapi3."
  let selectLangDescription
  await retry(
    3,
    async () => {
      selectLangName = page
        .locator("a").filter({ hasText: /^OpenAPI3$/ })
      return (await selectLangName.count() > 0)
    },
    "Failed to find the openapi3 language for code emitting."
  )  
  await retry(
    3,
    async () => {
      let emiSelectLangBox = page.locator('label')
      let emiSelectLangBoxDescriptionArr = await emiSelectLangBox.allTextContents();
      selectLangDescription = emiSelectLangBoxDescriptionArr[0].slice(expectedName.length)
      if (selectLangDescription == expectedDescription) {
        return true
      } else {
        console.error(`Description mismatched, expected "${expectedDescription}", got "${selectLangDescription}".`)
        return false
      }
    },
    `Failed to find the openapi3 language for code emitting description.`
  )
  await selectLangName!.click()
}

/**
 * If the emit type is chosen, the language will be selected next. Call this method to select
 * @param page vscode project
 * @param language language name (OpenAPI3, Python, Java, .NET, JavaScript)
 * @param types emitter types (Client Code, Server Stub, OpenAPI Document)
**/

async function emitSelectLanguage(page: Page, language: string = "", types: string = "") {
  await screenShot.screenShot("select_language_" + language + ".png")
  let selectLangConfig: { name: string; description: string }[] = [];
  if (types == "Client Code") {
    selectLangConfig = [
      { name: 'Python', description: 'Emit client code for Python by TypeSpec library @typespec/http-client-python.' },
      { name: 'Java', description: 'Emit client code for Java by TypeSpec library @typespec/http-client-java.' },
      { name: '.NET', description: 'Emit client code for .NET by TypeSpec library @typespec/http-client-csharp.' },
      { name: 'JavaScript', description: 'Emit client code for JavaScript by TypeSpec library @typespec/http-client-js.' }
    ]
  }
  else if (types == "Server Stub") {
    selectLangConfig = [
      { name: '.NET', description: 'Emit server code for .NET by TypeSpec library @typespec/http-server-csharp.' },
      { name: 'JavaScript', description: 'Emit server code for JavaScript by TypeSpec library @typespec/http-server-js.' }
    ]
  }
  let languageName
  let languageDescription
  await retry(
    3,
    async () => {
      languageName = page.locator("a").filter({ hasText: language })
      return (await languageName.count() > 0)
    },
    `Failed to find the language for code emitting.`
  )
  await retry(
    3,
    async () => {
      let languageBox = page.getByRole("option", { name: language}).locator('label')
      let languageDescriptionArr = await languageBox.allTextContents();
      languageDescription = languageDescriptionArr[0].slice(language.length)
      const expectedDescription = (selectLangConfig.find(cfg => cfg.name === language) || {}).description || "";
      if (languageDescription == expectedDescription){
        return true
      } else {
        console.error(`Description mismatched, expected "${expectedDescription}", got "${languageDescription}".`)
        return false
      }
    },
    "Failed to find the language for code emitting description."
  )
  const languageList = ["OpenAPI3", "Python", "Java", ".NET", "JavaScript"]
  if (languageList.indexOf(language) != -1) {
    await page
      .locator("a")
      .filter({ hasText: language })
      .first()
      .click()    
  } else {
    await screenShot.screenShot("select_emitter_type_error.png")
    // 移除这里的 screenShot.save()，统一在测试的 finally 块中保存
    throw new Error("Unsupported language")
  }
}

/**
 * When emitting, choose emitters.
 * @param page vscode project
 * @param emitter emitter name
 * @description If the emitter name is not passed, it will choose "Choose another emitter".
 */
async function emiChooseEmitter(page: Page, emitter: string = "") {
  let chooseEmitterExpectedDescription = "Choose another emitter for code emitting"
  let chooseEmitterExpectedName = "Choose another emitter"
  let chooseEmitterName
  let chooseEmitterDescription

  await retry(
    3,
    async () => {
      chooseEmitterName = page
        .getByRole("option", { name: "Choose another emitter" })
        .locator("a").first()
      return (await chooseEmitterName.count() > 0)
    },
    `Failed to find the "Choose another emitter" button.`
  )
  await retry(
    3,
    async () => {
      let chooseEmitterBox = page.getByText('Choose another emitterChoose')
      let chooseEmitterDescriptionArr = await chooseEmitterBox.allTextContents();
      chooseEmitterDescription = chooseEmitterDescriptionArr[0].slice(chooseEmitterExpectedName.length)
      if (chooseEmitterDescription == chooseEmitterExpectedDescription) {
        return true
      } else {
        console.error(`Description mismatched, expected "${chooseEmitterExpectedDescription}", got "${chooseEmitterDescription}".`)
        return false
      }
    },
    "Failed to find the Choose another emitter description."
  )
  await chooseEmitterName!.click()
}

export { emitSelectProject, emitSelectType, emitSelectLanguageForOpenapi, emitSelectLanguage, emiChooseEmitter }
