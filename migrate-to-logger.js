#!/usr/bin/env node

/**
 * Console to Logger Migration Script
 * 
 * This script helps migrate console.* statements to the centralized logger.
 * It provides a report of all console statements found and optionally replaces them.
 * 
 * Usage:
 *   node migrate-to-logger.js --scan           # Scan for console statements
 *   node migrate-to-logger.js --migrate        # Migrate console to logger
 *   node migrate-to-logger.js --help           # Show help
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  srcDir: path.join(__dirname, 'src'),
  serverDir: path.join(__dirname, 'server'),
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    '.git',
    'logger.js', // Don't modify the logger itself
  ],
};

// Mapping of console methods to logger methods
const CONSOLE_TO_LOGGER_MAP = {
  'console.log': 'logger.debug',
  'console.debug': 'logger.debug',
  'console.info': 'logger.info',
  'console.warn': 'logger.warn',
  'console.error': 'logger.error',
};

class ConsoleMigrator {
  constructor() {
    this.stats = {
      filesScanned: 0,
      filesWithConsole: 0,
      consoleStatements: 0,
      byType: {
        log: 0,
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
      },
    };
    this.findings = [];
  }

  /**
   * Check if file should be processed
   */
  shouldProcessFile(filePath) {
    // Check extension
    const ext = path.extname(filePath);
    if (!CONFIG.extensions.includes(ext)) return false;

    // Check ignore patterns
    for (const pattern of CONFIG.ignorePatterns) {
      if (filePath.includes(pattern)) return false;
    }

    return true;
  }

  /**
   * Recursively get all files in directory
   */
  getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.getFiles(filePath, fileList);
      } else if (this.shouldProcessFile(filePath)) {
        fileList.push(filePath);
      }
    });

    return fileList;
  }

  /**
   * Scan file for console statements
   */
  scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const findings = [];

    // Regex to match console statements (not in comments)
    const consoleRegex = /\b(console\.(log|debug|info|warn|error))\(/g;

    lines.forEach((line, index) => {
      // Skip if line is a comment
      if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
        return;
      }

      let match;
      while ((match = consoleRegex.exec(line)) !== null) {
        const consoleMethod = match[1];
        const methodType = match[2];

        findings.push({
          file: filePath,
          line: index + 1,
          consoleMethod,
          loggerMethod: CONSOLE_TO_LOGGER_MAP[consoleMethod],
          lineContent: line.trim(),
        });

        this.stats.byType[methodType]++;
        this.stats.consoleStatements++;
      }
    });

    return findings;
  }

  /**
   * Scan all files for console statements
   */
  scan() {
    console.log('🔍 Scanning for console statements...\n');

    const srcFiles = this.getFiles(CONFIG.srcDir);
    const serverFiles = this.getFiles(CONFIG.serverDir);
    const allFiles = [...srcFiles, ...serverFiles];

    this.stats.filesScanned = allFiles.length;

    allFiles.forEach(file => {
      const findings = this.scanFile(file);
      if (findings.length > 0) {
        this.findings.push(...findings);
        this.stats.filesWithConsole++;
      }
    });

    this.printReport();
  }

  /**
   * Print scan report
   */
  printReport() {
    console.log('📊 Scan Results\n');
    console.log(`Total files scanned: ${this.stats.filesScanned}`);
    console.log(`Files with console statements: ${this.stats.filesWithConsole}`);
    console.log(`Total console statements: ${this.stats.consoleStatements}\n`);

    console.log('By type:');
    console.log(`  console.log: ${this.stats.byType.log}`);
    console.log(`  console.debug: ${this.stats.byType.debug}`);
    console.log(`  console.info: ${this.stats.byType.info}`);
    console.log(`  console.warn: ${this.stats.byType.warn}`);
    console.log(`  console.error: ${this.stats.byType.error}\n`);

    if (this.findings.length > 0) {
      console.log('📝 Detailed findings:\n');
      
      // Group by file
      const byFile = {};
      this.findings.forEach(finding => {
        if (!byFile[finding.file]) {
          byFile[finding.file] = [];
        }
        byFile[finding.file].push(finding);
      });

      Object.entries(byFile).forEach(([file, findings]) => {
        const relativePath = path.relative(process.cwd(), file);
        console.log(`\n${relativePath} (${findings.length} statements):`);
        findings.forEach(f => {
          console.log(`  Line ${f.line}: ${f.consoleMethod} → ${f.loggerMethod}`);
        });
      });

      console.log('\n💡 To migrate, run: node migrate-to-logger.js --migrate');
    } else {
      console.log('✅ No console statements found! All clean.');
    }
  }

  /**
   * Add logger import to file if not present
   */
  addLoggerImport(content, filePath) {
    // Check if logger is already imported
    if (content.includes('from \'./logger\'') || 
        content.includes('from "./logger"') ||
        content.includes('from \'@/utils/logger\'') ||
        content.includes('from "../utils/logger"') ||
        content.includes('from \'../../utils/logger\'')) {
      return content;
    }

    // Determine correct import path
    let importPath;
    if (filePath.includes('/src/')) {
      // Calculate relative path to utils/logger.js
      const depth = filePath.split('/src/')[1].split('/').length - 1;
      importPath = depth === 0 ? './utils/logger' : '../'.repeat(depth) + 'utils/logger';
    } else if (filePath.includes('/server/') || filePath.includes('\\server\\')) {
      const depth = filePath.split(/[/\\]server[/\\]/)[1].split(/[/\\]/).length - 1;
      importPath = depth === 0 ? './utils/logger.js' : '../'.repeat(depth) + 'utils/logger.js';
    } else {
      importPath = './utils/logger';
    }

    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('const ') && lines[i].includes('require(')) {
        lastImportIndex = i;
      }
      // Stop at first non-import, non-comment, non-empty line
      if (lines[i].trim() && 
          !lines[i].trim().startsWith('import ') && 
          !lines[i].trim().startsWith('//') &&
          !lines[i].trim().startsWith('/*') &&
          !lines[i].trim().startsWith('*')) {
        break;
      }
    }

    const importStatement = `import logger from '${importPath}';`;

    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, importStatement);
    } else {
      lines.unshift(importStatement, '');
    }

    return lines.join('\n');
  }

  /**
   * Replace console statements in content
   */
  replaceConsoleStatements(content) {
    let modified = content;

    // Replace console.* with logger.*
    Object.entries(CONSOLE_TO_LOGGER_MAP).forEach(([consoleMethod, loggerMethod]) => {
      const regex = new RegExp(`\\b${consoleMethod.replace('.', '\\.')}\\(`, 'g');
      modified = modified.replace(regex, `${loggerMethod}(`);
    });

    return modified;
  }

  /**
   * Migrate a single file
   */
  migrateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // First, replace console statements
    let modified = this.replaceConsoleStatements(content);
    
    // Then, add logger import if needed
    modified = this.addLoggerImport(modified, filePath);

    // Write back to file
    fs.writeFileSync(filePath, modified, 'utf8');

    return true;
  }

  /**
   * Migrate all files
   */
  migrate() {
    console.log('🚀 Starting migration...\n');

    // First scan to find files
    const srcFiles = this.getFiles(CONFIG.srcDir);
    const serverFiles = this.getFiles(CONFIG.serverDir);
    const allFiles = [...srcFiles, ...serverFiles];

    let migratedCount = 0;

    allFiles.forEach(file => {
      const findings = this.scanFile(file);
      if (findings.length > 0) {
        console.log(`Migrating: ${path.relative(process.cwd(), file)}`);
        this.migrateFile(file);
        migratedCount++;
      }
    });

    console.log(`\n✅ Migration complete!`);
    console.log(`Files migrated: ${migratedCount}`);
    console.log(`\n💡 Next steps:`);
    console.log(`  1. Review the changes with: git diff`);
    console.log(`  2. Test the application: npm run dev`);
    console.log(`  3. Run linter: npm run lint`);
    console.log(`  4. Commit the changes`);
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const migrator = new ConsoleMigrator();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Console to Logger Migration Tool

Usage:
  node migrate-to-logger.js --scan       Scan for console statements
  node migrate-to-logger.js --migrate    Migrate console to logger
  node migrate-to-logger.js --help       Show this help

Examples:
  node migrate-to-logger.js --scan
  node migrate-to-logger.js --migrate
    `);
  } else if (args.includes('--scan')) {
    migrator.scan();
  } else if (args.includes('--migrate')) {
    migrator.migrate();
  } else {
    console.log('❌ Invalid option. Use --help for usage information.');
  }
}

main();
