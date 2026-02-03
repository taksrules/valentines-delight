# Emotional Moments Platform - MVP Implementation Specification
## Phase 1 Build Plan
**Version:** 1.0  
**Last Updated:** February 2026  
**Timeline:** 6 weeks  
**Target Launch:** Valentine's Day 2025

---

## Document Purpose

This document defines **exactly what gets built in Phase 1 (MVP)**, while using the complete architecture defined in SYSTEM_VISION.md. The database schema includes all future tables from day one, but only Phase 1 features are implemented in code.

**Key Principle:** Build for the future, ship for today. The foundation supports the full vision, but the UI/features are intentionally limited for MVP validation.

---

## Table of Contents

1. [MVP Scope Definition](#1-mvp-scope-definition)
2. [MVP User Flows](#2-mvp-user-flows)
3. [Database Implementation](#3-database-implementation)
4. [Authentication Implementation](#4-authentication-implementation)
5. [API Endpoints (Phase 1)](#5-api-endpoints-phase-1)
6. [Frontend Implementation](#6-frontend-implementation)
7. [File Upload Implementation](#7-file-upload-implementation)
8. [Email Implementation](#8-email-implementation)
9. [Analytics Implementation](#9-analytics-implementation)
10. [Testing Requirements](#10-testing-requirements)
11. [Deployment Checklist](#11-deployment-checklist)
12. [Success Metrics](#12-success-metrics)

---

## 1. MVP Scope Definition

### 1.1 What's IN the MVP

**Core Journey Experience (Recipient Side):**
- ✅ Welcome screen with personalized greeting
- ✅ 4 memory questions with multiple choice answers
- ✅ Photo reveal gallery (polaroid style, 4-6 photos)
- ✅ Big question: "Will you be my Valentine?"
- ✅ YES/NO interaction logic
- ✅ NO loop (gentle restart with acknowledgment)
- ✅ YES celebration (confetti, memory recap)
- ✅ Background music (Jamendo API, opt-in)

**Creator Experience:**
- ✅ User signup/login (email/password + Google OAuth)
- ✅ Email verification via Resend
- ✅ Journey builder (5-step process)
  - Step 1: Occasion type (Valentine's only in MVP)
  - Step 2: Names (recipient + creator)
  - Step 3: Questions (4 questions, customizable)
  - Step 4: Photos (4-6 uploads with captions)
  - Step 5: Review & publish
- ✅ Dashboard (list of created journeys)
- ✅ Basic analytics (views, completion status)
- ✅ Unique URL generation for each journey

**Platform Features:**
- ✅ Template system (1 default template: "Classic Romantic")
- ✅ Question bank (10 pre-written questions to choose from)
- ✅ Free tier only (no paid features in MVP)
- ✅ Mobile-responsive design

### 1.2 What's OUT of the MVP

**Explicitly NOT Built in Phase 1:**
- ❌ Paid subscriptions (Stripe integration)
- ❌ Multiple occasion types (only Valentine's)
- ❌ Password protection for journeys
- ❌ Scheduled delivery
- ❌ AI question generation
- ❌ Template marketplace
- ❌ User-submitted templates
- ❌ White-label features
- ❌ API access
- ❌ Admin panel
- ❌ Team accounts
- ❌ Omnichannel delivery (SMS, WhatsApp)

**Why These Are Excluded:**
- Need to validate core value proposition first
- Reduce development time to hit Valentine's Day
- Avoid complexity before product-market fit
- Payment integration requires legal/compliance setup

### 1.3 MVP Success Criteria

**Validation Goals:**
- 100 journeys created by real users
- 80% completion rate (recipients say YES)
- <3 second page load time
- Zero data breaches or security incidents
- 5+ testimonials from actual couples

**User Feedback Questions:**
- Is the journey emotionally impactful?
- Did the NO loop feel playful or manipulative?
- Was the journey builder intuitive?
- Would you pay $9.99/month for premium features?
- What feature would you want most?

---

## 2. MVP User Flows

### 2.1 Complete Creator Flow (Phase 1)

```
Landing Page
    ↓
User clicks "Create Your Journey"
    ↓
┌─────────────────────────────────┐
│ AUTHENTICATION                  │
├─────────────────────────────────┤
│ /signup or /login               │
│ ├─ Email + Password             │
│ └─ Google OAuth                 │
└─────────────────────────────────┘
    ↓
Email Verification (if signup)
    ↓
Redirected to Dashboard (/dashboard)
    ↓
┌─────────────────────────────────┐
│ DASHBOARD                       │
├─────────────────────────────────┤
│ Empty State:                    │
│ "Ready to create your first     │
│  emotional moment?"             │
│                                 │
│ [Create Journey] button         │
└─────────────────────────────────┘
    ↓
Click "Create Journey"
    ↓
┌─────────────────────────────────────────────────┐
│ JOURNEY BUILDER - Multi-Step Form              │
├─────────────────────────────────────────────────┤
│                                                 │
│ Step 1: OCCASION TYPE                           │
│ ┌─────────────────┐                            │
│ │  Valentine's Day │ (only option in MVP)      │
│ │      💕          │                            │
│ └─────────────────┘                            │
│ [Continue]                                      │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ Step 2: NAMES                                   │
│ ┌─────────────────────────────────────────┐   │
│ │ Their name: [Dione_____________]        │   │
│ │ Your name:  [Your Chief________]        │   │
│ └─────────────────────────────────────────┘   │
│ [Back] [Continue]                               │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ Step 3: QUESTIONS (4 questions)                 │
│                                                 │
│ Option A: Use Template Questions                │
│ ┌────────────────────────────────────────┐    │
│ │ Template: Classic Romantic             │    │
│ │ ✓ 4 pre-written questions              │    │
│ │ [Use This Template]                    │    │
│ └────────────────────────────────────────┘    │
│                                                 │
│ Option B: Choose from Question Bank            │
│ ┌────────────────────────────────────────┐    │
│ │ Browse 10 suggested questions          │    │
│ │ Click to add (select 4)                │    │
│ └────────────────────────────────────────┘    │
│                                                 │
│ Option C: Write Custom Questions               │
│ ┌────────────────────────────────────────┐    │
│ │ Question 1: [________________]         │    │
│ │ Options:                               │    │
│ │  • [______________]                    │    │
│ │  • [______________]                    │    │
│ │  • [______________]                    │    │
│ │  • [______________]                    │    │
│ │ Acknowledgment: [___________]          │    │
│ └────────────────────────────────────────┘    │
│                                                 │
│ [Back] [Continue]                               │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ Step 4: PHOTOS (4-6 photos)                     │
│                                                 │
│ ┌────────────────────────────────────────┐    │
│ │ [+ Upload Photo]                       │    │
│ │                                        │    │
│ │ ┌──────┐ ┌──────┐ ┌──────┐           │    │
│ │ │Photo1│ │Photo2│ │Photo3│           │    │
│ │ └──────┘ └──────┘ └──────┘           │    │
│ │ Caption  Caption  Caption             │    │
│ │                                        │    │
│ │ Drag to reorder                        │    │
│ └────────────────────────────────────────┘    │
│                                                 │
│ Tips:                                           │
│ • Use photos that match your questions          │
│ • Max 6 photos                                  │
│ • JPEG/PNG/WebP, max 5MB each                  │
│                                                 │
│ [Back] [Continue]                               │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ Step 5: MUSIC & SETTINGS                        │
│                                                 │
│ Music:                                          │
│ ☑ Enable background music                      │
│ Mood: [Romantic ▼]                             │
│                                                 │
│ Settings:                                       │
│ Journey Link:                                   │
│ emotionalmoments.app/j/dione-valentine-a8f3    │
│                                                 │
│ ⚠️  Pro Features (Coming Soon):                │
│ □ Password protect                             │
│ □ Schedule delivery                            │
│ □ Link expires after YES                       │
│                                                 │
│ [Back] [Preview] [Publish]                      │
│                                                 │
└─────────────────────────────────────────────────┘
    ↓
Click "Preview"
    ↓
┌─────────────────────────────────┐
│ PREVIEW MODE                    │
├─────────────────────────────────┤
│ Full recipient experience       │
│ in preview overlay              │
│                                 │
│ [Close] [Edit] [Publish]        │
└─────────────────────────────────┘
    ↓
Click "Publish"
    ↓
┌─────────────────────────────────┐
│ SUCCESS MODAL                   │
├─────────────────────────────────┤
│ 🎉 Your journey is live!        │
│                                 │
│ Share link:                     │
│ [emotionalmoments.app/j/...]    │
│ [Copy Link] [Generate QR Code]  │
│                                 │
│ [View Dashboard]                │
└─────────────────────────────────┘
    ↓
Dashboard shows new journey card
```

### 2.2 Complete Recipient Flow (Phase 1)

```
Receive Link (via text, email, etc.)
    ↓
Click: emotionalmoments.app/j/dione-valentine-a8f3
    ↓
┌─────────────────────────────────┐
│ WELCOME SCREEN                  │
├─────────────────────────────────┤
│ Floating hearts animation       │
│                                 │
│ "Dione, this is for you 💕"     │
│                                 │
│ "From: Your Chief"              │
│                                 │
│ [Start the Journey] button      │
└─────────────────────────────────┘
    ↓
Click "Start"
    ↓
┌─────────────────────────────────┐
│ MUSIC PROMPT                    │
├─────────────────────────────────┤
│ "Play romantic music? 🎵"       │
│                                 │
│ [Yes, Play Music]               │
│ [Continue Silently]             │
└─────────────────────────────────┘
    ↓
MEMORY JOURNEY (4 Questions)
    ↓
┌─────────────────────────────────┐
│ QUESTION 1                      │
├─────────────────────────────────┤
│ "What first made you            │
│  smile about us?"               │
│                                 │
│ [Your laugh]                    │
│ [Your kindness]                 │
│ [Your humor]                    │
│ [Everything about you]          │
│                                 │
│ Progress: 1 of 4                │
└─────────────────────────────────┘
    ↓
Select an answer
    ↓
┌─────────────────────────────────┐
│ ACKNOWLEDGMENT                  │
├─────────────────────────────────┤
│ "And I was drawn to you         │
│  from that first moment..."     │
│                                 │
│ [Continue] (auto-advances 3s)   │
└─────────────────────────────────┘
    ↓
[Repeat for Questions 2, 3, 4]
    ↓
┌─────────────────────────────────┐
│ PHOTO REVEAL                    │
├─────────────────────────────────┤
│ Photos reveal one by one        │
│ (polaroid animation, fade-in)   │
│                                 │
│ ┌──────────┐                   │
│ │  Photo   │                   │
│ │          │                   │
│ └──────────┘                   │
│ "Where it all began 💕"         │
│                                 │
│ [Auto-advances after 5s]        │
└─────────────────────────────────┘
    ↓
All photos shown
    ↓
┌─────────────────────────────────┐
│ TRANSITION                      │
├─────────────────────────────────┤
│ Typewriter effect:              │
│                                 │
│ "After everything               │
│  we've shared...                │
│                                 │
│  There's one more thing         │
│  I want to ask..."              │
│                                 │
│ [Pause 5 seconds]               │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ THE BIG QUESTION                │
├─────────────────────────────────┤
│ "Will you be                    │
│  my Valentine?"                 │
│                                 │
│ [YES ✨] [No, thanks]           │
│                                 │
│ (YES button is larger,          │
│  visually prominent)            │
└─────────────────────────────────┘
    ↓
    ├─ Click YES ───────────────┐
    │                           │
    └─ Click NO ────────────┐   │
                            ↓   │
    ┌─────────────────────────────────┐
    │ NO SELECTED                     │
    ├─────────────────────────────────┤
    │ Gentle fade-out                 │
    │                                 │
    │ "That's okay...                 │
    │  let's remember again."         │
    │                                 │
    │ [Restarts from Welcome Screen]  │
    │                                 │
    │ (On retry, subtext changes to:) │
    │ "Will you be my Valentine?      │
    │  (Worth another look? 💕)"      │
    └─────────────────────────────────┘
         │
         └───> [Loop back to Welcome]
         
                            │
                            ↓
    ┌─────────────────────────────────┐
    │ YES OUTCOME                     │
    ├─────────────────────────────────┤
    │ 🎊 Heart confetti animation     │
    │                                 │
    │ "You said YES! 🎉"              │
    │                                 │
    │ (If first try:)                 │
    │ "I knew you'd say yes 💕"       │
    │                                 │
    │ (If after retries:)             │
    │ "Worth the wait! 😊"            │
    │                                 │
    │ [View Memory Recap]             │
    └─────────────────────────────────┘
         │
         ↓
    ┌─────────────────────────────────┐
    │ MEMORY RECAP GALLERY            │
    ├─────────────────────────────────┤
    │ All 4-6 photos in grid          │
    │ Can click to view full size     │
    │                                 │
    │ "Our Beautiful Memories         │
    │  Together 💕"                   │
    │                                 │
    │ [Replay Journey]                │
    └─────────────────────────────────┘
```

---

## 3. Database Implementation

### 3.1 MVP Database Strategy

**Critical Decision:** Create ALL tables from SYSTEM_VISION.md schema on day one, even if unused.

**Why:**
- Avoids migration hell later
- Foreign key relationships already defined
- Future features are drop-in (just write code, no schema changes)
- Easier for AI agents to understand full context

**Phase Markers in Schema:**
```prisma
// Tables marked with comments indicating when they're used:

// PHASE 1 - MVP
model User { ... }
model Journey { ... }
model JourneyQuestion { ... }
model JourneyPhoto { ... }
model JourneyAnalytics { ... }
model Template { ... }
model QuestionBank { ... }

// PHASE 2 - Paid Features (tables exist but unused in MVP)
model SubscriptionPlan { ... }
model UserSubscription { ... }

// PHASE 3 - Marketplace (tables exist but unused in MVP)
model TemplateReview { ... }

// PHASE 4 - Enterprise (tables exist but unused in MVP)
model WhiteLabel { ... }
model Organization { ... }
model ApiKey { ... }
model JourneyDelivery { ... }

// ALL PHASES
model AuditLog { ... }
model FeatureFlag { ... }
```

### 3.2 MVP Prisma Setup Steps

**Step 1: Install Prisma**
```bash
pnpm add prisma @prisma/client
pnpm add -D prisma
npx prisma init
```

**Step 2: Configure Supabase Connection**
```env
# .env.local
DATABASE_URL="postgres://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

**Step 3: Copy Complete Schema**
- Copy entire schema from SYSTEM_VISION.md into `prisma/schema.prisma`
- Do NOT remove Phase 2-4 tables

**Step 4: Run Migration**
```bash
npx prisma migrate dev --name init
```
This creates ALL tables at once.

**Step 5: Generate Prisma Client**
```bash
npx prisma generate
```

**Step 6: Seed MVP Data**
```bash
npx prisma db seed
```

### 3.3 MVP Database Seeding

**Seed Data (prisma/seed.ts):**

```typescript
// Seed data for MVP launch

// 1. Subscription Plans (exist but not used in MVP UI)
await prisma.subscriptionPlan.createMany({
  data: [
    {
      name: "free",
      displayName: "Free",
      description: "Get started with 1 journey per month",
      priceMonthly: 0,
      journeysPerMonth: 1,
      maxPhotos: 6,
      maxStorageGB: 1,
      features: JSON.stringify(["basic_templates", "question_bank"]),
      isActive: true
    },
    {
      name: "pro",
      displayName: "Pro",
      description: "Unlimited journeys + premium features",
      priceMonthly: 9.99,
      journeysPerMonth: -1,
      maxPhotos: 20,
      maxStorageGB: 5,
      features: JSON.stringify([
        "unlimited_journeys",
        "password_protection",
        "scheduled_delivery",
        "ai_generation",
        "premium_templates"
      ]),
      isActive: false // Not active in MVP
    }
  ]
})

// 2. Occasion Types (only Valentine's active in MVP)
// Note: This isn't a table, it's a string enum in Journey.occasionType
// But we'll create template for it

// 3. Default Template: "Classic Romantic"
await prisma.template.create({
  data: {
    occasionType: "valentine",
    name: "Classic Romantic",
    description: "A timeless Valentine's journey focused on shared memories and heartfelt moments",
    visibility: "public",
    isPremium: false,
    isOfficial: true,
    defaultQuestions: JSON.stringify([
      {
        questionText: "What first made you smile about us?",
        option1: "Your laugh",
        option2: "Your kindness",
        option3: "Your humor",
        option4: "Everything about you",
        acknowledgmentText: "And I was drawn to you from that first moment..."
      },
      {
        questionText: "What's your favorite memory of us?",
        option1: "Our first date",
        option2: "A quiet moment together",
        option3: "An adventure we shared",
        option4: "Every moment with you",
        acknowledgmentText: "I treasure that memory too, every detail..."
      },
      {
        questionText: "What do you love most about our time together?",
        option1: "The laughter",
        option2: "The comfort",
        option3: "The growth",
        option4: "All of it",
        acknowledgmentText: "Those moments mean everything to me..."
      },
      {
        questionText: "What are you most excited for in our future?",
        option1: "More adventures",
        option2: "Building a life together",
        option3: "Everyday moments",
        option4: "Everything ahead",
        acknowledgmentText: "I can't wait to share it all with you..."
      }
    ]),
    defaultCaptions: JSON.stringify([
      "Where it all began 💕",
      "My favorite smile",
      "This perfect day",
      "Us, always"
    ]),
    copyConfig: JSON.stringify({
      welcomeMessage: "I made this for you...",
      transitionText: "After everything we've shared...",
      bigQuestionText: "Will you be my Valentine?",
      yesOutcomeFirstTry: "I knew you'd say yes 💕",
      yesOutcomeAfterRetries: "Worth the wait! 😊",
      noRetryText: "That's okay... let's remember again.",
      completionMessage: "You said YES! 🎉"
    }),
    publishedAt: new Date()
  }
})

// 4. Question Bank (10 pre-written questions)
await prisma.questionBank.createMany({
  data: [
    {
      occasionType: "valentine",
      category: "memories",
      questionText: "What's our most unforgettable moment?",
      option1: "That first kiss",
      option2: "A trip we took",
      option3: "A quiet evening",
      option4: "Every day with you",
      acknowledgmentText: "That moment is etched in my heart forever..."
    },
    {
      occasionType: "valentine",
      category: "feelings",
      questionText: "What makes you feel most loved?",
      option1: "Your words",
      option2: "Your actions",
      option3: "Your presence",
      option4: "All of you",
      acknowledgmentText: "Knowing that means everything to me..."
    },
    // ... 8 more questions
  ]
})

// 5. Feature Flags (all disabled in MVP)
await prisma.featureFlag.createMany({
  data: [
    { key: "ai_generation_enabled", name: "AI Question Generation", description: "Enable AI-powered question generation", isEnabled: false },
    { key: "template_marketplace_live", name: "Template Marketplace", description: "Enable user-submitted template marketplace", isEnabled: false },
    { key: "scheduled_delivery_enabled", name: "Scheduled Delivery", description: "Allow scheduling journey delivery", isEnabled: false },
    { key: "password_protection_enabled", name: "Password Protection", description: "Allow password-protecting journeys", isEnabled: false }
  ]
})
```

### 3.4 MVP Database Queries

**Common Queries in MVP:**

**1. Get User's Journeys:**
```typescript
const journeys = await prisma.journey.findMany({
  where: {
    creatorId: session.user.id,
    deletedAt: null
  },
  include: {
    _count: {
      select: {
        analytics: {
          where: { eventType: "viewed" }
        }
      }
    }
  },
  orderBy: { createdAt: "desc" }
})
```

**2. Get Journey for Recipient:**
```typescript
const journey = await prisma.journey.findUnique({
  where: { uniqueSlug: slug },
  include: {
    questions: {
      orderBy: { questionOrder: "asc" }
    },
    photos: {
      orderBy: { photoOrder: "asc" }
    }
  }
})
```

**3. Log Analytics Event:**
```typescript
await prisma.journeyAnalytics.create({
  data: {
    journeyId: journey.id,
    eventType: "question_answered",
    eventData: { questionId: question.id, selectedOption: "option1" },
    sessionId: sessionId,
    timestamp: new Date()
  }
})
```

**4. Get Template with Questions:**
```typescript
const template = await prisma.template.findFirst({
  where: {
    occasionType: "valentine",
    isOfficial: true,
    visibility: "public"
  }
})

const questions = JSON.parse(template.defaultQuestions)
```

---

## 4. Authentication Implementation

### 4.1 NextAuth.js Setup

**Installation:**
```bash
pnpm add next-auth @auth/prisma-adapter
```

**Configuration File:** `app/api/auth/[...nextauth]/route.ts`

**Providers to Configure:**
1. **Email/Password** (via Credentials provider)
2. **Google OAuth**

**Required Environment Variables:**
```env
NEXTAUTH_URL="http://localhost:3000"  # Production: https://emotionalmoments.app
NEXTAUTH_SECRET="[generate with: openssl rand -base64 32]"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Resend (for email verification)
RESEND_API_KEY="re_..."
```

### 4.2 NextAuth Configuration Structure

```typescript
// Pseudo-code structure (not actual code)

import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // Email Provider for magic links / verification
    EmailProvider({
      server: "", // Not needed, custom send
      from: "noreply@nerva.studio",
      sendVerificationRequest: async ({ identifier, url }) => {
        // Send email via Resend
        await resend.emails.send({
          to: identifier,
          subject: "Verify your email",
          html: `<a href="${url}">Verify</a>`
        })
      }
    }),
    
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  
  callbacks: {
    // Add custom fields to session
    session: async ({ session, user }) => {
      session.user.id = user.id
      session.user.subscriptionTier = user.subscriptionTier
      return session
    }
  },
  
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-email",
    error: "/auth/error"
  }
}
```

### 4.3 Authentication Pages to Build

**Pages Required:**

1. **`/login`**
   - Email input
   - "Continue with Google" button
   - Link to signup

2. **`/signup`**
   - Email + password inputs
   - Terms acceptance checkbox
   - "Continue with Google" button
   - Link to login

3. **`/verify-email`**
   - "Check your email" message
   - "Resend verification" button

4. **`/reset-password`** (Phase 1, low priority)
   - Email input
   - Send reset link

### 4.4 Session Handling

**Getting Session on Server:**
```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// In Server Component
const session = await getServerSession(authOptions)

// In API Route
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  // ...
}
```

**Getting Session on Client:**
```typescript
import { useSession } from "next-auth/react"

export function Component() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <Loading />
  if (status === "unauthenticated") redirect("/login")
  
  return <div>Hello {session.user.name}</div>
}
```

### 4.5 Protected Routes

**Middleware:** `middleware.ts` at root

```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  }
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create/:path*",
    "/journeys/:path*",
    "/settings/:path*"
  ]
}
```

---

## 5. API Endpoints (Phase 1)

### 5.1 MVP API Routes

**Only these endpoints are built in MVP:**

#### 5.1.1 Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js handles this

#### 5.1.2 Journeys
```
GET    /api/v1/journeys           - List user's journeys
POST   /api/v1/journeys           - Create new journey (draft)
GET    /api/v1/journeys/[id]      - Get journey details
PATCH  /api/v1/journeys/[id]      - Update journey
DELETE /api/v1/journeys/[id]      - Soft delete journey
POST   /api/v1/journeys/[id]/publish - Publish journey (generates slug)
GET    /api/v1/journeys/[id]/analytics - Get basic analytics
```

#### 5.1.3 Questions
```
GET  /api/v1/questions/bank        - Get question suggestions (from QuestionBank)
POST /api/v1/journeys/[id]/questions - Add/update questions
```

#### 5.1.4 Photos
```
POST   /api/v1/photos/upload       - Upload photo to Supabase Storage
POST   /api/v1/journeys/[id]/photos - Attach photo to journey
PATCH  /api/v1/photos/[id]         - Update caption
DELETE /api/v1/photos/[id]         - Remove photo
```

#### 5.1.5 Templates
```
GET  /api/v1/templates             - Get template (only 1 in MVP)
POST /api/v1/journeys/from-template - Create journey from template
```

#### 5.1.6 Public (Recipient Experience)
```
GET  /api/v1/public/j/[slug]       - Get journey data (no auth required)
POST /api/v1/public/j/[slug]/event - Log analytics event
POST /api/v1/public/j/[slug]/complete - Mark journey as completed (YES clicked)
```

#### 5.1.7 User
```
GET    /api/v1/user/profile        - Get user profile
PATCH  /api/v1/user/profile        - Update profile (name, avatar)
GET    /api/v1/user/usage          - Get usage stats (journeys created this month)
```

### 5.2 API Request/Response Examples

**Example: Create Journey**
```http
POST /api/v1/journeys
Authorization: Bearer [session-token]
Content-Type: application/json

{
  "occasionType": "valentine",
  "recipientName": "Dione",
  "creatorName": "Your Chief",
  "templateId": "[template-uuid]"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "journey-uuid",
    "status": "draft",
    "occasionType": "valentine",
    "recipientName": "Dione",
    "creatorName": "Your Chief",
    "createdAt": "2026-02-02T10:00:00Z"
  }
}
```

**Example: Upload Photo**
```http
POST /api/v1/photos/upload
Authorization: Bearer [session-token]
Content-Type: multipart/form-data

file: [binary data]

Response (200):
{
  "success": true,
  "data": {
    "imageUrl": "journey-photos/user-123/journey-456/optimized/abc.webp",
    "width": 1200,
    "height": 1200,
    "fileSize": 234567
  }
}
```

**Example: Get Journey (Recipient)**
```http
GET /api/v1/public/j/dione-valentine-a8f3

Response (200):
{
  "success": true,
  "data": {
    "recipientName": "Dione",
    "creatorName": "Your Chief",
    "occasionType": "valentine",
    "musicEnabled": true,
    "musicTrackId": "jamendo-track-123",
    "questions": [
      {
        "id": "q1",
        "questionOrder": 1,
        "questionText": "What first made you smile about us?",
        "option1": "Your laugh",
        "option2": "Your kindness",
        "option3": "Your humor",
        "option4": "Everything about you",
        "acknowledgmentText": "And I was drawn to you..."
      }
      // ... 3 more questions
    ],
    "photos": [
      {
        "id": "p1",
        "photoOrder": 1,
        "imageUrl": "https://[supabase-cdn]/...",
        "caption": "Where it all began 💕"
      }
      // ... more photos
    ]
  }
}
```

### 5.3 Error Handling Pattern

**Standard Error Response:**
```typescript
// In all API routes:
try {
  // ... business logic
} catch (error) {
  console.error("API Error:", error)
  return Response.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      }
    },
    { status: 500 }
  )
}
```

### 5.4 Input Validation

**Use Zod Schemas:**

```typescript
// Example validation schema
const createJourneySchema = z.object({
  occasionType: z.enum(["valentine"]), // Only valentine in MVP
  recipientName: z.string().min(1).max(50),
  creatorName: z.string().min(1).max(50).optional(),
  templateId: z.string().uuid().optional()
})

// In API route:
const body = await request.json()
const validation = createJourneySchema.safeParse(body)

if (!validation.success) {
  return Response.json(
    {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: validation.error.errors
      }
    },
    { status: 422 }
  )
}
```

---

## 6. Frontend Implementation

### 6.1 MVP Pages to Build

**Public Pages:**
1. `/` - Landing page
2. `/login` - Login page
3. `/signup` - Signup page
4. `/verify-email` - Email verification prompt

**Authenticated Pages:**
5. `/dashboard` - User dashboard
6. `/create` - Journey builder (multi-step form)
7. `/journeys/[id]` - Journey details + analytics
8. `/journeys/[id]/edit` - Edit existing journey
9. `/settings` - User settings

**Public Recipient Experience:**
10. `/j/[slug]` - Recipient journey experience

### 6.2 Component Breakdown

**Dashboard (`/dashboard`):**
```
DashboardPage
├── DashboardHeader (welcome message, usage stats)
├── QuickActions (Create Journey button)
└── JourneyGrid
    ├── JourneyCard (for each journey)
    │   ├── Thumbnail (first photo)
    │   ├── Title (recipient name)
    │   ├── Status badge (draft/published/completed)
    │   ├── Stats (views, completion)
    │   └── Actions (edit, view, share, delete)
    └── EmptyState (if no journeys)
```

**Journey Builder (`/create`):**
```
JourneyBuilderPage
├── BuilderSidebar
│   ├── StepIndicator (1-5)
│   └── Progress (current step highlighted)
├── BuilderContent
│   ├── Step1: OccasionSelector
│   ├── Step2: NamesForm
│   ├── Step3: QuestionsEditor
│   │   ├── TemplateOption
│   │   ├── QuestionBankBrowser
│   │   └── CustomQuestionForm
│   ├── Step4: PhotoUploader
│   │   ├── DragDropZone
│   │   ├── PhotoGrid (with reorder)
│   │   └── CaptionInput (per photo)
│   └── Step5: ReviewAndPublish
│       ├── MusicToggle
│       ├── LinkPreview
│       └── ActionButtons (preview, publish)
└── BuilderFooter
    ├── BackButton
    ├── SaveDraftButton (auto-saves every 30s)
    └── ContinueButton
```

**Recipient Experience (`/j/[slug]`):**
```
RecipientJourneyPage
├── WelcomeScreen
│   ├── FloatingHearts (animation)
│   ├── PersonalizedGreeting
│   └── StartButton
├── MusicPrompt (modal)
├── MemoryJourney
│   ├── QuestionScreen (4x)
│   │   ├── QuestionText
│   │   ├── OptionButtons
│   │   └── ProgressIndicator
│   └── AcknowledgmentScreen (after each question)
├── PhotoReveal
│   ├── PolaroidCard (for each photo, animated)
│   └── Caption
├── TransitionScreen (typewriter effect)
├── BigQuestionScreen
│   ├── QuestionText
│   └── YesNoButtons
├── NoOutcome (gentle restart)
└── YesOutcome
    ├── ConfettiAnimation
    ├── CelebrationMessage
    └── MemoryRecapGallery
```

### 6.3 State Management

**Journey Builder State (Zustand):**
```typescript
interface JourneyBuilderStore {
  currentStep: number  // 1-5
  journeyId: string | null
  journeyData: {
    occasionType: string
    recipientName: string
    creatorName: string
    questions: Question[]
    photos: Photo[]
    musicEnabled: boolean
  }
  
  // Actions
  setStep: (step: number) => void
  updateJourneyData: (data: Partial<JourneyData>) => void
  saveProgress: () => Promise<void>  // Auto-save to API
  resetBuilder: () => void
}
```

**Recipient Experience State:**
```typescript
// Simple React state, no global store needed
const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
const [sessionId] = useState(() => crypto.randomUUID())
const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
const [retryCount, setRetryCount] = useState(0)
```

### 6.4 Animations

**Key Animations to Implement:**

1. **Floating Hearts** (Welcome screen)
   - CSS keyframes for floating up effect
   - Random horizontal drift

2. **Typewriter Effect** (Transition screen)
   - Character-by-character reveal
   - Framer Motion or custom hook

3. **Polaroid Reveal** (Photo gallery)
   - Fade in + slight rotation
   - Stagger timing (500ms between photos)

4. **Confetti** (YES outcome)
   - Use `canvas-confetti` library
   - Heart-shaped confetti

5. **Button Interactions**
   - Scale on hover (1.05x)
   - Glow effect on YES button
   - Shake on NO button (if clicked multiple times)

### 6.5 Responsive Design Breakpoints

```
Mobile: 0-640px (default)
Tablet: 641px-1024px
Desktop: 1025px+

Key Responsive Behaviors:
- Journey Builder: Single column on mobile, sidebar + content on desktop
- Photo Grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Recipient Experience: Always single column (centered, max-width 600px)
```

---

## 7. File Upload Implementation

### 7.1 Upload Flow

```
User selects file in PhotoUploader component
    ↓
Frontend Validation:
    - File type: image/jpeg, image/png, image/webp
    - File size: < 5MB
    - Image dimensions: >= 800x800px
    ↓
Show upload progress bar
    ↓
POST /api/v1/photos/upload (multipart/form-data)
    ↓
Server:
    1. Verify user auth
    2. Check storage quota (100MB for free tier)
    3. Generate unique filename: {timestamp}-{random}.webp
    4. Upload original to Supabase Storage: journey-photos/{userId}/{journeyId}/original/
    5. Process with Sharp:
       - Resize to max 1200x1200px
       - Convert to WebP
       - Quality: 85%
       - Strip EXIF data
    6. Upload optimized to: journey-photos/{userId}/{journeyId}/optimized/
    7. Create thumbnail: 400x400px
    8. Return URLs
    ↓
Frontend:
    - Display thumbnail in photo grid
    - Store imageUrl in local state
    - Enable caption input
```

### 7.2 Supabase Storage Configuration

**Bucket: `journey-photos`**
- **Public:** Yes (for published journeys)
- **File size limit:** 5MB per file
- **Allowed mime types:** image/jpeg, image/png, image/webp

**Storage Policies (Supabase RLS):**
```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'journey-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read for published journeys
CREATE POLICY "Public read for published journeys"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'journey-photos'
  AND EXISTS (
    SELECT 1 FROM journeys
    WHERE id = (storage.foldername(name))[2]::uuid
    AND status = 'published'
  )
);
```

### 7.3 Image Processing

**Using Sharp library:**

```typescript
// Install: pnpm add sharp

import sharp from "sharp"

async function processImage(buffer: Buffer) {
  // Optimize for web
  const optimized = await sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .rotate() // Auto-rotate based on EXIF
    .toBuffer()
  
  // Generate thumbnail
  const thumbnail = await sharp(buffer)
    .resize(400, 400, { fit: "cover" })
    .webp({ quality: 80 })
    .toBuffer()
  
  return { optimized, thumbnail }
}
```

### 7.4 Storage Quota Tracking

**Check quota before upload:**
```typescript
// In /api/v1/photos/upload

const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: {
    subscriptions: {
      where: { status: "active" },
      include: { plan: true }
    }
  }
})

