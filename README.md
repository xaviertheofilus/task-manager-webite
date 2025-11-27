# 📋 Task Manager Web Application

A modern, feature-rich task management application built with Next.js, TypeScript, and Tailwind CSS. Features AI-powered insights, real-time analytics, and an intuitive kanban-style interface.

![Next.js](https://img.shields.io/badge/Next.js-13.5.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🎯 Core Features
- **Task Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Kanban Board**: Visual task organization with drag-and-drop columns
- **Priority System**: High, Medium, Low priority levels with color coding
- **Status Tracking**: To Do, In Progress, Completed workflow
- **Due Dates**: Set and track task deadlines
- **Tags System**: Categorize tasks with custom tags

### 🤖 AI-Powered Features
- **Smart Task Analysis**: AI-powered insights and recommendations
- **Priority Suggestions**: Automatic priority detection based on task content
- **Time Estimation**: Intelligent task duration predictions
- **Professional Reports**: Generate comprehensive analysis reports
- **PDF Export**: Download reports in professional PDF format

### 📊 Analytics & Insights
- **Dashboard Overview**: Real-time task statistics and metrics
- **Timeline View**: Visualize task distribution over time
- **Priority Distribution**: Charts showing workload by priority
- **Completion Trends**: Track productivity patterns
- **Date Range Filtering**: Analyze specific time periods

### 👥 Team Management
- **User Management**: Add and manage team members
- **User Profiles**: Avatar generation and contact information
- **Task Assignment**: Track tasks per user

### 🎨 UI/UX Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Mode Ready**: Modern, professional interface
- **Sidebar Navigation**: Easy access to all features
- **Loading Protection**: Timeout and manual dismiss for stuck loading states
- **Toast Notifications**: Real-time feedback for all actions

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 13.5.6 (Pages Router)
- **Language**: TypeScript 5.3.2
- **Styling**: Tailwind CSS 3.3.6
- **Icons**: Lucide React 0.294.0
- **Charts**: Recharts 2.10.3
- **PDF Generation**: jsPDF 3.0.4

### Backend/API
- **API Routes**: Next.js API routes
- **Validation**: Custom validation library
- **Storage**: localStorage (Web Storage API)

### AI Integration
- **AI Service**: Groq SDK 0.5.0
- **Analysis**: Task insights and recommendations

### State Management
- **Context API**: AuthContext, TaskContext
- **Hooks**: Custom hooks for localStorage and debounce

## 📁 Project Structure

```
task-management-web/
├── public/                 # Static assets
│   └── logo.png
├── src/
│   ├── components/         # React components
│   │   ├── common/        # Reusable components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   └── TextArea.tsx
│   │   ├── layout/        # Layout components
│   │   │   ├── Layout.tsx
│   │   │   └── Sidebar.tsx
│   │   └── tasks/         # Task-specific components
│   │       ├── TaskCard.tsx
│   │       ├── TaskForm.tsx
│   │       └── TaskList.tsx
│   ├── context/           # React Context
│   │   ├── AuthContext.tsx
│   │   └── TaskContext.tsx
│   ├── hooks/             # Custom hooks
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── lib/               # Utilities and helpers
│   │   ├── constants.ts
│   │   ├── database.ts
│   │   ├── storage.ts
│   │   ├── utils.ts
│   │   └── validation.ts
│   ├── pages/             # Next.js pages
│   │   ├── api/          # API routes
│   │   │   ├── ai/
│   │   │   │   └── analyze.ts
│   │   │   ├── auth/
│   │   │   │   ├── login.ts
│   │   │   │   └── logout.ts
│   │   │   └── tasks/
│   │   │       ├── [id].ts
│   │   │       └── index.ts
│   │   ├── tasks/        # Task pages
│   │   │   ├── [id].tsx
│   │   │   ├── create.tsx
│   │   │   ├── index.tsx
│   │   │   └── edit/
│   │   │       └── [id].tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx     # Dashboard
│   │   ├── insights.tsx  # Analytics
│   │   ├── login.tsx
│   │   ├── timeline.tsx
│   │   └── users.tsx
│   ├── styles/           # Global styles
│   │   └── globals.css
│   └── types/            # TypeScript types
│       ├── ai.ts
│       ├── api.ts
│       ├── index.ts
│       ├── task.ts
│       └── user.ts
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: Latest version

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/task-management-web.git
cd task-management-web
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (422 packages total).

### Step 3: Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI Service Configuration
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME=Task Manager
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_INSIGHTS=true
```

### Step 4: Run Development Server

```bash
npm run dev
```

The application will start at **http://localhost:3000**

### Step 5: Build for Production

```bash
npm run build
npm start
```

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔐 Authentication

### Demo Login
The application uses demo authentication for development:

- **Email**: Any valid email format (e.g., `demo@example.com`)
- **Password**: Minimum 6 characters (e.g., `demo123`)

### Features
- ✅ Email format validation
- ✅ Password length validation (min 6 chars)
- ✅ Session management (7-day expiry)
- ✅ Protected routes with authentication guards
- ✅ Auto-redirect to login if unauthenticated

**Note**: For production, implement proper authentication with:
- Password hashing (bcrypt/argon2)
- Database integration
- JWT tokens
- OAuth providers (optional)

## 📖 Usage Guide

### Creating a Task

1. Click **"Create Task"** button on Dashboard or Tasks page
2. Fill in the form:
   - **Title**: Task name (min 3 characters)
   - **Description**: Task details (min 10 characters)
   - **Priority**: High, Medium, or Low
   - **Status**: To Do, In Progress, or Completed
   - **Due Date**: Optional deadline
   - **Tags**: Custom labels
   - **Estimated Time**: Duration estimate
3. Click **"Create Task"** to save

### AI Features

#### Auto-Suggestions
- Click **"Get AI Suggestions"** in task form
- AI analyzes title and description
- Provides:
  - Suggested priority
  - Time estimation
  - Recommended tags
  - Due date suggestion

#### AI Insights Report
1. Navigate to **Insights** page
2. (Optional) Set date range filter
3. Click **"Generate AI Analysis"**
4. Review professional report with:
   - Executive summary
   - Task statistics
   - Performance metrics
   - Recommendations
5. Click **"Edit Report"** to customize
6. Click **"Download PDF"** to save

### Managing Tasks

#### View Tasks
- **Dashboard**: Kanban board with 3 columns
- **Tasks Page**: All tasks in colored columns
- **Timeline**: Historical task distribution
- **Insights**: Analytics and charts

#### Edit Task
1. Click on task card
2. Click **"Edit"** button
3. Modify task details
4. Click **"Update Task"**

#### Delete Task
1. Click on task card
2. Click **"Delete"** button
3. Confirm deletion in modal

#### Quick Actions
- Click status badge to change status directly
- View task details by clicking anywhere on card

## 🎨 UI Features

### Color Coding

**Priorities:**
- 🔴 **High**: Red badge
- 🟡 **Medium**: Yellow badge
- ⚪ **Low**: Grey badge

**Status:**
- 📝 **To Do**: Slate background
- 🔄 **In Progress**: Blue background
- ✅ **Completed**: Green background

### Navigation
- **Dashboard**: Overview and kanban board
- **Tasks**: All tasks view
- **Timeline**: Task timeline analytics
- **Users**: Team member management
- **Insights**: AI-powered analytics

## 🐛 Troubleshooting

### Loading Overlay Stuck
If you see a loading screen that won't disappear:
- **Wait 3 seconds**: "Click to close" button appears
- **Click anywhere** on the overlay to dismiss
- **Wait 5 seconds**: Auto-closes and redirects

### Server Won't Start
```bash
# Stop all Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear build cache
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue

# Restart server
npm run dev
```

### TypeScript Errors
```bash
# Run type check
npm run type-check

# Rebuild
npm run build
```

### Port 3000 Already in Use
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or use different port
$env:PORT=3001
npm run dev
```

## 🔒 Security Considerations

### Current Implementation (Development)
- ⚠️ Demo authentication (accepts any valid credentials)
- ⚠️ localStorage for data storage
- ⚠️ No password hashing
- ⚠️ No CSRF protection
- ⚠️ No rate limiting

### Recommended for Production
- ✅ Implement real authentication (NextAuth.js, Supabase Auth)
- ✅ Use database (PostgreSQL, MongoDB, Supabase)
- ✅ Add password hashing (bcrypt, argon2)
- ✅ Implement CSRF tokens
- ✅ Add rate limiting (next-rate-limit)
- ✅ Add XSS protection (DOMPurify)
- ✅ Enable HTTPS
- ✅ Add Content Security Policy headers

## 📊 Performance

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### Optimizations
- ✅ Static page generation
- ✅ Image optimization
- ✅ Code splitting
- ✅ CSS minification
- ✅ Responsive images

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Recharts](https://recharts.org/) - Chart library
- [Groq](https://groq.com/) - AI API
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

Made with ❤️ using Next.js, TypeScript, and Tailwind CSS
