---
title: "Code Syntax Highlighting Demo"
date: "2025-02-01"
excerpt: "A demonstration of beautiful Monokai-themed syntax highlighting for various programming languages."
tags: ["demo", "syntax-highlighting", "code"]
draft: false
---

# Code Syntax Highlighting Demo

This post demonstrates the beautiful Monokai theme syntax highlighting for various programming languages supported by this blog.

## JavaScript

Here's a sample JavaScript function with modern ES6+ syntax:

```javascript
// Async function with destructuring and template literals
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const { data, error } = await response.json();
        
        if (error) {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
        
        return {
            ...data,
            fullName: `${data.firstName} ${data.lastName}`,
            isActive: data.status === 'active'
        };
    } catch (err) {
        console.error('Error fetching user data:', err);
        return null;
    }
}

// Usage with arrow function
const handleUserLogin = async (credentials) => {
    const user = await fetchUserData(credentials.userId);
    return user?.isActive ? user : false;
};
```

## Python

A Python class demonstrating object-oriented programming:

```python
from typing import List, Optional
import asyncio
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str
    is_active: bool = True

class UserManager:
    def __init__(self):
        self.users: List[User] = []
    
    async def create_user(self, name: str, email: str) -> Optional[User]:
        """Create a new user with validation."""
        if not self._validate_email(email):
            raise ValueError(f"Invalid email: {email}")
        
        user = User(
            id=len(self.users) + 1,
            name=name,
            email=email
        )
        
        self.users.append(user)
        await self._send_welcome_email(user)
        return user
    
    def _validate_email(self, email: str) -> bool:
        return "@" in email and "." in email
    
    async def _send_welcome_email(self, user: User) -> None:
        # Simulate async email sending
        await asyncio.sleep(0.1)
        print(f"Welcome email sent to {user.email}")

# Usage
async def main():
    manager = UserManager()
    user = await manager.create_user("John Doe", "john@example.com")
    print(f"Created user: {user}")

if __name__ == "__main__":
    asyncio.run(main())
```

## CSS

Modern CSS with custom properties and flexbox:

```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #64748b;
    --border-radius: 8px;
    --transition-speed: 0.3s;
}

.card {
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: var(--border-radius);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform var(--transition-speed) ease;
    overflow: hidden;
}

.card:hover {
    transform: translateY(-2px);
}

.card__header {
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

.card__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin: 0;
}

@media (max-width: 768px) {
    .card {
        margin: 0.5rem;
    }
    
    .card__header {
        padding: 1rem;
    }
}
```

## HTML

Semantic HTML5 structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Web App</title>
    <!-- <link rel="stylesheet" href="styles.css"> -->
</head>
<body>
    <header class="header" role="banner">
        <nav class="navbar" aria-label="Main navigation">
            <h1 class="navbar__brand">
                MyApp
            </h1>
            <ul class="navbar__menu">
                <li>About</li>
                <li>Services</li>
                <li>Contact</li>
            </ul>
        </nav>
    </header>
    
    <main class="main" role="main">
        <section class="hero">
            <h2 class="hero__title">Welcome to Our Service</h2>
            <p class="hero__subtitle">Building amazing web experiences</p>
            <button class="btn btn--primary" type="button">
                Get Started
            </button>
        </section>
    </main>
    
    <script src="app.js" defer></script>
</body>
</html>
```

## JSON

Configuration and data structure:

```json
{
  "name": "my-blog-app",
  "version": "1.0.0",
  "description": "A modern blog built with SvelteKit",
  "main": "src/app.js",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  },
  "keywords": ["blog", "svelte", "web", "static-site"],
  "author": {
    "name": "John Doe",
    "email": "john@example.com",
    "url": "https://johndoe.com"
  },
  "license": "MIT",
  "dependencies": {
    "@sveltejs/kit": "^1.20.4",
    "svelte": "^4.0.5"
  },
  "devDependencies": {
    "vite": "^4.4.2",
    "typescript": "^5.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/johndoe/my-blog.git"
  }
}
```

## Bash/Shell

System administration and automation scripts:

```bash
#!/bin/bash

# Deploy script with error handling
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
readonly BUILD_DIR="$PROJECT_ROOT/build"
readonly BACKUP_DIR="/backup/$(date +%Y%m%d_%H%M%S)"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $*"
}

cleanup() {
    log "Cleaning up temporary files..."
    rm -rf /tmp/deploy_*
}

trap cleanup EXIT

deploy() {
    local environment="${1:-production}"
    
    log "Starting deployment to $environment environment"
    
    # Create backup
    if [[ -d "$BUILD_DIR" ]]; then
        log "Creating backup at $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
        cp -r "$BUILD_DIR" "$BACKUP_DIR/"
    fi
    
    # Build application
    log "Building application..."
    npm run build || {
        error "Build failed!"
        return 1
    }
    
    # Deploy based on environment
    case "$environment" in
        "production")
            rsync -avz --delete "$BUILD_DIR/" user@server:/var/www/html/
            ;;
        "staging")
            rsync -avz --delete "$BUILD_DIR/" user@staging:/var/www/staging/
            ;;
        *)
            error "Unknown environment: $environment"
            return 1
            ;;
    esac
    
    log "Deployment completed successfully!"
}

# Main execution
main() {
    if [[ $# -eq 0 ]]; then
        warning "No environment specified, using 'production'"
        deploy "production"
    else
        deploy "$1"
    fi
}

main "$@"
```

The Monokai theme provides excellent readability and visual distinction between different syntax elements, making code easier to read and understand across all these programming languages!