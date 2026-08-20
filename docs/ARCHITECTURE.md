# Campus Management System Architecture

## Repository layout

```text
Campus-Management-System/
├── backend/                  # FastAPI backend
│   ├── server.py             # Main application entry point
│   ├── requirements.txt      # Python dependencies
│   ├── render.yaml           # Render deployment configuration
│   ├── .env.example          # Backend environment template
│   └── deployment_check.py   # Deployment configuration check
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── App.js            # Main React application and routing
│   │   ├── index.js          # React bootstrap
│   │   ├── App.css           # Application styles
│   │   ├── index.css         # Global styles
│   │   ├── components/       # Pages and reusable UI components
│   │   ├── utils/            # Shared frontend utilities
│   │   ├── hooks/            # React hooks
│   │   └── lib/              # Supporting frontend utilities
│   ├── package.json
│   └── craco.config.js
│
├── docs/                     # Project documentation
├── .github/                  # GitHub configuration/workflows
├── .env.example              # Root environment template
├── .gitignore
└── README.md
```

## Runtime flow

```text
React entry point
      ↓
frontend/src/App.js
      ↓
page/UI components
      ↓
frontend/src/utils/api.js
      ↓
backend/server.py
      ↓
MongoDB / external AI services
```

## Important rule

Files used by the runtime are kept in their existing locations unless imports and deployment configuration are updated at the same time. Standalone debugging scripts and historical fix notes are not part of the application runtime and should not be mixed with source code.