const currentPlan = user.subscriptions[0]?.plan || { maxStorageGB: 0.1 } // 100MB free
const storageUsedGB = user.storageUsedGB || 0

if (storageUsedGB >= currentPlan.maxStorageGB) {
  return Response.json(
    { error: { code: "STORAGE_QUOTA_EXCEEDED", message: "Storage limit reached" } },
    { status: 403 }
  )
}
```

**Update quota after upload:**
```typescript
// After successful upload
await prisma.user.update({
  where: { id: session.user.id },
  data: {
    storageUsedGB: {
      increment: fileSizeInGB
    }
  }
})
```

---

## 8. Email Implementation

### 8.1 Resend Setup

**Installation:**
```bash
pnpm add resend
```

**Environment Variable:**
```env
RESEND_API_KEY="re_..." # From Nerva's existing Resend account
```

**Sending Domain:**
- MVP: `noreply@nerva.studio` (already configured)
- Phase 2: `noreply@emotionalmoments.app` (requires DNS setup)

### 8.2 Email Templates (React Email)

**Installation:**
```bash
pnpm add react-email @react-email/components
```

**Template Structure:**
```
emails/
├── EmailVerification.tsx
├── PasswordReset.tsx
├── WelcomeEmail.tsx
├── JourneyPublished.tsx [Phase 1, optional]
└── _components/
    ├── EmailLayout.tsx
    └── Button.tsx
