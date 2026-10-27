# Feature boundaries

Feature modules own their page UI and local data contracts. Mock data can be
replaced by API services without moving route files or rewriting presentation
components.

Common visual primitives live in `components/ui`, while role-specific features
live under `components/features/admin` and `components/features/host`.
