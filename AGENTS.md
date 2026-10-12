# Agent Execution Rules & Protocol

## 1. Absolute Transparency & Intent Communication
Before performing **ANY** action (reading files, executing commands, creating files, or editing existing code), you MUST provide explicit details in your response to the user:
- **WHAT**: Exactly what action is being performed, including specific file paths, symbols, functions, or terminal commands.
- **WHY**: The precise reason, rationale, and context behind this specific step. No actions should be performed without clear justification.
- **WHERE**: The exact target location (repository, path, file, function, line numbers).
- **FINDINGS / RESULT**: Immediately explain what was discovered or changed before deciding the next step.

## 2. Respect Existing Architecture
- **NEVER** discard, rewrite, or bypass existing core architecture (such as `@trikomi/core`, existing plugins, managers, or stores) without explicit agreement.
- Always inspect how the existing codebase implements features first (view related files, understand data flow, and respect established conventions).
- Propose architectural adjustments clearly before executing large-scale refactors.

## 3. Strict Verification & No Assumptions
- Never guess file structures, API signatures, or framework configurations.
- Verify everything step-by-step with targeted reads and explain the intent behind each inspection.