```

**Example Template (EmailVerification.tsx):**
```typescript
import { Html, Head, Body, Container, Heading, Text, Button } from "@react-email/components"

export function EmailVerification({ verificationUrl, recipientName }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "sans-serif" }}>
        <Container style={{ margin: "0 auto", padding: "20px", maxWidth: "600px", backgroundColor: "#ffffff" }}>
          <Heading style={{ color: "#ff6b9d", textAlign: "center" }}>
            Welcome to Emotional Moments 💕
          </Heading>
          <Text>
            Hi{recipientName ? ` ${recipientName}` : ""},
          </Text>
          <Text>
            Click the button below to verify your email and start creating unforgettable moments.
          </Text>
          <Button
            href={verificationUrl}
            style={{
              backgroundColor: "#ff6b9d",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-block",
              margin: "20px 0"
            }}
          >
            Verify Email
          </Button>
          <Text style={{ fontSize: "12px", color: "#666" }}>
            This link expires in 24 hours.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

### 8.3 Email Sending Service

**EmailService (lib/email.ts):**
```typescript
import { Resend } from "resend"
import { render } from "@react-email/render"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(to: string, verificationUrl: string) {
  const html = render(<EmailVerification verificationUrl={verificationUrl} />)
  
  await resend.emails.send({
    from: "noreply@nerva.studio",
    to,
    subject: "Verify your email - Emotional Moments",
    html
  })
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = render(<WelcomeEmail name={name} />)
  
  await resend.emails.send({
    from: "noreply@nerva.studio",
    to,
    subject: "Welcome to Emotional Moments 💕",
    html
  })
}
```

