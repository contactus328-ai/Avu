# Zhevents Project Guidelines

## Code Organization
- Keep components focused and single-purpose
- Remove duplicate files and unused code
- Use consistent naming conventions
- Prefer composition over large monolithic components

## UI/UX Standards
- Maintain compact form designs to prevent user fatigue
- Use consistent input styling: `h-6 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-tight`
- Follow mobile-first responsive design (360x800 Android viewport)
- Use consistent color scheme and spacing

## State Management Best Practices
- **Use initialization flags** to prevent localStorage save loops during mount
- **Avoid circular dependencies** in useEffect hooks
- **Direct localStorage access** for background operations to avoid state update cycles
- **Minimize useEffect dependencies** to prevent unnecessary re-renders
- Keep state updates predictable and traceable
- Always JSON.stringify when saving to localStorage
- Handle backward compatibility for localStorage data

## Performance Guidelines
- Remove unused imports and code
- Optimize event listeners and cleanup intervals properly
- Use React best practices to avoid infinite re-renders
- Use dependency arrays correctly in useEffect
- Consider direct API calls instead of state dependencies for background tasks

## Error Prevention
- Wrap localStorage operations in try-catch blocks
- Handle malformed JSON gracefully
- Provide fallbacks for missing or corrupted data
- Log errors appropriately for debugging
- Test useEffect dependencies carefully to avoid infinite loops

## File Management
- Regular cleanup of duplicate/backup files
- Keep components in organized directory structure
- Use clear, descriptive file names
- Maintain clean import/export structure

## Recent Fixes Applied
- ✅ Fixed infinite re-render loop in auto-email checking
- ✅ Simplified localStorage operations to avoid JSX parsing issues
- ✅ Improved useEffect dependency management
- ✅ Enhanced error handling for localStorage operations
- ✅ Documented file cleanup requirements

## Architecture Notes
- App.tsx serves as the main routing and state management hub
- Components are kept focused on their specific functionality
- localStorage operations are centralized with proper error handling
- Auto-email functionality uses direct localStorage access to avoid state loops