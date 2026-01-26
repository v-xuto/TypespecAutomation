enum EmitProjectTriggerType {
    Command = "Command",
    Click = "Click",
}

type EmitConfigType = {
    caseName: string
    selectType: string
    selectTypeLanguage: string
    triggerType: EmitProjectTriggerType
    expectedResults: string[]
}

// const EmitcaseName = `EmitTypespecProject`
const EmitCasesConfigList: EmitConfigType[] = []

EmitCasesConfigList.push(
    {   
        caseName: "EmitTypespecProject-ClientCode-Python-CommandPallette",
        selectType: "Client Code",
        selectTypeLanguage: "Python",
        triggerType: EmitProjectTriggerType.Command,
        expectedResults: ["http-client-python"],
    },
    {
        caseName: "EmitTypespecProject-ClientCode-Python-RightClick",        
        selectType: "Client Code",
        selectTypeLanguage: "Python",
        triggerType: EmitProjectTriggerType.Click,
        expectedResults: ["http-client-python"],
    },    
    {
        caseName: "EmitTypespecProject-ClientCode-Java-CommandPallette",
        selectType: "Client Code",
        selectTypeLanguage: "Java",
        triggerType: EmitProjectTriggerType.Command,
        expectedResults: ["http-client-java"],
    },
    {
        caseName: "EmitTypespecProject-ClientCode-Java-RightClick",
        selectType: "Client Code",
        selectTypeLanguage: "Java",
        triggerType: EmitProjectTriggerType.Click,
        expectedResults: ["http-client-java"],
    },
    {
        caseName: "EmitTypespecProject-ClientCode-DotNet-CommandPallette",
        selectType: "Client Code",
        selectTypeLanguage: ".NET",
        triggerType: EmitProjectTriggerType.Command,
        expectedResults: ["http-client-csharp"],
    },
    {
        caseName: "EmitTypespecProject-ClientCode-DotNet-RightClick",
        selectType: "Client Code",
        selectTypeLanguage: ".NET",
        triggerType: EmitProjectTriggerType.Click,
        expectedResults: ["http-client-csharp"],
    },
    {
        caseName: "EmitTypespecProject-ClientCode-Js-CommandPallette",
        selectType: "Client Code",
        selectTypeLanguage: "JavaScript",
        triggerType: EmitProjectTriggerType.Command,
        expectedResults: ["http-client-js"],
    },
    {
        caseName: "EmitTypespecProject-ClientCode-Js-RightClick",
        selectType: "Client Code",
        selectTypeLanguage: "JavaScript",
        triggerType: EmitProjectTriggerType.Click,
        expectedResults: ["http-client-js"],
    },
    {
        caseName: "EmitTypespecProject-Openapi3-CommandPallette",
        selectType: "OpenAPI Document",
        selectTypeLanguage: "OpenAPI3",
        triggerType: EmitProjectTriggerType.Command,
        expectedResults: ["openapi3"],
    },
    {
        caseName: "EmitTypespecProject-Openapi3-RightClick",
        selectType: "OpenAPI Document",
        selectTypeLanguage: "OpenAPI3",
        triggerType: EmitProjectTriggerType.Click,
        expectedResults: ["openapi3"],
    },
    {
        caseName: "EmitTypespecProject-ServerStub-DotNet-CommandPallette",
        selectType: "Server Stub",
        selectTypeLanguage: ".NET",
        triggerType: EmitProjectTriggerType.Command,
        expectedResults: ["http-server-csharp"],
    },
    {
        caseName: "EmitTypespecProject-ServerStub-DotNet-RightClick",
        selectType: "Server Stub",
        selectTypeLanguage: ".NET",
        triggerType: EmitProjectTriggerType.Click,
        expectedResults: ["http-server-csharp"],
    },
    {
        caseName: "EmitTypespecProject-ServerStub-Js-CommandPallette",
        selectType: "Server Stub",
        selectTypeLanguage: "JavaScript",
        triggerType: EmitProjectTriggerType.Command,
        expectedResults: ["http-server-js"],
    },
    {
        caseName: "EmitTypespecProject-ServerStub-Js-RightClick",
        selectType: "Server Stub",
        selectTypeLanguage: "JavaScript",
        triggerType: EmitProjectTriggerType.Click,
        expectedResults: ["http-server-js"],
    }
)

export { EmitCasesConfigList }