### 8.4 Email Triggers

**MVP Email Triggers:**

1. **User signs up** → Email verification
2. **User verifies email** → Welcome email (optional, low priority)
3. **User requests password reset** → Reset email
4. **Journey published** → Confirmation email (optional, Phase 1.5)

---

## 9. Analytics Implementation

### 9.1 MVP Analytics Events

**Events to Track:**

| Event Type | Trigger | Data Captured |
|------------|---------|---------------|
| `viewed` | Recipient lands on journey page | `sessionId`, `timestamp` |
| `music_played` | Recipient enables music | `sessionId`, `timestamp` |
| `music_skipped` | Recipient skips music | `sessionId`, `timestamp` |
| `question_answered` | Recipient selects answer | `sessionId`, `questionId`, `selectedOption`, `timeToAnswer` (seconds), `timestamp` |
| `photo_viewed` | Photo reveals | `sessionId`, `photoId`, `viewDuration` (seconds), `timestamp` |
| `no_clicked` | Recipient clicks NO | `sessionId`, `retryCount`, `timestamp` |
| `yes_clicked` | Recipient clicks YES | `sessionId`, `retryCount`, `timestamp` |
| `completed` | Journey reaches final screen | `sessionId`, `totalDuration` (seconds), `timestamp` |

### 9.2 Analytics Logging

