export enum CreateProjectTriggerType {
  Click = "RightClick",
  Command = "CommandPalette",
}

type CreateConfigType = {
  caseName: string
  triggerType: CreateProjectTriggerType
  templateName: string
  templateNameDescription: string
  isEmptyFolder: boolean
  expectedResults: string[]
}

const createCase = "CreateTypespecProject"
let templateName = "Generic Rest API"
let templateNameDescription = "Create a project representing a generic REST API service."
let expectedResults = [
  ".gitignore",
  "main.tsp",
  "node_modules",
  "package-lock.json",
  "package.json",
  "tspconfig.yaml",
]

const CreateCasesConfigList: CreateConfigType[] = [
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  },
]

templateName = "Typespec library"
templateNameDescription = "Build your own TypeSpec library with custom types, decorators or linters."
expectedResults = [
  "lib",
  "node_modules",
  "src",
  "test",
  ".gitignore",
  "eslint.config.js",
  "package.json",
  "package-lock.json",
  "prettierrc.yaml",
  "tsconfig.json",
]

CreateCasesConfigList.push(
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  }
)

templateName = "Typespec emitter"
templateNameDescription = "Create a new package that emits artifacts from TypeSpec."
expectedResults = [
  "node_modules",
  "src",
  "test",
  ".gitignore",
  "eslint.config.js",
  "package.json",
  "package-lock.json",
  "prettierrc.yaml",
  "tsconfig.json",
]

CreateCasesConfigList.push(
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  }
)

templateName = "(rest-api-spec repo) Azure Data Plane Service Project"
templateNameDescription = "Create a project in rest-api-spec repo, representing an Azure service Data Plane API"
expectedResults = [
  "examples",
  ".gitignore",
  "client.tsp",
  "main.tsp",
  "tspconfig.yaml",
]

CreateCasesConfigList.push(
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  }
)

templateName = "(rest-api-spec repo) Azure Resource Manager Service Project"
templateNameDescription = "Create a project in rest-api-spec repo, representing an Azure service ARM API"
expectedResults = [
  "examples",
  ".gitignore",
  "employee.tsp",
  "main.tsp",
  "tspconfig.yaml",
]

CreateCasesConfigList.push(
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  }
)

templateName = "(stand alone) Azure Data Plane Service Project"
templateNameDescription = "Create a stand alone project representing an Azure service Data Plane API"
expectedResults = [
  "examples",
  "node_modules",
  ".gitignore",
  "client.tsp",
  "main.tsp",
  "package.json",
  "package-lock.json",
  "tspconfig.yaml",
]

CreateCasesConfigList.push(
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  }
)

templateName = "(stand alone) Azure Resource Manager Service Project"
templateNameDescription = "Create a stand alone project representing an Azure service ARM API"
expectedResults = [
  "examples",
  "node_modules",
  ".gitignore",
  "employee.tsp",
  "main.tsp",
  "package.json",
  "package-lock.json",
  "tspconfig.yaml",
]

CreateCasesConfigList.push(
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Click,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Click}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-EmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: true,
    expectedResults,
  },
  {
    triggerType: CreateProjectTriggerType.Command,
    caseName: `${createCase}-${templateName.replaceAll(" ", "")}-Trigger_${CreateProjectTriggerType.Command}-NonEmptyFolder`,
    templateName,
    templateNameDescription,
    isEmptyFolder: false,
    expectedResults,
  }
)

const DataPlaneAPIProviderNameTemplates = [
  "(rest-api-spec repo) Azure Data Plane Service Project",
  "(stand alone) Azure Data Plane Service Project",
]

const ARMAPIProviderNameTemplates = [
  "(rest-api-spec repo) Azure Resource Manager Service Project",
  "(stand alone) Azure Resource Manager Service Project"
]

export { CreateCasesConfigList, DataPlaneAPIProviderNameTemplates, ARMAPIProviderNameTemplates }
