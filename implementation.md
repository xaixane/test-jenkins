# Jenkins CI/CD Implementation - Project & Setup Specification

---

## 📦 PROJECT SPECIFICATION

### Project Name
**TaskMaster API** - A simple Task Management REST API

### Project Purpose
Demonstrate a complete, production-grade CI/CD pipeline using Jenkins with real-world best practices.

### Project Type
- **Language**: Node.js (JavaScript/TypeScript)
- **Framework**: Express.js
- **Database**: SQLite (for simplicity, no external DB setup needed)
- **Architecture**: REST API with controllers, models, services

### Project Features

#### Core API Endpoints
```
POST   /api/tasks              - Create a new task
GET    /api/tasks              - List all tasks
GET    /api/tasks/:id          - Get single task
PUT    /api/tasks/:id          - Update task
DELETE /api/tasks/:id          - Delete task
GET    /health                 - Health check endpoint
```

#### Task Model
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "pending|in-progress|completed",
  "priority": "low|medium|high",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 4.x |
| **Database** | SQLite 3 |
| **Testing** | Jest 29.x |
| **Linting** | ESLint 8.x |
| **Formatting** | Prettier |
| **Build** | Webpack/esbuild |
| **Containerization** | Docker |
| **Package Manager** | npm |

### Project Structure
```
taskmaster-api/
├── src/
│   ├── controllers/          # API route handlers
│   │   └── taskController.js
│   ├── models/               # Database models
│   │   └── Task.js
│   ├── services/             # Business logic
│   │   └── taskService.js
│   ├── middleware/           # Express middleware
│   │   └── errorHandler.js
│   ├── db/                   # Database setup
│   │   └── sqlite.js
│   └── app.js                # Express app setup
├── tests/
│   ├── unit/                 # Unit tests
│   │   ├── taskService.test.js
│   │   └── taskController.test.js
│   ├── integration/          # Integration tests
│   │   └── api.test.js
│   └── e2e/                  # End-to-end tests
│       └── workflows.test.js
├── docker/
│   ├── Dockerfile            # Production image
│   └── docker-compose.yml    # Local dev setup
├── .github/
│   └── workflows/            # GitHub Actions (optional)
├── .jenkinsci/
│   └── Jenkinsfile           # Jenkins pipeline configuration
├── package.json              # Dependencies & scripts
├── .eslintrc.json           # Linting rules
├── jest.config.js           # Testing configuration
└── README.md                # Project documentation
```

### Key Scripts in package.json
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "lint": "eslint src/ tests/",
    "lint:fix": "eslint src/ tests/ --fix",
    "build": "webpack --mode production",
    "audit": "npm audit",
    "docker:build": "docker build -t taskmaster-api:latest .",
    "docker:run": "docker run -p 3000:3000 taskmaster-api:latest"
  }
}
```

### Test Coverage Goals
- **Minimum Coverage**: 80% (enforced in pipeline)
- **Unit Tests**: 50+ tests
- **Integration Tests**: 15+ tests
- **E2E Tests**: 5+ workflows

---

## 🚀 JENKINS SETUP SPECIFICATION

### Jenkins Version
- **Version**: Jenkins 2.400+ (LTS - Long Term Support)
- **Installation Method**: Docker container (easiest for demo)
- **JVM**: Java 11 or later

### Docker Jenkins Setup Command
```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

### Required Jenkins Plugins

#### Core Pipeline Plugins
1. **Pipeline** (workflow-aggregator) - v600+
   - Enables Declarative Pipeline syntax
   
2. **Pipeline: Stage View** - v2.26+
   - Visual stage progress in UI

3. **Pipeline: GitHub Integration** - v1.42+
   - Native GitHub integration

#### Notification & Communication
4. **Email Extension Plugin** - v2.95+
   - Advanced email notifications
   
5. **Slack Notification Plugin** - v3.1+
   - Slack integration for build notifications

#### Code Quality & Testing
6. **JUnit Plugin** - v1.57+
   - Parse and report test results
   
7. **Code Coverage API Plugin** - v2.0+
   - Track code coverage metrics over time
   
8. **Cobertura Plugin** - v1.17+
   - Coverage report visualization

#### Container & Build
9. **Docker Pipeline** - v637.v9bc87472f7b_7+
   - Native Docker support in pipelines
   
10. **Docker Plugin** - v1.2.9+
    - Docker integration for agents

#### UI & Visualization
11. **Blue Ocean** - v1.27+
    - Modern Jenkins UI for pipeline visualization
    
12. **AnsiColor Plugin** - v1.0.2+
    - Preserve colored output in logs

#### Version Control & Webhooks
13. **GitHub Branch Source Plugin** - v1680.v095ce872ec93+
    - GitHub repository integration
    
