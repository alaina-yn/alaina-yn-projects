# Moriom Jahan Madha — Governance Case Library + Review Labs

An independent case-study directory with **ten documented sample workflows** and **three fully functional browser-only review exercises**:

- `project.html?id=<id>`: unique case narratives based on ten existing portfolio topics.
- `labs.html#audit`: five-control evidence-coverage and exception review.
- `labs.html#vendor`: vendor inherent-risk triage and proof gates.
- `labs.html#ai`: AI use-case impact/autonomy/data triage and reviewer gates.

The labs run entirely in the browser. No real confidential or personal data should be entered. There is **no backend, database, sign-in, compliance certification, legal determination, control testing or production deployment**. JSON exports intentionally include the synthetic marker `illustrative_only`.

## Local preview and test

```bash
python3 -m http.server 8001
node tests/logic.test.js
```

Open `http://localhost:8001/` and navigate to `labs.html`. The site should not be opened with `file://` because the browser may block its local JSON request.

## Architecture

```text
index.html               Searchable, filterable case library
project.html             10 case narratives rendered from a shared JSON catalogue
labs.html                3 input and decision examples
assets/styles.css        Responsive styling and accessible focus states
assets/catalogue.js      Safe content rendering and filters
assets/logic.js          Pure scoring functions, independently unit-tested
assets/labs.js           Browser controls and JSON export
data/projects.json       Canonical ten-case portfolio data
tests/logic.test.js      Edge and guardrail tests
```

All cases are presented as illustrative educational studies; copied content, framework mappings and actual authorship should be checked by the profile owner before publication. Original topics were drawn from public `alaina-yn/alaina-yn-projects` repository data, and the experience is an original restructuring—not a clone of another portfolio.

## Hosting

Publish the **contents of this directory** into the repository root of `alaina-yn/alaina-yn-projects`. For Cloudflare Pages, no build command and output at root. Check project routes, scripts and mobile layout on staging before pointing public links here.

## Decision logic

### Evidence review
Five evidence-status inputs. `current` counts toward coverage, while stale, unreviewed, and missing remain distinct. Missing evidence blocks a positive coverage conclusion. 100% coverage **does not establish control effectiveness**.

### Supplier triage
Illustrative score: dependency 1–3 + data sensitivity 0/2/3 + external AI 0/2 + subprocessors 0/1 => 1–9. Sample tiers: 1–3 low, 4–6 moderate, 7–9 high. Any unresolved evidence defers disposition. Not residual risk.

### AI use-case intake
Illustrative score: impact 1–3 + autonomy 0/2/3 + information 0/2/3 => 1–9. Sample tiers: 1–3 lower, 4–6 material, 7–9 elevated. Missing named reviewer or evaluation defers. **This is not a NIST-defined formula** and never provides final approval.