**Frontend (Recipient Experience):**
```typescript
// utils/analytics.ts

export async function logEvent(
  journeySlug: string,
  eventType: string,
  eventData?: Record<string, any>
) {
  const sessionId = getSessionId() // From localStorage or cookie
  
  await fetch(`/api/v1/public/j/${journeySlug}/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType,
      eventData,
      sessionId,
      timestamp: new Date().toISOString()
    })
  })
}

// Usage in components:
useEffect(() => {
  logEvent(slug, "viewed")
}, [slug])

function handleAnswerSelected(questionId: string, option: string) {
  const timeToAnswer = Date.now() - questionStartTime
  logEvent(slug, "question_answered", { questionId, selectedOption: option, timeToAnswer })
}
```

**Backend (API Route):**
```typescript
// /api/v1/public/j/[slug]/event

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const { eventType, eventData, sessionId } = await request.json()
  
  const journey = await prisma.journey.findUnique({
    where: { uniqueSlug: params.slug }
  })
  
  if (!journey) {
    return Response.json({ error: "Journey not found" }, { status: 404 })
  }
  
  await prisma.journeyAnalytics.create({
    data: {
      journeyId: journey.id,
      eventType,
      eventData,
      sessionId,
      timestamp: new Date()
    }
  })
  
  // Update computed metrics on Journey table
  if (eventType === "viewed") {
    await prisma.journey.update({
      where: { id: journey.id },
      data: { viewCount: { increment: 1 } }
    })
  }
  
  if (eventType === "completed") {
    await prisma.journey.update({
      where: { id: journey.id },
      data: { 
        completionCount: { increment: 1 },
        completedAt: new Date()
      }
    })
  }
  
  return Response.json({ success: true })
}
```

### 9.3 Dashboard Analytics Display

**Creator Dashboard shows:**
- **Journey Card:**
  - 👁️ Total views
  - ✅ Completion status (Completed / In Progress)
  - 🔄 Retry count (how many times NO was clicked)

**Journey Details Page (`/journeys/[id]`):**
- **Overview:**
  - Total views
  - Unique visitors (count distinct sessionIds)
  - Average time spent
  - Completion rate
  
- **Question Performance:**
  - How many people answered each question
  - Most popular answer per question
  - Average time to answer
  
- **Photo Engagement:**
  - Average view duration per photo
  - Most engaged-with photo

**Aggregation Queries:**
```typescript
// Example: Get analytics summary for journey

