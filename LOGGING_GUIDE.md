# 📝 Logging Guide - Placify Platform

## Overview

Placify uses a centralized logging system to ensure consistent, structured, and environment-aware logging across the entire application. This guide explains how to use the logger effectively.

## 🎯 Why Use the Logger?

- **Consistent formatting**: All logs have timestamps and structured format
- **Environment-aware**: Automatically adjusts verbosity based on environment (dev/prod)
- **Production-ready**: Prevents debugging logs from cluttering production
- **Easy debugging**: Better context with structured data
- **Future-proof**: Easy to integrate with monitoring services (Sentry, LogRocket, etc.)

## 📦 Installation & Import

### Frontend (React/Vite)

```javascript
import logger from '@/utils/logger';
// or
import logger from '../utils/logger';
```

### Backend (Node.js/Express)

```javascript
import logger from './utils/logger.js';
// or
import logger from '../utils/logger.js';
```

## 🔧 Basic Usage

### Log Levels

The logger supports four log levels with automatic filtering based on environment:

#### 1. **DEBUG** 🔍
Use for detailed debugging information.

```javascript
logger.debug('Function called', { userId: 123, action: 'login' });
logger.debug('Processing data', dataObject);
```

**When to use:**
- Function entry/exit points
- Variable state inspection
- Algorithm step-by-step execution
- Detailed flow tracking

#### 2. **INFO** ℹ️
Use for general informational messages.

```javascript
logger.info('User logged in successfully', { userId: 123 });
logger.info('Server started', { port: 5000, env: 'development' });
```

**When to use:**
- Successful operations
- Important business events
- System state changes
- API responses (non-error)

#### 3. **WARN** ⚠️
Use for warning messages that don't stop execution but need attention.

```javascript
logger.warn('API rate limit approaching', { remaining: 10, limit: 100 });
logger.warn('Deprecated function called', { function: 'oldMethod' });
```

**When to use:**
- Deprecated features usage
- Performance warnings
- Configuration issues
- Recoverable errors
- Missing optional data

#### 4. **ERROR** ❌
Use for error conditions and exceptions.

```javascript
logger.error('Failed to fetch user data', error);
logger.error('Database connection failed', { host: 'localhost', port: 5432 });
```

**When to use:**
- Caught exceptions
- Failed operations
- Invalid inputs
- Database errors
- API failures

## 🌍 Environment-Based Logging

### Development
- Shows **all** log levels (DEBUG, INFO, WARN, ERROR)
- Includes stack traces
- Verbose output
- Colorized console output (backend)

### Production
- Shows only **WARN** and **ERROR** (frontend)
- Shows **INFO**, **WARN**, and **ERROR** (backend)
- Minimal output
- Errors can be sent to monitoring services

### Test
- Shows only **ERROR**
- Minimal noise during testing

### Custom Configuration

#### Frontend (.env)
```env
VITE_LOG_LEVEL=DEBUG  # Override log level
```

#### Backend (.env)
```env
LOG_LEVEL=DEBUG       # Override log level
NODE_ENV=production   # Set environment
NO_COLOR=1           # Disable colors in output
```

## 📋 Migration from console.*

### Before (❌ Old way)
```javascript
console.log('User data:', userData);
console.error('Failed to save:', error);
console.warn('Cache miss for key:', key);
```

### After (✅ New way)
```javascript
logger.debug('User data:', userData);
logger.error('Failed to save:', error);
logger.warn('Cache miss for key:', key);
```

## 🎨 Advanced Features

### 1. Grouped Logs

Useful for related log messages:

```javascript
logger.group('User Registration Process', () => {
  logger.debug('Validating email');
  logger.debug('Hashing password');
  logger.info('User created successfully');
});
```

### 2. Table Logging (Dev only)

Display data in table format:

```javascript
logger.table([
  { name: 'John', age: 30, role: 'Admin' },
  { name: 'Jane', age: 25, role: 'User' }
]);
```

### 3. Performance Timing

Measure execution time:

```javascript
const endTimer = logger.time('Database Query');
// ... perform operation ...
endTimer(); // Logs: "🔍 Database Query: 45ms"
```

## 💡 Best Practices

### 1. **Use Appropriate Log Levels**

```javascript
// ✅ Good
logger.debug('Entering function', { params });
logger.info('Order placed successfully', { orderId });
logger.warn('Inventory low', { product, quantity: 5 });
logger.error('Payment failed', error);

// ❌ Bad
logger.error('Button clicked'); // Use debug
logger.debug('Critical system failure', error); // Use error
```

### 2. **Include Context**

