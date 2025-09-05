#!/usr/bin/env python3
"""
Code Quality Script for ml_modules

This script helps developers format and lint their Python code in the ml_modules directory.
Run this before submitting any pull requests to ensure code quality.

Usage:
    python code_quality.py --format    # Format code with Black
    python code_quality.py --lint      # Lint code with Flake8
    python code_quality.py --all       # Format and lint code
    python code_quality.py --help      # Show this help message
"""

import argparse
import subprocess
import sys
import os


def run_command(command, description):
    """Run a shell command and return the result."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully!")
            if result.stdout:
                print(result.stdout)
        else:
            print(f"❌ {description} failed!")
            if result.stderr:
                print(result.stderr)
            if result.stdout:
                print(result.stdout)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running {description}: {e}")
        return False


def format_code():
    """Format Python code using Black."""
    return run_command("black .", "Code formatting with Black")


def lint_code():
    """Lint Python code using Flake8."""
    return run_command("flake8 .", "Code linting with Flake8")


def main():
    parser = argparse.ArgumentParser(
        description="Code quality tools for ml_modules",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--format", action="store_true", help="Format code with Black")
    parser.add_argument("--lint", action="store_true", help="Lint code with Flake8")
    parser.add_argument("--all", action="store_true", help="Format and lint code")

    args = parser.parse_args()

    # Change to ml_modules directory if not already there
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    if args.all or (not args.format and not args.lint):
        print("🚀 Running complete code quality check...")
        format_success = format_code()
        lint_success = lint_code()

        if format_success and lint_success:
            print("🎉 All code quality checks passed!")
            return 0
        else:
            print("⚠️  Some issues were found. Please review the output above.")
            return 1

    elif args.format:
        return 0 if format_code() else 1

    elif args.lint:
        return 0 if lint_code() else 1

    else:
        parser.print_help()
        return 0


if __name__ == "__main__":
    sys.exit(main())
