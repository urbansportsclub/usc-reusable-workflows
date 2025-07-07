# Publish Packages Architecture

```kroki-mermaid
%%{init: {
	'theme':'base',
	'themeVariables': {
        'primaryColor': '#2A2E35',
        'primaryBorderColor': '#5E81AC',
        'clusterBkg': '#3B4252',
        'tertiaryColor': '#4C566A',
        'tertiaryBorderColor': '#81A1C1',
        'lineColor': '#88C0D0',
        'titleColor': '#D8DEE9',
        'edgeLabelBackground': '#3B4252',
        'primaryTextColor': '#ECEFF4'
	}}
}%%
flowchart TD
    B[/"Standard project"/] --> C["Reusable workflow : Publish Package"]
    
    subgraph Requirements for Publish
      direction TB
      S[Secrets: NODE_AUTH_TOKEN]
      I[Input: workspace-name]
    end

    C --> S
    C --> I

    C -- "Push with npm publish" --> D["GitHub Packages"]

    subgraph Usage Requirements
      direction TB
      P1[Add package to dependencies<br/>in package.json]
    end

    D -- Pull --> E["Project 1"]
    D -- Pull --> F["Project 2"]

    E --> P1
    F --> P1
```