14. **GitHub API Plugin** - v1.303+
    - GitHub API access

#### Additional Utilities
15. **Timestamper Plugin** - v1.17+
    - Add timestamps to log lines
    
16. **Log Parser Plugin** - v2.1+
    - Parse and highlight log patterns
    
17. **BuildName and Description Setter** - v2.2+
    - Dynamic build naming
    
18. **Credentials Plugin** - v1211.vcf9b_e0b_72b_5f+
    - Secure credentials storage

---

### Jenkins Configuration

#### Global Configuration
```
Jenkins Location:
  - Jenkins URL: http://localhost:8080/
  - System Admin E-mail: jenkins@taskmaster.local
  
Security:
  - Manage Users: Enabled
  - Matrix-based security: Enabled
  - CSRF Protection: Enabled
  
System Properties:
  - java.awt.headless: true
  - org.jenkinsci.plugins.durabletask.BourneShellScript.HEARTBEAT_INTERVAL: 300
```

#### GitHub Configuration
```
GitHub Server Config:
  - API URL: https://api.github.com
  - Credentials: GitHub Personal Access Token (PAT)
  - Manage Hooks: Enabled
```

#### Email Configuration
```
SMTP Server: smtp.gmail.com
SMTP Port: 587
Use TLS: Enabled
Admin E-mail: your-email@gmail.com
Credentials: Gmail App Password
```

#### Slack Configuration
```
Slack Workspace: your-workspace.slack.com
Slack Channel: #jenkins-builds
Bot Token: xoxb-... (Slack Bot Token)
```

---

### Jenkins Credentials to Setup

#### GitHub PAT (Personal Access Token)
```
Type: Username with password
Username: (GitHub username)
Password: (Personal Access Token)
Scope: repo (Full control), admin:repo_hook (Webhook)
ID: github-credentials
```

#### Slack Bot Token
```
Type: Secret text
Secret: xoxb-... (Slack Bot Token)
ID: slack-bot-token
```

#### Docker Hub (Optional)
```
Type: Username with password
Username: (Docker Hub username)
Password: (Docker Hub token)
ID: docker-hub-credentials
```

#### Email Credentials
```
Type: Username with password
Username: your-email@gmail.com
Password: (Gmail App Password)
ID: gmail-credentials
```

---

### Jenkins Job Configuration

#### Job Type
**Multibranch Pipeline** with GitHub repository source

#### Repository Configuration
```
Repository URL: https://github.com/your-username/taskmaster-api.git
Credentials: github-credentials
```

#### Branch Discovery
- Discover branches: All branches
- Discover pull requests from: Origin
- Discover pull requests from: Forks (Trust: Nobody)

#### Build Configuration
```
Script Path: Jenkinsfile
Scan Interval: Every 1 minute
Prune stale branches: After 7 days
```

#### Webhooks
- **URL**: http://jenkins-server:8080/github-webhook/
- **Events**: Push events + Pull request events
- **Active**: Yes

---

### Jenkinsfile Architecture

#### Pipeline Stages (Order)
```
1. Checkout          → Clone repository
2. Setup             → Install dependencies
3. Lint              → Code quality checks
4. Unit Tests        → Run unit tests
5. Integration Tests → Run integration tests
6. Code Coverage     → Publish coverage reports
7. Build             → Create production build
8. Security Scan     → Dependency & vulnerability scan
9. Docker Build      → Build container image
10. Deploy to Staging → Deploy to staging environment
11. Smoke Tests      → Basic functionality tests
12. Approval Gate    → Manual approval for production
13. Deploy to Prod   → Deploy to production
14. Post-Deploy Test → Verify production deployment
```

#### Pipeline Environment Variables
```groovy
// Global variables available in all stages
environment {
    NODE_ENV = 'production'
    REGISTRY = 'docker.io'
    IMAGE_NAME = 'taskmaster-api'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    NPM_REGISTRY = 'https://registry.npmjs.org/'
}
```

#### Stage Conditions
- **Lint**: Run on all branches
- **Tests**: Run on all branches
- **Coverage**: Only if tests pass
- **Build**: Only on main branch
- **Docker Build**: Only on main and release branches
- **Deploy Staging**: Only on main branch
- **Approval Gate**: Only on main branch
- **Deploy Prod**: Only after approval

---

### Build Parameters

#### Boolean Parameters
1. **SKIP_TESTS** (default: false)
   - Option to skip tests for emergency deployments
   
2. **VERBOSE_LOGS** (default: false)
   - Enable verbose logging for debugging

#### Choice Parameters
1. **ENVIRONMENT** (default: staging)
   - Options: staging, production
   
