# Project Context: Just-For-Vuln-Test (Vulnerable E-Commerce Web App)

## Overview
`Just-For-Vuln-Test` is an e-commerce web application built with **Node.js (Express)** backend, **MSSQL** (Microsoft SQL Server database driver `mssql`), and **Vue 3** frontend (Vite).
It contains intentional security vulnerabilities specifically designed for security assessment, penetration testing, and code auditing exercises.

## Vulnerabilities Included
1. **SQL Injection (SQLi)**: Raw string concatenation in product search & login authentication endpoints.
2. **Cross-Site Scripting (XSS)**: Reflected XSS in search query display & Stored XSS in product reviews and profile bio rendered using unescaped HTML (`v-html`).
3. **Insecure Direct Object Reference (IDOR)**: User profile update (`PUT /api/users/:id`) and Order details (`GET /api/orders/:id`) without user ownership validation.
4. **Hardcoded Secret / Fallback**: Application uses weak fallback secret or hardcoded secret key in authentication logic if `.env` is unconfigured.
5. **Path Traversal**: File download / avatar view endpoint (`GET /api/files/download?file=...`) accepting arbitrary paths without directory traversal sanitization.

## Tech Stack
- Backend: Express.js, `mssql`, `jsonwebtoken`, `cors`, `dotenv`, `multer`
- Frontend: Vue 3, Vite, Vue Router, Pinia / Axios
- Database: Microsoft SQL Server (`mssql`) with SQL setup script (`schema.sql`)
