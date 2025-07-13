# Emotion Snap 📸

**Emotion Snap** is an AI-powered web application that creates engaging photo
contests by analyzing facial emotions. Participants capture photos with specific
emotions, and the app uses AWS Rekognition to score and rank them in real-time.

Perfect for **weddings, parties, corporate events**, and any gathering where you
want to capture genuine emotions and create fun competitions!

## ✨ Features

### 🔐 User Authentication

- **Google OAuth** integration via Supabase Auth
- Secure session management across all routes
- No complicated signup process - just sign in with Google

### 📅 Event Management

- **Create Events** with custom names, codes, and dates (up to 3 events per
  user)
- **Edit & Delete** events with full control
- **Publish Events** publicly with expiry dates (max 7 days)
- **QR Code Generation** for easy sharing with participants

### 📸 Real-time Photo Capture & Analysis

- **Mobile-optimized camera interface** using device camera
- **AWS Rekognition AI** analyzes facial emotions in real-time
- **5 Emotion Types** tracked: Happy, Angry, Sad, Surprised, Smile
- **Instant scoring** with confidence percentages
- **AWS S3 storage** for secure photo management

### 🏆 Live Ranking System

- **Multiple ranking modes**: Individual emotions or combined scores
- **Real-time leaderboard** updates as photos are submitted
- **Trophy system** with Gold/Silver/Bronze visual indicators
- **Participant gallery** showing all submitted photos with names

### 🌐 Public Participation

- **No account required** for participants
- **Simple name-based submission** via public event URLs
- **Mobile-friendly interface** optimized for smartphones
- **Automatic expiry** prevents old events from staying active

## 🚀 Live Demo

1. Visit the application
2. Sign in with your Google account
3. Create a new event (e.g., "Wedding Photo Contest")
4. Publish the event and share the QR code
5. Participants scan QR code, enter their name, and take photos
6. Watch real-time rankings update as emotions are analyzed!

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Ant Design
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase PostgreSQL with auto-generated types
- **AI/ML**: AWS Rekognition for facial emotion detection
- **Storage**: AWS S3 for photo storage
- **Styling**: Ant Design with custom theming
- **Testing**: Vitest with React Testing Library
- **Code Quality**: Biome for linting and formatting

### Emotion Scores

Each photo stores confidence scores (0-100) for:

- `happy_score`
- `angry_score`
- `sad_score`
- `surprised_score`
- `smile_score`

## 📱 User Journey

1. **Sign In** → Google OAuth authentication
2. **Create Event** → Set name, code, date
3. **Publish Event** → Generate QR code, set expiry (max 7 days)
4. **Share** → Participants scan QR code or visit public URL
5. **Participate** → Take photos with camera, AI analyzes emotions
6. **Compete** → Real-time rankings update automatically
7. **Celebrate** → View final leaderboard and photo gallery

### Installation & Startup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run on http://localhost:3100
```

### Development Commands

```bash
# Development
pnpm dev                    # Start dev server (port 3100)
pnpm build                  # Build for production
pnpm start                  # Start production server

# Code Quality
pnpm check                  # Run Biome lint + format + organize imports
pnpm test                   # Run Vitest tests with jsdom
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── events/            # Event management
│   ├── public-events/     # Public participation
│   └── my-page/           # User dashboard
├── common/                # Shared utilities and types
├── libs/                  # External service integrations
│   ├── supabase/         # Database and auth
│   ├── rekognition/      # AWS emotion analysis
│   └── s3/               # File storage
└── modules/              # Generated database types
```

### Key Patterns

- **Server Actions**: All data mutations use Next.js server actions in
  `_actions/` folders
- **Error Handling**: Custom `ServerActionEither<E, T>` type for consistent
  error patterns
- **Component Architecture**: Container/Presenter pattern with clear separation
- **Type Safety**: Auto-generated database types from Supabase schema

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

Tests are located in `__tests__/` folders alongside components and cover:

- Component rendering and interactions
- Server action error handling
- Utility functions
- Database type safety

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic builds on push

## 🔒 Security Considerations

- **Authentication**: Secured with Supabase Auth and Google OAuth
- **Authorization**: Row Level Security (RLS) policies protect user data
- **File Upload**: Secure S3 integration with signed URLs
- **API Security**: Server actions with user ownership validation
- **No Secret Exposure**: All sensitive data handled server-side

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`pnpm test`)
4. Check code quality (`pnpm check`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📞 Support

For questions or issues, please create an issue in the repository or contact the
development team.

---

**Built with ❤️ using Next.js, Supabase, and AWS**
