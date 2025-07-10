# Contributing to Connect<span className="text-blue-500">X</span> Platform

Thank you for your interest in contributing to Connect<span className="text-blue-500">X</span>! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Supabase account (for database features)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/connect<span className="text-blue-500">x</span>-platform.git
   cd connect<span className="text-blue-500">x</span>-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill in your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Code Style

We use ESLint and TypeScript for code quality. Please ensure your code:

- Follows TypeScript best practices
- Uses Tailwind CSS for styling
- Includes proper type definitions
- Has meaningful variable and function names
- Includes comments for complex logic

### Code Formatting

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors
```

## 🏗️ Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/        # React contexts
├── lib/            # Utilities and configurations
├── pages/          # Page components
└── types/          # TypeScript type definitions
```

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run build
   npm run preview
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🐛 Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information

## 💡 Feature Requests

For feature requests, please:

- Check existing issues first
- Provide clear use case
- Explain the benefit to users
- Consider implementation complexity

## 🔒 Security

If you discover security vulnerabilities:

- **DO NOT** open a public issue
- Email security@connect<span className="text-blue-500">x</span>.com
- Include detailed description
- Wait for response before disclosure

## 📋 Commit Message Guidelines

We follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

Example:
```
feat: add partner referral tracking system

- Implement referral code generation
- Add referral analytics dashboard
- Update partner registration flow
```

## 🧪 Testing

- Write unit tests for new components
- Test across different browsers
- Verify mobile responsiveness
- Check accessibility compliance

## 📚 Documentation

When adding features:

- Update README.md if needed
- Add inline code comments
- Update API documentation
- Include usage examples

## 🎯 Areas for Contribution

We welcome contributions in:

- **UI/UX improvements**
- **Performance optimizations**
- **Accessibility enhancements**
- **Mobile responsiveness**
- **Test coverage**
- **Documentation**
- **Bug fixes**
- **New features**

## ❓ Questions?

- Check existing issues and discussions
- Join our community Discord
- Email: developers@connect<span className="text-blue-500">x</span>.com

## 🙏 Recognition

Contributors will be:

- Listed in our contributors section
- Mentioned in release notes
- Invited to contributor events
- Given priority support

Thank you for helping make Connect<span className="text-blue-500">X</span> better! 🚀