# Domain Documentation Rules

This project uses a **single-context** domain structure.

## Layout

- `CONTEXT.md`: High-level domain architecture and boundaries at the repository root.
- `docs/adr/`: Architecture Decision Records.

## Consumer Rules

1. Before starting a task, agents read `CONTEXT.md` to understand system architecture and core constraints.
2. Refer to `docs/adr/` for key design decisions.
