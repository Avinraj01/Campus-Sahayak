# Pre-commit Configuration for Secret Detection

To prevent committing secrets to version control, you can use pre-commit hooks with git-secrets.

## Installation

1. Install pre-commit:
```bash
pip install pre-commit
```

2. Install git-secrets:
```bash
# On macOS
brew install git-secrets

# On Ubuntu/Debian
sudo apt-get install git-secrets

# On Windows, use WSL or download from https://github.com/awslabs/git-secrets
```

## Configuration

Create a `.pre-commit-config.yaml` file in your repository root:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: detect-private-key
      - id: detect-aws-credentials
        args: ['--allow-missing-credentials']
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
```

## Setup

1. Install the pre-commit hooks:
```bash
pre-commit install
```

2. Scan for existing secrets:
```bash
detect-secrets scan > .secrets.baseline
```

3. Audit the baseline:
```bash
detect-secrets audit .secrets.baseline
```

## Usage

The pre-commit hooks will automatically run before each commit and prevent committing files that contain potential secrets.

Note: This is an additional security measure and should not replace proper secret management practices like using environment variables.