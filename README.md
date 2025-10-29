# 🕵️ 504mvp — Lightweight Web Vulnerability Scanner (NPM)

**504mvp** is a lightweight web vulnerability scanner that runs locally.  
It automatically detects URL parameters and performs simple **response-diff** checks to quickly identify basic web issues like SQL Injection or XSS.

> ⚙️ Runtime: Node.js (ESM)  
> 🌐 Purpose: Learning and entry-level cloud security practice  
> 📦 Delivery: NPM package + CLI tool (`504scan`)

---

## 🧭 Project Overview

| Item | Details |
|------|---------|
| **Project** | 504mvp |
| **Description** | A lightweight local web vuln scanner (parameter discovery + response-diff) |
| **Future Goal** | A web service that runs a vulnerability scan within 3 minutes when you submit a domain and returns a short report |
| **Tech Stack** | Node.js, Axios (or fetch), ESM, http-server |
| **License** | MIT License |

---

## 🧩 Key Features

| Feature | Description |
|--------:|-------------|
| 🔍 Parameter Discovery | Automatically extracts query parameters from a URL |
| ⚖️ Response Comparison | Compares base response vs payload-injected response |
| 🚨 Error Keyword Detection | Looks for `SQL`, `error`, `Exception`, etc. in test responses |
| 🧪 Non-destructive Testing | Non-intrusive checks that avoid destructive requests |
| 📄 CLI Support | Run easily: `npx 504scan "<URL>"` |
| 🌐 Local Test Site | Includes a local HTML test page for safe practice |

---

## 📁 Project Structure

```text
504mvp/
├── bin/                # CLI entry script
│   └── cli.js
├── lib/                # Scanner core logic
│   ├── scanner.js
│   └── utils.js
├── test_site/          # Local test HTML page
│   └── index.html
├── .vscode/            # VS Code settings (optional)
├── .gitignore
├── LICENSE
├── README.md
└── package.json