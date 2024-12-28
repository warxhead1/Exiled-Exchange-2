# Implementation Notes

## Authentication Feature (2024-01)

### Overview
Added authentication with Path of Exile's trade site to enable authenticated trade requests. This allows users to see their own listings and access full trade functionality.

### Key Components

#### AuthWindow Class
- Implemented in `main/src/windowing/AuthWindow.ts`
- Creates a dedicated window for PoE authentication
- Handles cookie extraction and session management
- Includes retry logic for loading the login page

#### IPC Events
- Added `MAIN->CLIENT::auth-complete` event to communicate successful authentication
- Passes `POESESSID` securely between main and renderer processes

#### Trade API Integration
- Modified `renderer/src/web/price-check/trade/pathofexile-trade.ts` to:
  - Store and use `POESESSID` for authenticated requests
  - Add debug logging for authentication flow
  - Handle both authenticated and unauthenticated states

### UI Changes
- Added "Authenticate with POE" button in settings
- Implemented visual feedback for authentication state
- Cleaned up price normalization UI elements

### Debug Features
- Added logging for authentication events
- Track `POESESSID` usage in trade requests
- Monitor authentication window state

### Security Considerations
- `POESESSID` is never exposed in logs (only first 5 chars for debugging)
- Secure cookie handling between processes
- Session management follows PoE's security requirements

### Future Improvements
- Implement session persistence
- Add automatic re-authentication
- Enhance error handling and user feedback
- Consider rate limit adjustments for authenticated users 

### Price Normalization
- Implemented efficient single-request approach for price normalization
- Added support for Divine:Exalt ratio conversion
- Results are sorted by normalized prices automatically
- Preserved original price display while showing normalized values
- Flexible architecture allows for future multi-request scenarios

### Recent Updates (2024-01)
- Improved error handling in authentication process
- Added retry mechanism for auth window loading
- Enhanced debug logging throughout authentication flow
- Implemented price normalization with single-request optimization
- Cleaned up UI elements and removed duplicate ratio inputs
- Added detailed logging for trade request authentication status

### Known Issues
- Settings persistence between Vite/Electron restarts
- Auth window behavior with cached sessions
- Need to verify normalized price sorting with large result sets

### Next Steps
- Implement settings persistence
- Add session management improvements
- Consider multi-request scenarios for specific use cases
- Enhance error handling and user feedback 