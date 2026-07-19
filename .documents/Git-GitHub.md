# Git & GitHub

Git and GitHub are complementary tools widely used for software development, as well as for managing any project requiring change tracking and collaboration.

## 1. Why use Git and GitHub?

1. <strong>Git:&nbsp; a distributed version control system</strong>
    - <strong>Complete history:</strong>&nbsp; Git records every change (who, when, why) in an immutable history. You can revert to any previous version of the project.
    - <strong>Offline work:</strong>&nbsp; unlike some centralized tools, Git allows you to work without an internet connection and synchronize changes later.
    - <strong>Lightweight branches:</strong>&nbsp; creating a branch to test a new feature or fix a bug is fast and does not duplicate the entire project. You can easily merge or delete a branch.
    - <strong>Data integrity:</strong>&nbsp; Git uses checksums (hashes) to ensure the code is not corrupted.
    - <strong>Performance:</strong>&nbsp; Git is optimized to handle projects of all sizes, even those with thousands of files.

2. <strong>GitHub:&nbsp; a collaborative, cloud-based platform for Git</strong><br />
   GitHub extends Git's capabilities with practical tools for teams and open-source projects:
    - <strong>Repository hosting:</strong>&nbsp; Git projects are stored on remote servers (the cloud), making sharing and backups easy.
    - <strong>Simplified collaboration:</strong>
        - Pull Requests (PRs):&nbsp; for proposing changes to a main branch and discussing them before merging.
        - Code review:&nbsp; for commenting on specific lines of code.
        - Bug management:&nbsp; tracking bugs, feature requests, or tasks.
    - <strong>Automation:</strong>
        - GitHub Actions:&nbsp; automates testing, deployment, or notifications upon every change.
        - CI/CD:&nbsp; integrates continuous delivery pipelines (Continuous Integration / Continuous Deployment).
    - <strong>Documentation and visibility:</strong>
        - Wikis:&nbsp; ability to create internal or public project documentation.
        - GitHub Pages:&nbsp; for hosting a static website directly from your repository.
    - <strong>Security and access control:</strong>
        - Granular permission management (read/write/admin) for team members.
        - Vulnerability detection in dependencies (via Dependabot).
    - <strong>Open source ecosystem:</strong>&nbsp; for accessing and contributing to millions of public projects. GitHub is the go-to platform for open source.

***
<br />

## 2. Installing Git

> ### Windows
>
> 1. Download the installer from the official website: https://git-scm.com/install/windows
> 2. Run the downloaded `.exe` file. 
> 3. Follow the installer's instructions (the default options are generally suitable). 
> ***

> ### macOS
>
> 1. <strong>Homebrew</strong>
>     - Install [homebrew](https://brew.sh/) if you don't already have it.
>     - Then, open your terminal:
> > ```
> >        bash
> >
> >        $ brew install git
> > ```
> 2. <strong>MacPorts</strong>
>     - Install [MacPorts](https://www.macports.org/) if you don't already have it.
>     - Then, open your terminal:
> > ```
> >        bash
> >
> >        $ sudo port install git
> > ```
> 3. <strong>Xcode Command Line Tools</strong>
>     - Apple ships a binary package of Git with [Xcode Command Line](https://developer.apple.com/xcode/resources/) Tools.
>     - You can install this via:
> > ```
> >        bash
> >
> >        $ xcode-select --install
> > ```
> <strong>Note:&nbsp; installing git-gui</strong><br />
> If you would like to install [git-gui](https://git-scm.com/docs/git-gui) and [gitk](https://git-scm.com/docs/gitk), git's commit GUI and interactive history browser, you can do so using [homebrew](https://brew.sh/):
> > ```
> >   bash
> >
> >   $ brew install git-gui
> > ```
> ***

> ### Once the installation is complete, open your terminal or Git Bash (a Git-specific terminal required on Windows and installed with Git) to verify the installation by running:
> > ```
> >   bash
> >
> >   $ git --version
> > ```
> This should display the installed version of Git.
> ***

<br />

## 3. Git configuration

1. Open your terminal or Git Bash, then run the commands:
> ```
>   bash
>
>   $ git config --global user.name "Your Name"
>   $ git config --global user.email "your@address.email"
> ```
2. To check the configuration:
> ```
>   bash
> 
>   $ git config list
> ```
3. Among the information displayed, you should have:
> ```
>   user.name=Your Name
>   user.email=your@address.email
> ```
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
> ```
>   bash
>
>   $ git init
> ```
2. To verify the initialization, run the following command; you should see a message indicating that you are on the `main` or `master` branch and that there are untracked files:
> ```
>   bash
>
>   $ git status
> ```
3. If the created branch is named `master`, rename it `main` by running the command:
> ```
>   bash
>
>   $ git branch -m master main
> ```
4. Add the files to be tracked:
> ```
>   bash
>
>   $ git add .
> ```
5. Perform an initial `commit`:
> ```
>   bash
>
>   $ git commit -m "Initial commit"
> ```
6. To link the local Git repository with the remote GitHub (or GitLab, or Bitbucket) repository, run the commands:
> ```
>   bash
>
>   $ git remote add origin <remote_repository_url>
>   $ git push -u origin main
> ```

***
<br />

## 7. Documentation

### ![Git - Documentation](img/small-git.png "https://git-scm.dev/doc") &nbsp;[Git - Documentation](https://git-scm.dev/doc)

### ![GitHub - Documentation](img/small-github.png "https://docs.github.com") &nbsp;[GitHub - Documentation](https://docs.github.com)
