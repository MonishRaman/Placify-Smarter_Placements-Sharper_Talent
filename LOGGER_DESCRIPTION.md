# Replace console statements with centralized logger

Implements a production-ready logging system to replace console.log/error/warn statements across the codebase.

## Changes Made

### ✅ Core Implementation
- Created `src/utils/logger.js` - Frontend logger utility
- Created `server/utils/logger.js` - Backend logger utility
- Updated `eslint.config.js` - Added no-console rule (warning level)
- Updated `CONTRIBUTING.md` - Added logging guidelines

### ✅ Sample Migrations
Migrated these files as examples:
- `src/utils/pdfGenerator.js`
- `src/utils/emailService.js`
- `src/utils/pdfExport.js`

### 📝 Documentation
- `LOGGING_GUIDE.md` - Complete usage guide
- `MIGRATION_SUMMARY.md` - Migration plan and status
- `migrate-to-logger.js` - Automated migration tool

## Features

**Logger supports:**
- 4 log levels: debug, info, warn, error
- Auto timestamps
- Environment-based filtering (dev shows all, prod shows only errors/warnings)
- Ready for monitoring tools (Sentry, LogRocket)

**Example usage:**
```javascript
import logger from './utils/logger';

logger.debug('User data:', user);
logger.info('Login successful');
logger.warn('Cache miss');
logger.error('Failed to save', error);
```

## Testing

```bash
npm run dev   # Logs now have timestamps and emojis
npm run lint  # Will show warnings for remaining console statements
```

## Next Steps

This PR establishes the logging infrastructure. Remaining console statements can be migrated gradually:
1. Use the migration tool: `npm run logger:migrate`
2. Or migrate manually when editing files
3. Once all done, change ESLint rule from 'warn' to 'error'

## Related Issue

Closes #[issue-number]

## Checklist

- [x] Logger utilities created
- [x] ESLint rule added
- [x] Documentation updated
- [x] Sample files migrated
- [x] Tested locally
- [ ] All console statements migrated (in progress)
