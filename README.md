# alaina-yn — Project Workspace

Data-driven project directory and case-study workspace.

## Canonical deployment

- Cloudflare Pages: https://alaina-yn-projects.pages.dev/
- GitHub: https://github.com/alaina-yn/alaina-yn-projects
- Personal hub: https://alaina-yn.pages.dev/

## Data model

`data/projects.json` is the single content source. `index.html` renders the filterable directory. `project.html?id=<project-id>` renders the case-study path: Problem → Assessment → Evidence → Findings → Remediation → Executive Decision.

Conditional CTA priority is: live app → case study → artifact → repository. Empty buttons are never rendered.
