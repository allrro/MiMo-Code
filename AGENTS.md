- Use MiMoCode Compose skills when available, otherwise use superpowers skill if installed.
- To regenerate the JavaScript SDK, run `./packages/sdk/js/script/build.ts`.
- ALWAYS USE PARALLEL TOOLS WHEN APPLICABLE.
- The default branch in this repo is `main`.
- CI triggers on both `main` and `dev` branches.
- Prefer automation: execute requested actions without confirmation unless blocked by missing info or safety/irreversibility.

## Core Focus (as of 2025-06-18)

Our core development focus is the **TUI** (terminal UI) implementation in `packages/opencode/src/cli/cmd/tui/`. We do not currently provide support for Web or App interfaces. All operations should default to checking the TUI implementation first.

## Style Guide

### General Principles

- Keep things in one function unless composable or reusable
- Avoid `try`/`catch` where possible
- Avoid using the `any` type
- Use Bun APIs when possible, like `Bun.file()`
- Rely on type inference when possible; avoid explicit type annotations or interfaces unless necessary for exports or clarity
- Prefer functional array methods (flatMap, filter, map) over for loops; use type guards on filter to maintain type inference downstream
- In `src/config`, follow the existing self-export pattern at the top of the file (for example `export * as ConfigAgent from "./agent"`) when adding a new config module.

Reduce total variable count by inlining when a value is only used once.

```ts
// Good
const journal = await Bun.file(path.join(dir, "journal.json")).json()

// Bad
const journalPath = path.join(dir, "journal.json")
const journal = await Bun.file(journalPath).json()
```

### Destructuring

Avoid unnecessary destructuring. Use dot notation to preserve context.

```ts
// Good
obj.a
obj.b

// Bad
const { a, b } = obj
```

### Variables

Prefer `const` over `let`. Use ternaries or early returns instead of reassignment.

```ts
// Good
const foo = condition ? 1 : 2

// Bad
let foo
if (condition) foo = 1
else foo = 2
```

### Control Flow

Avoid `else` statements. Prefer early returns.

```ts
// Good
function foo() {
  if (condition) return 1
  return 2
}

// Bad
function foo() {
  if (condition) return 1
  else return 2
}
```

### Schema Definitions (Drizzle)

Use snake_case for field names so column names don't need to be redefined as strings.

```ts
// Good
const table = sqliteTable("session", {
  id: text().primaryKey(),
  project_id: text().notNull(),
  created_at: integer().notNull(),
})

// Bad
const table = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectID: text("project_id").notNull(),
  createdAt: integer("created_at").notNull(),
})
```

## Testing

- Avoid mocks as much as possible
- Test actual implementation, do not duplicate logic into tests
- Tests cannot run from repo root (guard: `do-not-run-tests-from-root`); run from package dirs like `packages/opencode`.

## Type Checking

- Always run `bun typecheck` from package directories (e.g., `packages/opencode`), never `tsc` directly.

## Goal Alignment

Before executing, treat the user's stated approach as a "map," not the complete "territory." The user's plan is one possible path to their goal — not necessarily the best or only path.

**Identify before starting**:
1. The user's actual end goal (not just the stated task)
2. Success criteria — how will we know this worked?
3. Hard constraints that cannot be violated
4. Whether the user's proposed approach is the only viable path, or just one option
5. Real-world information that could make the original approach fail

Unless explicitly told otherwise, preserve the user's goals and constraints while remaining free to find a more effective implementation path. Do not treat the user's technical choices as immutable — treat them as defaults that can be overridden with justification.

**Skip when**: The task is trivial, the user is an expert who has already validated the approach, or the constraint is explicit and non-negotiable.

## Blind-Spot Scan

Before executing complex tasks, perform a blind-spot scan to surface unknowns that could change the approach.

**Trigger conditions** (any one suffices):
- Task touches 3+ files or crosses module boundaries
- Working in unfamiliar codebase areas or third-party integrations
- Task involves data migration, auth, security, or irreversible operations
- User's stated plan assumes facts not yet verified