const analytics = await prisma.journeyAnalytics.groupBy({
  by: ["eventType"],
  where: { journeyId: journeyId },
  _count: { id: true }
})

const uniqueVisitors = await prisma.journeyAnalytics.findMany({
  where: { journeyId: journeyId },
  distinct: ["sessionId"]
})

const avgTimeSpent = await prisma.journeyAnalytics.aggregate({
  where: {
    journeyId: journeyId,
    eventType: "completed"
  },
  _avg: {
    eventData: true // Extract totalDuration from JSONB
  }
})
```

---

## 10. Testing Requirements

### 10.1 Testing Strategy

**Testing Pyramid:**
```
       E2E Tests (Playwright)
    /                        \
   /    Integration Tests     \
  /        (API routes)         \
 /________________________________\
      Unit Tests (Vitest)
```

**MVP Testing Priority:**
1. **E2E Tests (Critical):** Recipient experience must work flawlessly
2. **Integration Tests (Important):** API endpoints must be reliable
3. **Unit Tests (Nice to have):** Core business logic functions

### 10.2 E2E Test Cases (Playwright)

**Test File:** `tests/e2e/recipient-journey.spec.ts`

**Critical Path Tests:**

1. **Happy Path:**
   - User lands on journey page
   - Sees welcome screen
   - Opts into music
   - Answers all 4 questions
   - Views all photos
   - Sees transition
   - Clicks YES
   - Sees celebration
   - Views memory recap

2. **NO Loop:**
   - User completes journey
   - Clicks NO
   - Sees gentle restart message
   - Journey restarts from welcome
   - Subtext changes on retry
   - Eventually clicks YES
   - Celebration acknowledges retry count

3. **Music Disabled:**
   - User skips music
   - Journey continues without music
   - No audio plays

4. **Invalid Slug:**
   - User visits `/j/invalid-slug`
   - Sees 404 page

**Test Execution:**
```bash
# Install Playwright
pnpm create playwright

