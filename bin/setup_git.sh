#!/bin/bash

# Check if parameters are provided
if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <github-username> <repository-name> <commit-message>"
  exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI could not be found. Please install it to proceed."
    exit
fi


# Assign parameters to variables
GITHUB_USERNAME=$1
REPOSITORY_NAME=$2
COMMIT_MESSAGE=$3

git init

git add .
git commit -m "$COMMIT_MESSAGE"
if gh repo view $GITHUB_USERNAME/$REPOSITORY_NAME > /dev/null 2>&1; then
    echo "Repository $GITHUB_USERNAME/$REPOSITORY_NAME already exists on GitHub."
else
    gh repo create $REPOSITORY_NAME --public --source=.
fi

if git remote get-url origin > /dev/null 2>&1; then
    echo "Remote 'origin' already exists."
else
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPOSITORY_NAME.git"
fi

CURRENT_BRANCH=$(git branch --show-current)

git push -u origin $CURRENT_BRANCH

echo "Repository setup completed."
