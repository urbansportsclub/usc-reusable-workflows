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
    A[/USC Gym/] --> C
    B[/Backstage Custom Actions/] --> C
    C[Reusable workflow] --> |Push| D

    D[GitHub packages] --> |Pull| E
    D --> |Pull| F

    E[Project 1]
    F[Project 2]
```