```javascript
// ✅ Good - provides context
logger.error('Failed to fetch user profile', {
  userId: 123,
  endpoint: '/api/users/123',
  statusCode: 404
});

// ❌ Bad - no context
logger.error('Failed to fetch');
```

### 3. **Don't Log Sensitive Data**

```javascript
// ❌ NEVER log sensitive data
logger.debug('User credentials', { 
  email, 
  password  // DANGER!
});

// ✅ Safe logging
logger.debug('User authentication', { 
  email, 
  passwordHash: '***' // Redacted
});
```

### 4. **Use Structured Data**

```javascript
// ✅ Good - structured
logger.info('Payment processed', {
  amount: 99.99,
  currency: 'USD',
  orderId: '12345'
});

// ❌ Bad - string concatenation
logger.info(`Payment of $${amount} processed for order ${orderId}`);
```

### 5. **Keep Messages Concise**

```javascript
// ✅ Good - clear and concise
logger.error('Database connection failed', error);

// ❌ Bad - too verbose
logger.error('There was an error and the database connection could not be established because...', error);
```

## 🔍 Common Patterns

### Error Handling

```javascript
try {
  const data = await fetchUserData(userId);
  logger.info('User data fetched successfully', { userId });
  return data;
} catch (error) {
  logger.error('Failed to fetch user data', { 
    userId, 
    error: error.message,
    stack: error.stack 
  });
  throw error;
}
```

### API Requests

```javascript
// Before request
logger.debug('Sending API request', {
  method: 'POST',
  url: '/api/users',
  payload: data
});

// After successful response
logger.info('API request successful', {
  status: response.status,
  data: response.data
});

// After error
logger.error('API request failed', {
  status: error.response?.status,
  message: error.message
});
```

### Form Validation

```javascript
// ✅ Good
if (!email) {
  logger.warn('Email validation failed', { field: 'email', reason: 'required' });
  return;
}

// For debugging during development
logger.debug('Form data before submission', { formData });
```

## 🚫 What NOT to Log

1. **Passwords or API keys**
2. **Credit card numbers**
3. **Personal identification numbers**
4. **Session tokens (in production)**
5. **Excessive data in loops** (use sampling)
6. **Binary data**

## 🔧 ESLint Integration

The project has ESLint configured to prevent direct `console.*` usage:

```javascript
// ❌ This will cause an ESLint error
console.log('Hello');  // ESLint: Unexpected console statement

// ✅ Use logger instead
logger.info('Hello');  // ✓ Passes
```

To fix ESLint errors:
```bash
npm run lint
```

## 🎓 Examples by Use Case

### User Authentication

```javascript
// Login attempt
logger.info('Login attempt', { email });

// Login success
logger.info('User logged in successfully', { 
  userId: user.id, 
  email: user.email 
});

// Login failure
logger.warn('Login failed', { 
  email, 
  reason: 'Invalid credentials' 
});
```

### File Upload

```javascript
logger.debug('File upload initiated', {
  filename: file.name,
  size: file.size,
  type: file.type
});

logger.info('File uploaded successfully', {
  filename: file.name,
  uploadedUrl: url
});

logger.error('File upload failed', {
  filename: file.name,
  error: error.message
});
```

### Database Operations

```javascript
logger.debug('Executing database query', { query, params });

logger.info('Database record created', { 
  collection: 'users', 
  id: newUser._id 
});

logger.error('Database operation failed', {
  operation: 'INSERT',
  collection: 'users',
  error: error.message
});
```

## 🚀 Future Enhancements

The logging system is designed to support future integrations:

### Error Monitoring Services

```javascript
// Future integration with Sentry
logger.error('Critical error', error);
// → Automatically reports to Sentry in production
```

### Analytics

```javascript
// Future integration with analytics
logger.info('User action', { action: 'purchase', value: 99.99 });
// → Automatically tracks in analytics platform
```

## 📚 Additional Resources

- [ESLint no-console rule](https://eslint.org/docs/rules/no-console)
- [JavaScript Error Handling Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [Structured Logging](https://www.loggly.com/ultimate-guide/node-logging-basics/)

## 🤝 Contributing

When contributing to Placify:

1. **Always use the logger** instead of `console.*`
2. **Choose appropriate log levels** based on the guidelines above
3. **Include relevant context** in log messages
4. **Don't log sensitive data**
5. **Test your logs** in different environments

## 💬 Questions?

If you have questions about logging:
- Check this guide first
- Look at existing code examples in the codebase
- Ask in the project discussions
- Contact the maintainers

---

**Remember**: Good logging makes debugging easier and helps maintain production systems effectively. Use it wisely! 🎯
