# 🛠️ CONTRIBUTING GUIDELINES – Placify : "Smarter Placements. Sharper Talent."

Welcome to **Placify : "Smarter Placements. Sharper Talent."**! 🚀

We’re thrilled to have you here and super excited about your interest in contributing to our open-source platform.
Placify : "Smarter Placements. Sharper Talent." is built to empower students, developers, and career seekers with intelligent tools and interactive learning experiences.

**✨ No contribution is too small – every bit helps!**

Please also make sure to read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). 💖

---

## 📌 Contribution Philosophy

Contributions are what make the **open-source community** an incredible place to learn, build, and grow. We welcome:

- 🐞 Bug Fixes
- ✨ New Features
- 🎨 UI/UX Enhancements
- 📄 Documentation Improvements
- 🧪 Test Case Additions
- 🧠 AI Prompt or Dataset Enhancements

> 💡 **First-time contributor?** Don’t worry, we got you! Just follow the step-by-step guide below.

---

## 🚀 Quick Start – How to Contribute

### 1. 🌟 Star the Repository

Give this repo a star to show your support!

### 2. 🍴 Fork This Repo

Click the `Fork` button on the top right corner of the repository.

### 3. 📥 Clone Your Fork

```bash
git clone https://github.com/<your-username>/Placify-Smarter-Placements.-Sharper-Talent.-.git
cd Placify-Smarter-Placements.-Sharper-Talent.-
```

### 4. 📦 Install Dependencies

```bash
npm install
```

### 5. 🚀 Run the Project (Dev Mode)

```bash
npm run dev
```

> **Note:** Initial login/register forms (user/admin) are UI-based only. Data is stored temporarily in memory/cache. Dashboard access is possible post sign-up.

### 6. 🔄 Add Remote Upstream

```bash
git remote add upstream https://github.com/MonishRaman/Placify-Smarter-Placements.-Sharper-Talent.-.git
git pull upstream main
```

### 7. 🌿 Create New Branch

```bash
git checkout -b <your-feature-name>
```

### 8. 💻 Make Your Changes

Work your magic! Fix bugs, enhance UI, write logic — you name it!

### 9. ✅ Add & Commit Changes

```bash
git add .
git commit -m "✨ Your concise commit message here"
```

### 10. 🚀 Push to Your Fork

```bash
git push origin <your-branch-name>
```

### 11. 🔁 Create Pull Request (PR)

Go to your forked repo, click on `Compare & Pull Request`, and submit your changes.

---

## 🧪 Contribution with GitHub Desktop (Alternative)

1. Clone the repo from GitHub Desktop
2. Switch/create a feature branch
3. Make your changes in your code editor
4. Commit & push via GitHub Desktop
5. Open PR on GitHub website

---

## 🧩 What Can You Work On?

- `frontend/`: UI components, responsiveness, dark mode, accessibility
- `backend/`: APIs, auth, DB models, middleware
- `AI/`: Study Buddy GPT integration, prompt improvements
- `utils/`: Tools, resume engine, file conversion, etc.
- `docs/`: Improve README, add guides, GIFs, or flowcharts
- `ml_modules/`: Machine learning components, data analysis, AI models

We also welcome:

- New roadmap or quiz content
- Resume templates
- AI datasets or chatbot prompts

---

## 🐍 Python Code Quality (ml_modules)

The `ml_modules` directory uses automated code linting and formatting to maintain high code quality:

### 📦 Install Dependencies

Before working on Python files in `ml_modules`, install the development dependencies:

```bash
cd ml_modules
pip install -r requirements.txt
```

### 🔧 Code Formatting with Black

Format your Python code automatically:

```bash
# Format a specific file
black filename.py

# Format all Python files in ml_modules
black .
```

### 🧹 Code Linting with Flake8

Check your code for style and quality issues:

```bash
# Lint a specific file
flake8 filename.py

# Lint all Python files in ml_modules
flake8 .
```

### ✅ Pre-commit Checklist for ml_modules

Before submitting a PR with Python changes:

1. **Format your code**: `black .`
2. **Check linting**: `flake8 .`
3. **Fix any linting errors** that aren't automatically handled
4. **Test your changes** to ensure functionality

**🚀 Quick Helper Script**: Use the provided helper script for convenience:

```bash
# Format and lint all code
python code_quality.py --all

# Format only
python code_quality.py --format

# Lint only
python code_quality.py --lint
```

**Note**: The linting configuration is in `ml_modules/.flake8` and follows PEP 8 standards with Black compatibility.

---

## 📝 Issue Report Process

1. Go to [Issues](https://github.com/MonishRaman/Placify-Smarter-Placements.-Sharper-Talent.-.git/issues)
2. Describe the bug/feature clearly
3. Add appropriate labels (e.g., `bug`, `feature`, `good first issue`)
4. Wait to be assigned before starting work

---

## 🚀 Pull Request Process

1. Self-review your code ✅
2. Ensure proper formatting, variable names, and comments 💬
3. Attach screenshots/gifs if UI related 🖼️
4. Mention related issue using `Closes #issue_number`
5. Wait for review — we’ll provide feedback soon 👨‍💻👩‍💻

---

## 🧠 Need Help?

Check out these handy resources:

- [How to Fork a Repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- [How to Create a PR](https://opensource.com/article/19/7/create-pull-request-github)
- [GitHub Docs](https://docs.github.com/en)
- Or ask in our Discussions/Discord group! 💬

You can also contact Project Owner:
**Monish Raman** – [monishr608@gmail.com](mailto:monishr608@gmail.com)

---

## 💖 Thank You!

Thanks a ton for being here and showing interest! Your contribution, big or small, means a lot to us.

> _Let's build something impactful together with Placify : "Smarter Placements. Sharper Talent."!_

Happy coding! ✨