**Scan process**:
1. Grep/glob for hidden dependencies, related tests, prior breaking changes
2. Check for existing patterns that constrain the approach
3. Identify assumptions the user's plan rests on but hasn't verified

**Output**: Max 3-5 questions sorted by impact. Only ask questions whose answers would meaningfully change the implementation path. Skip low-impact details that can be resolved during execution.

**Integration**: This replaces the need for exhaustive upfront planning on medium-complexity tasks. For high-complexity tasks, feed findings into the plan mode workflow.

## Reference-First

When a task involves existing code, designs, documents, or organizational patterns, study the real artifacts before relying on abstract descriptions.

**Available references**:
- Existing code and interfaces
- Prior implementations and their evolution
- Design files, prototypes, or mockups
- Test suites and incident records
- Related documentation
- Examples the user has explicitly approved
- Mature implementations in similar systems

A real artifact is almost always more informative than a verbal description of it. But do not blindly copy — identify which parts represent core intent versus historical accident or outdated constraints.

**Skip when**: The task is greenfield with no existing precedents, or the user's description is the only available source of truth.

## Differential Options

When the task involves design, UI, architecture selection, or product direction where preferences are hard to articulate in words alone, generate multiple differentiated options instead of a single proposal.

**When to apply**:
- Design/layout decisions (visual or structural)
- Architecture or technology selection with multiple valid approaches
- Product direction where user can't fully describe what they want
- Any situation where "I'll know it when I see it" applies

**How to execute**:
- Generate 2-4 options that differ on core dimensions (architecture, interaction model, data flow, technology choices)
- Avoid surface-level variations (color, naming, minor layout shifts)
- Each option must clearly state its trade-offs
- Present options side by side for comparison

**Skip when**: The task has clear, unambiguous requirements with no meaningful design space. Don't generate options for trivial choices.

## Challenge Assumed Trade-offs

Before accepting the user's implicit constraints ("good/fast/cheap — pick two"), first test whether the trade-off is real.

**Process**:
1. Identify the trade-offs the user is assuming (e.g., "this will be slow if we want quality")
2. Attempt to satisfy multiple goals simultaneously via parallelization, automation, reuse, or reframing
3. Only accept a trade-off after demonstrating it's genuinely necessary

**How to communicate**: Frame as "let me try to do both first" rather than rejecting the user's framing. Present evidence when a trade-off proves real.

**Hard boundaries** (never challenge these): Security, privacy, legal compliance, data integrity, reliability of critical paths. These are real constraints regardless of tooling.

## Deviation Reporting

When implementation diverges from the original plan, explicitly report the deviation rather than silently adjusting.

**What to report**:
- What was encountered that wasn't anticipated
- Why the original path no longer applies
- What alternative was taken and why
- Risk or scope implications of the change
- Whether original acceptance criteria still hold

**When to report**:
- Mid-task: only for deviations that change scope, risk profile, or architecture
- At delivery: summarize all significant deviations in the final output

**What NOT to report**: Minor implementation details that don't affect the outcome. No running logs of every small adjustment.

## Reverse Verification

For complex deliverables, verify the user actually understands what was built, not just that they received it.

**Applies to**:
- Multi-file changes affecting architecture
- New systems or significant refactors
- Changes the user will need to maintain or explain to others

**How to execute**:
- After delivery, ask 2-3 targeted questions focused on what the user needs to own
- Questions should test understanding of key decisions, not trivia
- Example: "If you need to add a new provider to this system, which files would you modify and why?"

**Skip for**: Simple bug fixes, single-file changes, or tasks where the user is clearly already deep in the code.

## Value Assessment

Before large-scale generation (10+ files, complete systems, extensive documentation), briefly assess whether the output will create value.

**Quick checks**:
- What real problem does this solve? Who benefits?
- Is there a simpler approach that achieves 80% of the value?
- Is the expected value of continuing higher than the cost?
- Are we solving the problem, or just optimizing the workflow?

**How to communicate**: Don't refuse the task. Surface the assessment as context: "This would generate X files to solve Y. I want to confirm this is the right scope before proceeding — would a simpler approach work?"

**Core principle**: Building is easier than ever, but creating value is still hard. Optimize for outcomes, not output volume.