# Run E2E tests
pnpm playwright test

# Run in headed mode (see browser)
pnpm playwright test --headed

# Run specific test
pnpm playwright test recipient-journey
```

### 10.3 API Integration Tests

**Test File:** `tests/api/journeys.test.ts`

**Test Cases:**

1. **Create Journey:**
   - POST /api/v1/journeys with valid data → 201
   - POST without auth → 401
   - POST with invalid data → 422

2. **Upload Photo:**
   - POST /api/v1/photos/upload with valid image → 200
   - POST with oversized file → 413
   - POST with invalid file type → 422

3. **Publish Journey:**
   - POST /api/v1/journeys/[id]/publish → 200, generates unique slug
   - Verify slug is URL-safe and unique

4. **Get Public Journey:**
   - GET /api/v1/public/j/[slug] → 200, returns journey data
   - GET with invalid slug → 404

**Test Framework:** Vitest + Supertest (or just fetch)

### 10.4 Manual Testing Checklist

**Before MVP Launch:**

- [ ] Test full creator flow on mobile (Chrome Android)
- [ ] Test full creator flow on mobile (Safari iOS)
- [ ] Test full recipient flow on mobile
- [ ] Test with slow 3G connection (throttle in DevTools)
- [ ] Test with screen reader (VoiceOver or NVDA)
- [ ] Test email verification flow
- [ ] Test password reset flow
- [ ] Test Google OAuth signup/login
- [ ] Upload photos of various sizes/formats
- [ ] Test journey with 4 photos (minimum)
- [ ] Test journey with 6 photos (maximum)
- [ ] Test NO loop 3+ times in a row
- [ ] Test music on/off toggle
- [ ] Check analytics are logging correctly
- [ ] Test on Vercel production deployment

---

## 11. Deployment Checklist

### 11.1 Environment Setup

**Vercel Project Configuration:**

```env
# Production Environment Variables

# Database
DATABASE_URL="postgres://..." # Supabase pooled connection
DIRECT_URL="postgres://..." # Supabase direct connection

