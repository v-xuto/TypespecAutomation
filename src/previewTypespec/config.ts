export enum PreviewProjectTriggerType {
  Command = "Command",
  Click = "Click",
}

type PreviewConfigType = {
  caseName: string
  triggerType: PreviewProjectTriggerType
}

const PreviewCaseName = `PreviewTypespecProject`
const PreviewCasesConfigList: PreviewConfigType[] = []

PreviewCasesConfigList.push(
  {
    caseName: `${PreviewCaseName}-Trigger_${PreviewProjectTriggerType.Click}`,
    triggerType: PreviewProjectTriggerType.Click,
  },
  {
    caseName: `${PreviewCaseName}_Trigger_${PreviewProjectTriggerType.Command}`,
    triggerType: PreviewProjectTriggerType.Command,
  }
)

export { PreviewCasesConfigList }
