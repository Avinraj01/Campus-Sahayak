# Frontend Architecture and Component Structure

## Project Structure

```
frontend/
├── src/
│   ├── App.js                 # Main application component and routing
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Atomic UI components (buttons, cards, etc.)
│   │   ├── StudentPortalPage.js
│   │   ├── ComplaintsPage.js
│   │   ├── CalendarPage.js
│   │   ├── NoticesPage.js
│   │   ├── ContactPage.js
│   │   └── FormsPage.js
│   ├── utils/
│   │   └── api.js            # Axios instance and API configuration
│   ├── api/                  # API route handlers (for Vercel serverless functions)
│   │   ├── auth/
│   │   │   ├── login.js
│   │   │   └── register.js
│   │   ├── chat/
│   │   │   └── index.js
│   │   ├── complaints/
│   │   │   └── index.js
│   │   ├── forms/
│   │   │   └── index.js
│   │   └── notices/
│   │       └── index.js
│   └── lib/
│       └── utils.js          # Utility functions for API routes
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
└── .env.example             # Environment variables template
```

## Main Application Component (App.js)

The main application component serves as the entry point and contains:

1. **Authentication Context**: Manages user authentication state
2. **Routing**: Handles navigation between different pages
3. **Protected Routes**: Ensures only authenticated users can access certain pages
4. **Dashboard**: Main landing page with AI chat widget
5. **Navigation**: Global navigation bar

### Key Features in App.js

- **Auth Context Provider**: Wraps the entire application to provide authentication state
- **Protected Route Component**: Redirects unauthenticated users to login
- **Login Page**: Handles user authentication
- **Dashboard**: Main page with AI chat widget and quick links
- **Routing Configuration**: Maps URLs to components

## Authentication Flow

### AuthContext
The authentication context provides:
- `user`: Current user data
- `token`: JWT authentication token
- `login()`: Function to log in a user
- `logout()`: Function to log out a user
- `loading`: Loading state during authentication

### LoginPage Component
Handles both login and registration:
- Form validation
- API calls to backend authentication endpoints
- Error handling and user feedback
- "Remember Me" functionality
- Password visibility toggle

## Dashboard Component

The dashboard is the main landing page that includes:

### AI Chat Widget
- **Floating Chat Button**: Accessible from anywhere on the dashboard
- **Chat Interface**: Modal dialog with message history
- **Multilingual Support**: Language selection dropdown
- **Voice Recognition**: Speech-to-text input capability
- **Text-to-Speech**: Audio output for responses
- **Suggested Links**: Context-aware navigation suggestions

### Quick Access Links
- Complaints submission
- Form submissions
- Academic calendar
- Campus notices

## Page Components

### StudentPortalPage.js
- Student profile information
- Academic records (grades, attendance)
- Fee payment status
- Document center

### ComplaintsPage.js
- Form for submitting complaints
- List of previous complaints with status
- Category selection
- Real-time updates

### CalendarPage.js
- Academic schedule display
- Event management
- Important dates highlighting

### NoticesPage.js
- Campus announcements
- Categorized notices
- Date filtering

### ContactPage.js
- Campus contact information
- WhatsApp integration
- Social media links

### FormsPage.js
- Form submission interface
- Document upload capability
- Form type selection
- Submission history

## API Integration

### Axios Configuration (utils/api.js)
- Base URL configuration from environment variables
- Request interceptor for automatic JWT token inclusion
- Response handling

### API Call Pattern
```javascript
import { api } from '../utils/api';

// Example: Fetch user complaints
const fetchComplaints = async () => {
  try {
    const response = await api.get("/complaints");
    setComplaints(response.data);
  } catch (error) {
    console.error('Error fetching complaints:', error);
  }
};
```

## UI Components

### Atomic Components (components/ui/)
- Button: Primary and secondary action buttons
- Card: Content containers with headers and footers
- Input: Text input fields with validation
- Textarea: Multi-line text input
- Select: Dropdown selection component
- Badge: Status indicators
- Tabs: Tabbed interface for organizing content
- Dialog: Modal dialogs for forms and confirmations

### Component Hierarchy
```
App
├── AuthProvider
│   └── BrowserRouter
│       └── Routes
│           ├── LoginPage
│           ├── ProtectedRoute
│           │   └── Dashboard
│           │       ├── Navigation
│           │       ├── Hero Section
│           │       ├── Features Section
│           │       ├── Quick Links Section
│           │       └── Chat Widget
│           ├── ProtectedRoute
│           │   └── StudentPortalPage
│           ├── ProtectedRoute
│           │   └── ComplaintsPage
│           ├── ProtectedRoute
│           │   └── CalendarPage
│           ├── ProtectedRoute
│           │   └── NoticesPage
│           ├── ProtectedRoute
│           │   └── ContactPage
│           └── ProtectedRoute
│               └── FormsPage
```

## State Management

### React Context API
- Authentication state (user, token)
- Loading states
- Error states

### Component State
- Local form data
- UI interaction states (open/closed dialogs)
- Loading indicators
- Selection states

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design classes
- Color palette customization
- Component styling through className props

### Custom Styling
- Gradient backgrounds
- Shadow effects
- Animation and transitions
- Responsive layouts

## Environment Configuration

### Environment Variables
- `REACT_APP_BACKEND_URL`: Backend API base URL
- Port configuration for development

### Configuration Files
- `.env.example`: Template for environment variables
- `package.json`: Build scripts and dependencies

## Build and Deployment

### Scripts
- `npm start`: Development server
- `npm run build`: Production build
- `npm test`: Test runner

### Vercel Deployment
- Serverless functions in `api/` directory
- Automatic builds on git push
- Environment variable configuration in Vercel dashboard

## Testing

### Test Files
- `test-api.js`: API connection testing
- `test-login-functionality.js`: Authentication flow testing
- `test-routing.js`: Route navigation testing

### Testing Approach
- Manual testing during development
- Console logging for debugging
- Error boundary implementation

## Performance Considerations

### Optimization Techniques
- Code splitting through React.lazy
- Memoization with React.memo
- Efficient state updates
- Lazy loading of components

### Bundle Optimization
- Tree shaking for unused code
- Minification in production builds
- Asset compression

## Accessibility

### ARIA Attributes
- Proper labeling of form elements
- Semantic HTML structure
- Keyboard navigation support

### Screen Reader Support
- Descriptive alt texts
- Proper heading hierarchy
- Focus management

## Mobile Responsiveness

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Adaptive component sizing

### Device Testing
- Multiple screen size support
- Orientation change handling
- Touch gesture optimization