# NextAuth
NEXTAUTH_URL="https://journey.nerva.studio"
NEXTAUTH_SECRET="[production secret]"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Resend
RESEND_API_KEY="re_..." # Nerva's API key

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..." # For server-side operations

# Jamendo
JAMENDO_CLIENT_ID="..."

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
```

### 11.2 Pre-Deployment Steps

**Week Before Launch:**
- [ ] Database migrations run in production
- [ ] Seed data loaded (template, question bank)
- [ ] Supabase Storage buckets created with correct policies
- [ ] Resend sending domain verified (nerva.studio)
- [ ] Google OAuth credentials configured for production domain
- [ ] Vercel project created and linked to GitHub repo

**Day Before Launch:**
- [ ] Run full E2E test suite in production environment
- [ ] Load test with k6 or Artillery (simulate 100 concurrent users)
- [ ] Verify all environment variables are set
- [ ] Test email sending from production
- [ ] Verify Supabase database connection

**Launch Day:**
- [ ] Deploy to production (push to main branch)
- [ ] Monitor Vercel deployment logs
- [ ] Test one full journey end-to-end on production
- [ ] Share test link with team for validation
- [ ] Monitor Sentry for errors (if enabled)

### 11.3 Post-Deployment Monitoring

**First 24 Hours:**
- Check Vercel Analytics for traffic
- Monitor Supabase database CPU/memory
- Check Resend email delivery rates
- Watch for any 500 errors in logs

**First Week:**
- Review user signups (target: 10+)
- Review journeys created (target: 5+)
- Review completion rate (target: 80%+)
- Collect user feedback

---

## 12. Success Metrics

### 12.1 MVP Launch Goals (First Month)

**User Acquisition:**
- ✅ 100 signups
- ✅ 50 journeys created
- ✅ 40 journeys published

**Engagement:**
- ✅ 80% completion rate (recipients say YES)
- ✅ Average 3-5 minutes time spent on recipient experience
- ✅ <10% bounce rate on welcome screen

**Technical:**
- ✅ 99% uptime
- ✅ <3s page load time (Lighthouse score >90)
- ✅ Zero security incidents
- ✅ Zero data loss events

**Qualitative:**
- ✅ 5+ testimonials from real users
- ✅ 3+ social media shares
- ✅ 10+ feedback responses

### 12.2 Validation Questions

**Questions to Answer Post-MVP:**

1. **Value Prop:**
   - Do users find the journey emotionally impactful?
   - Would they create another journey for a different occasion?

2. **Monetization:**
   - Would users pay $9.99/month for Pro features?
   - Which premium feature is most requested?

3. **Product-Market Fit:**
   - What occasion types are users requesting?
   - Are users sharing their journeys organically?

4. **User Experience:**
   - Is the journey builder intuitive?
   - Are users completing the builder or dropping off?
   - Which step takes the longest?

### 12.3 Decision Points

**After 100 Journeys Created:**

✅ **Proceed to Phase 2 if:**
- Completion rate >75%
- Users are asking for paid features
- 10+ users willing to pay for Pro

❌ **Pivot if:**
- Completion rate <50% (journey not engaging enough)
- High drop-off in journey builder (too complex)
- No organic sharing or word-of-mouth

---

## Appendix A: File Structure

```
emotional-moments/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── features/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify-email/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── create/
│   │   ├── journeys/[id]/
│   │   └── settings/
│   ├── j/[slug]/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   └── v1/
│   │       ├── journeys/
│   │       ├── photos/
│   │       ├── questions/
│   │       ├── templates/
│   │       ├── public/
│   │       └── user/
│   └── layout.tsx
│
├── components/
│   ├── ui/ (shadcn/ui)
│   ├── journey/
│   ├── builder/
│   ├── dashboard/
│   └── shared/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── email.ts
│   └── storage.ts
│
├── stores/
│   └── journeyBuilder.ts
│
├── emails/
│   ├── EmailVerification.tsx
│   ├── PasswordReset.tsx
│   └── WelcomeEmail.tsx
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── tests/
│   ├── e2e/
│   └── api/
│
├── public/
│   ├── images/
│   └── fonts/
│
├── .env.local
├── .env.production
├── next.config.js
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## Appendix B: Development Timeline

**Week 1: Foundation**
- Day 1-2: Project setup, Prisma schema, database migration
- Day 3-4: NextAuth configuration, auth pages
- Day 5-7: Dashboard layout, navigation

**Week 2: Journey Builder**
- Day 8-10: Multi-step form UI
- Day 11-12: Photo upload functionality
- Day 13-14: Template integration, question selection

**Week 3: Recipient Experience**
- Day 15-17: Journey screens (welcome through big question)
- Day 18-19: Animations, music integration
- Day 20-21: YES/NO logic, celebration

**Week 4: Analytics & Polish**
- Day 22-23: Analytics implementation
- Day 24-25: Email templates, email sending
- Day 26-28: Bug fixes, responsive design

**Week 5: Testing**
- Day 29-30: E2E tests
- Day 31-32: API tests
- Day 33-35: Manual testing, bug fixes

**Week 6: Launch Prep**
- Day 36-37: Production deployment
- Day 38-39: Load testing, monitoring setup
- Day 40-42: Soft launch, feedback gathering

**Total: 6 weeks to MVP**

---

## Appendix C: Critical Decisions

**Architecture Decisions Made:**
1. ✅ Use NextAuth.js (not Supabase Auth)
2. ✅ Use Prisma ORM (not raw SQL or Supabase SDK)
3. ✅ Use Resend for email (existing Nerva account)
4. ✅ Use Supabase Storage for files (not Cloudinary)
5. ✅ Create full database schema from day one
6. ✅ Free tier only in MVP (no Stripe integration)
7. ✅ Valentine's occasion only (no other occasions)
8. ✅ Domain: journey.nerva.studio (Phase 1) → emotionalmoments.app (Phase 2)

**Open Questions (Resolve Before Development):**
- [ ] Exact copy for "Classic Romantic" template questions?
- [ ] Should MVP have "Replay Journey" button after completion?
- [ ] Should creator get email notification when journey is completed?
- [ ] Should there be a "Skip Music" button always visible during journey?

---

## Document Version History

- **v1.0** (Feb 2026): Initial MVP specification
- **v1.1** (Post-launch): Update based on user feedback

---

**End of MVP Implementation Specification**

**Next Steps:**
1. Review this document with entire team
2. Set up development environment
3. Create GitHub project board
4. Begin Week 1 tasks

For complete system vision and Phase 2-4 plans, see: `SYSTEM_VISION.md`