2. **LOG_LEVEL** (default: info)
   - Options: debug, info, warn, error

#### String Parameters
1. **VERSION_TAG** (default: ${BUILD_NUMBER})
   - Custom version tag for release builds
   
2. **DEPLOY_MESSAGE** (default: "Automated deployment")
   - Custom deployment message for notifications

---

### Notification Configuration

#### Email Notifications
```
Trigger on: 
  - Build failure
  - Build unstable
  - Build back to normal
  
Recipients:
  - dev-team@company.com
  - devops@company.com
```

#### Slack Notifications
```
Channels:
  - #jenkins-builds (all builds)
  - #jenkins-failures (failures only)
  - #deployments (production deploys)
  
Messages include:
  - Build status
  - Stage that failed (if applicable)
  - Build duration
  - Build artifacts links
  - Commit message & author
```

---

### Artifact Archival

#### Build Artifacts
```
Path: dist/**/*
Retention: Last 30 builds
```

#### Test Reports
```
JUnit XML: 
  - tests/junit/*.xml
  - Retention: Last 50 builds

Coverage Reports:
  - coverage/lcov-report/**
  - Retention: Last 30 builds
```

#### Logs
```
Build Logs: All builds retained
Log Rotation: Keep last 100 builds
```

---

### Post-Build Actions

#### Always (Post - Success/Failure)
- [ ] Archive artifacts
- [ ] Cleanup workspace
- [ ] Publish test results

#### On Failure
- [ ] Send failure email
- [ ] Post failure to Slack
- [ ] Store failure logs

#### On Success
- [ ] Send success Slack notification
- [ ] Publish coverage reports
- [ ] Update deployment status

---

### Performance & Reliability Settings

#### Timeouts
```
Global Build Timeout: 30 minutes
Stage-specific timeouts:
  - Tests: 15 minutes
  - Build: 10 minutes
  - Deploy: 20 minutes
  - Approval Gate: 24 hours
```

#### Retry Logic
```
Automatic Retries:
  - Failed tests: Retry up to 2 times
  - Failed deploys: Retry once
  - Network issues: Retry up to 3 times
```

#### Resource Allocation
```
Executors: 4 parallel executors
Memory: 2GB heap size
Workspace Disk: 50GB
Docker Resource Limits: 2 CPU, 2GB RAM
```

---

### Security Configuration

#### Jenkins Security
- [x] CSRF Protection: Enabled
- [x] Script Security: Sandboxed
- [x] API Token Authentication: Required
- [x] User permissions: Role-based (RBAC)

#### Secret Management
- [x] All credentials encrypted at rest
- [x] No secrets in logs
- [x] Credential rotation recommended every 90 days
- [x] Secrets masked in UI and console output

#### Network Security
- [x] Jenkins behind reverse proxy recommended
- [x] HTTPS/TLS for all communications
- [x] Firewall rules: Only allow GitHub webhook IPs

---

### Monitoring & Logging

#### Metrics to Track
- Build success/failure rate
- Average build duration
- Test pass rate
- Code coverage trends
- Deployment frequency
- Deployment failure rate

#### Log Aggregation
- Centralize logs to: ELK Stack / CloudWatch (optional)
- Log retention: 90 days
- Search logs by: build number, branch, author

---

## 🎯 Expected Outcomes

### After Complete Setup
✅ Every code push automatically triggers Jenkins  
✅ Tests run automatically and fail builds if broken  
✅ Code coverage tracked over time  
✅ Linting enforced (must pass before build)  
✅ Docker images built and tagged automatically  
✅ Staging deployment happens automatically  
✅ Production deployment requires manual approval  
✅ All team members notified via email & Slack  
✅ Complete audit trail of all builds & deployments  
✅ One-click rollback capability (manual re-run)  

---

## 📋 Summary Table

| Aspect | Specification |
|--------|---------------|
| **Project** | TaskMaster API (Node.js REST API) |
| **Database** | SQLite |
| **Testing** | Jest (80%+ coverage) |
| **Jenkins Version** | 2.400+ LTS |
| **Deployment** | Docker container |
| **Plugins** | 18 essential plugins |
| **Stages** | 14 build stages |
| **Environments** | 2 (staging + production) |
| **Notifications** | Email + Slack |
| **Build Duration** | Target: < 5 minutes |
| **Approval Gates** | Production manual approval |
| **Artifacts** | Build output + reports |

---

## ✨ Ready to Implement?

Everything is specified. Next steps:
1. Create the Node.js project locally
2. Initialize GitHub repository
3. Setup Jenkins with plugins
4. Create the Jenkinsfile
5. Connect GitHub webhook
6. Test the complete pipeline
