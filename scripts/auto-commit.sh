#!/bin/bash

# Auto-commit script for codespaces-react
# Usage: ./scripts/auto-commit.sh

echo "Adding all changes..."
git add .

echo "Committing with timestamp..."
git commit -m "Auto-commit: $(date)" --allow-empty

echo "Pushing to current branch..."
git push origin $(git branch --show-current)

echo "Done!"
