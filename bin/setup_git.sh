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

# Initialize a new Git repository
git init

# Add all files in the directory to the staging area
git add .

# Commit the files
git commit -m "$COMMIT_MESSAGE"

# Create a new GitHub repository using GitHub CLI
gh repo create $REPOSITORY_NAME --public --source=.

# Set the remote repository URL
git remote add origin https://github.com/$GITHUB_USERNAME/$REPOSITORY_NAME.git

# Push the commit to the new GitHub repository
git push -u origin master

echo "Repository setup completed."
