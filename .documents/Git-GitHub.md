# Git & GitHub

Git et GitHub sont des outils complémentaires largement utilisés pour le développement logiciel, mais aussi pour gérer tout type de projet nécessitant un suivi des modifications et une collaboration.

## 1. Notes de configuration



***
<br />

## 2. Installing Git

### - Installation: https://git-scm.dev/install/

### - Once the installation is complete, open your terminal or Git Bash (a Git-specific terminal required on Windows and installed with Git) to verify the installation by running:
```
    bash

    $ git --version
```
This should display the installed version of Git.

***
<br />

## 3. Git configuration

1. Open your terminal or Git Bash, then run the commands:
```
    bash

    $ git config --global user.name "Your Name"
    $ git config --global user.email "your@address.email"
```
2. To check the configuration:
```
    bash

    $ git config list
```
3. Among the information displayed, you should have:
```
    user.name=Your Name
    user.email=your@address.email
```
<strong>Note:</strong>&nbsp; the `--global` option applies a configuration to all Git repositories on your machine, not just the current one. You do not need to configure the same settings (such as your name or email) for each new project. This does not override a local configuration (`--local`) if a project requires specific settings.

***
<br />

## 4. Creating a GitHub account

1. <strong>Visit the official website:</strong>&nbsp; go to https://github.com.

2. <strong>Fill out the sign-up form:</strong>
    - Enter your email address.
    - Choose a username (it will be public).
    - Enter a secure password.
    - Click "Sign up for GitHub".

3. <strong>Verify your email address:</strong>&nbsp; GitHub will send you a verification email, click the link inside it to confirm your account.

4. <strong>Customize your profile (optional):</strong>&nbsp; once logged in, you can add a profile picture, a bio, or links to your social media.

5. <strong>Explore GitHub:</strong>&nbsp; you can now create repositories, contribute to projects, or explore the platform's features.

***
<br />

## 5. Creating a GitHub repository

1. Log in to GitHub with your account.

2. Click the "New" button (new repository) at the top right of the home page.

3. Fill in the details:
    - Repository name:&nbsp; choose a clear and descriptive name. 
    - Description (optional):&nbsp; add a brief description of the project. 
    - Visibility:&nbsp; choose between Public (visible to everyone) or Private (restricted to you and the collaborators you authorize). 
    - Initialization:&nbsp; you can add a `README.md` file, a `.gitignore` file, or a license (MIT, Apache, etc.) if needed.

4. Click "Create repository".

<strong>Note:</strong>
- Use a lowercase repository name with hyphens (`-`) to separate words (e.g., my-web-project).
- The `README.md` file is automatically displayed on the repository's homepage.
- For a local project, after creating the repository on GitHub, follow the instructions to link your local repository to GitHub using the `git remote add origin` and `git push` commands.

***
<br />

## 6. Initializing a Git repository and linking it to a GitHub repository

1. Open your terminal or Git Bash in your project's root directory, then run the following command; this creates a `.git` subfolder containing the repository's entire configuration and history:
```
    bash

    $ git init
```
2. To verify the initialization, run the following command; you should see a message indicating that you are on the `main` or `master` branch and that there are untracked files:
```
    bash

    $ git status
```
3. If the created branch is named `master`, rename it `main` by running the command:
```
    bash

    $ git branch -m master main
```
4. Add the files to be tracked:
```
    bash

    $ git add .
```
5. Perform an initial `commit`:
```
    bash

    $ git commit -m "Initial commit"
```
6. To link the local Git repository with the remote GitHub (or GitLab, or Bitbucket) repository, run the commands:
```
    bash

    $ git remote add origin <remote_repository_url>
    $ git push -u origin main
```

***
<br />

## 7. Documentation

### ![Git - Documentation](img/small-git.png "https://git-scm.dev/doc") &nbsp;[Git - Documentation](https://git-scm.dev/doc)

### ![GitHub - Documentation](img/small-github.png "https://docs.github.com") &nbsp;[GitHub - Documentation](https://docs.github.com)
