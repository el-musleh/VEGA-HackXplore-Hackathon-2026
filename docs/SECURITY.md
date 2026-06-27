# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible
receiving such patches depends on the severity of the vulnerability.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately via
[GitHub Private Vulnerability Reporting](https://github.com/el-musleh/template/security/advisories/new).

Please **do not** open a public issue for security-related matters.

We aim to respond within 48 hours and will keep you informed of our progress
as we investigate and address the issue.

## Security Measures

This repository uses the following automated security checks:

- **CodeQL** – Static analysis for common vulnerability patterns
- **Bandit** – Python security linter
- **pip-audit** – Dependency vulnerability scanner
- **Secret scanning** – GitHub-native detection of leaked secrets
- **Dependabot alerts** – Notifications for vulnerable dependencies
