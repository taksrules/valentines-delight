# Emotional Moments Platform - System Vision Specification
## Complete End-State Architecture (Phase 4)
**Version:** 1.0  
**Last Updated:** February 2026  
**Status:** Reference Architecture for MVP Development

---

## Document Purpose

This document defines the **complete end-state system** that Emotional Moments Platform will become. The MVP is intentionally designed as a subset of this architecture, ensuring zero technical debt as features are added.

**Key Principle:** Build the MVP using this architecture. The database, API structure, and system design support the full vision from day one.

---

## Table of Contents

1. [Strategic Vision](#1-strategic-vision)
2. [System Architecture](#2-system-architecture)
3. [Complete Database Schema](#3-complete-database-schema)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [API Architecture](#5-api-architecture)
6. [File Storage Architecture](#6-file-storage-architecture)
7. [Email & Communication Architecture](#7-email--communication-architecture)
8. [AI Integration Architecture](#8-ai-integration-architecture)
9. [Analytics & Observability](#9-analytics--observability)
10. [Security Architecture](#10-security-architecture)
11. [Scalability & Performance](#11-scalability--performance)
12. [B2B White-Label Architecture](#12-b2b-white-label-architecture)
13. [Omnichannel Delivery Architecture](#13-omnichannel-delivery-architecture)
14. [Integration Architecture](#14-integration-architecture)

---

## 1. Strategic Vision

### 1.1 Product Definition

**What This Is:**
A multi-tenant SaaS platform for creating emotionally intelligent digital experiences that help people express vulnerability in healthy, consent-aware ways.

**End-State Capabilities:**
- Multiple occasion types (Valentine's, proposals, anniversaries, apologies, long-distance, custom)
- AI-powered content generation and optimization
- Template marketplace (platform + user-submitted)
- White-label for businesses (hotels, jewelers, wedding planners)
- Omnichannel delivery (web, email, SMS, WhatsApp)
- Enterprise features (team accounts, SSO, API access, analytics)
- Voice narration via Nerva Studios integration
- Multi-language support

### 1.2 Strategic Position in Nerva Studios

**Brand Architecture:**
```
Nerva Studios (Parent)
├── Nerva Voice AI (B2B Enterprise)
│   └── Conversational AI for businesses
└── Emotional Moments (B2C/B2B Hybrid)
    └── Digital emotional experiences
```

**Strategic Value:**
- Consumer-facing showcase of emotional computing expertise
- Revenue diversification (consumer subscriptions + B2B white-label)
- Cross-pollination with voice AI (voice narration, tone analysis)
- Portfolio effect for enterprise sales and fundraising

### 1.3 Target Users

**Primary Users (MVP):**
- Men 25-45 asking romantic partners to be their Valentine
- People planning marriage proposals
- Long-distance couples

**Secondary Users (Phase 2-3):**
- Anniversary celebrations
- Apology/reconciliation scenarios
- Non-romantic emotional moments (parent-child, friendship)

**Enterprise Users (Phase 4):**
- Hotels/resorts (romantic packages)
- Jewelry stores (proposal support)
- Wedding planners
- Event venues
- Corporate HR (employee appreciation)

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Next.js App (App Router)                                   │
│  ├── Marketing Site (/)                                     │
│  ├── Authentication (/auth/*)                               │
│  ├── Creator Dashboard (/dashboard)                         │
│  ├── Journey Builder (/create)                              │
│  ├── Recipient Experience (/j/[slug])                       │
│  ├── Template Marketplace (/templates)                      │
│  ├── Admin Panel (/admin) [Phase 3]                         │
│  └── API Documentation (/docs) [Phase 4]                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Next.js API Routes)            │
├─────────────────────────────────────────────────────────────┤
│  /api/v1/                                                   │
│  ├── auth/*           (NextAuth.js)                         │
│  ├── journeys/*       (CRUD operations)                     │
│  ├── templates/*      (Template management)                 │
│  ├── uploads/*        (File upload)                         │
│  ├── analytics/*      (Event tracking)                      │
│  ├── ai/*             (AI generation) [Phase 3]             │
│  ├── marketplace/*    (Template marketplace) [Phase 3]      │
│  ├── webhooks/*       (Stripe, etc)                         │
│  ├── white-label/*    (B2B features) [Phase 4]              │
│  └── integrations/*   (Third-party) [Phase 4]               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Business Logic Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Services:                                                  │
│  ├── JourneyService                                         │
│  ├── TemplateService                                        │
│  ├── AnalyticsService                                       │
│  ├── StorageService                                         │
│  ├── EmailService                                           │
│  ├── AIService [Phase 3]                                    │
│  ├── BillingService                                         │
│  ├── WhiteLabelService [Phase 4]                            │
│  └── IntegrationService [Phase 4]                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  Prisma ORM                                                 │
│  ├── Type-safe queries                                      │
│  ├── Migrations                                             │
│  └── Database pooling                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ├── Supabase PostgreSQL (Database)                         │
│  ├── Supabase Storage (File storage)                        │
│  ├── Resend (Email delivery)                                │
│  ├── Stripe (Payments)                                      │
│  ├── OpenAI API (AI features) [Phase 3]                     │
│  ├── Jamendo API (Music)                                    │
│  ├── Twilio (SMS) [Phase 4]                                 │
│  └── WhatsApp Business API [Phase 4]                        │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

**Frontend:**
- **Framework:** Next.js 14+ (App Router, React Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand (creator flow), React Context (global state)
- **HTTP Client:** Native fetch (with type-safe wrappers)

**Backend:**
- **Framework:** Next.js API Routes
- **ORM:** Prisma (type-safe database access)
- **Authentication:** NextAuth.js v5
- **Validation:** Zod schemas
- **File Processing:** Sharp (image optimization)

**Infrastructure:**
- **Database:** Supabase (PostgreSQL 15+)
- **File Storage:** Supabase Storage (S3-compatible)
- **Email:** Resend
- **Payments:** Stripe
- **AI:** OpenAI GPT-4 API [Phase 3]
- **Hosting:** Vercel (Edge Network)
- **Domain:** journey.nerva.studio → emotionalmoments.app [Phase 2]

**Development Tools:**
- **Version Control:** Git + GitHub
- **Package Manager:** pnpm
- **Linting:** ESLint + Prettier
- **Testing:** Playwright (E2E), Vitest (unit tests)
- **CI/CD:** GitHub Actions + Vercel
- **Monitoring:** Vercel Analytics + Sentry
- **API Documentation:** OpenAPI 3.0 + Scalar [Phase 4]

### 2.3 System Boundaries

**What This System Does:**
- Journey creation and management
- Template library and marketplace
- Recipient experience delivery
- Analytics and insights
- Payment processing
- AI content generation
- White-label deployment

**What This System Does NOT Do:**
- Social media posting (users copy/share links)
- Video hosting (images/photos only)
- Real-time collaboration (async workflows only)
- Mobile app development (PWA only)
- Blockchain/NFT features

---

## 3. Complete Database Schema

### 3.1 Schema Design Principles

1. **Build for the future, enable today:** All tables exist from day one, even if unused in MVP
2. **Phase markers:** Comments indicate which phase activates each table
3. **Soft deletes:** Use `deletedAt` timestamps, never hard delete user data
4. **Audit trails:** Track creation/update timestamps on all entities
5. **Multi-tenancy ready:** White-label fields exist from start
6. **Extensibility:** JSONB fields for flexible data

### 3.2 Complete Prisma Schema

```prisma
// =====================================================================
// EMOTIONAL MOMENTS PLATFORM - COMPLETE DATABASE SCHEMA
// =====================================================================
// This schema supports the full vision (Phase 1-4)
// Phase markers indicate when features are activated
// All tables are created from day one to avoid future migrations
// =====================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// =====================================================================
// AUTHENTICATION & USER MANAGEMENT (Phase 1)
// =====================================================================

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model User {
  id               String    @id @default(cuid())
  email            String    @unique
  emailVerified    DateTime?
  name             String?
  image            String? // Avatar URL
  
  // Subscription & Billing (Phase 1)
  subscriptionTier String    @default("free") // free | pro | business | enterprise
  stripeCustomerId String?   @unique
  
  // Enterprise Features (Phase 4)
  organizationId   String? // FK to Organization
  role             String    @default("user") // user | admin | owner
  
  // White-label (Phase 4)
  whiteLabelId     String? // FK to WhiteLabel
  
  // Preferences (Phase 2)
  preferences      Json      @default("{}") // UI preferences, notification settings
  
  // Timestamps
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  lastLoginAt      DateTime?
  deletedAt        DateTime? // Soft delete
  
  // Relations
  accounts         Account[]
  sessions         Session[]
  journeys         Journey[]
  subscriptions    UserSubscription[]
  templates        Template[] // User-created templates (Phase 3)
  apiKeys          ApiKey[] // For API access (Phase 4)
  organization     Organization? @relation(fields: [organizationId], references: [id])
  whiteLabel       WhiteLabel? @relation(fields: [whiteLabelId], references: [id])

  @@index([email])
  @@index([subscriptionTier])
  @@index([organizationId])
  @@index([whiteLabelId])
  @@map("users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// =====================================================================
// JOURNEY MANAGEMENT (Phase 1)
// =====================================================================

model Journey {
  id                String    @id @default(cuid())
  creatorId         String
  creator           User      @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  
  // Journey Configuration
  occasionType      String    // valentine | proposal | anniversary | apology | long_distance | custom
  recipientName     String
  creatorName       String?   // Optional sender name
  uniqueSlug        String    @unique // URL-safe slug (e.g., "emily-valentine-a8f3")
  
  // Status & Privacy
  status            String    @default("draft") // draft | scheduled | published | completed | archived
  visibility        String    @default("private") // private | unlisted | public (for marketplace)
  passwordProtected Boolean   @default(false)
  passwordHash      String?   // Bcrypt hash
  
  // Scheduling (Phase 2)
  scheduledDelivery DateTime?
  deliveryStatus    String?   // pending | sent | failed (for scheduled deliveries)
  
  // Expiration (Phase 2)
  expiresAt         DateTime?
  allowReplay       Boolean   @default(true) // Can recipient replay after completion?
  
  // Media Configuration
  musicEnabled      Boolean   @default(true)
  musicTrackId      String?   // Jamendo track ID
  musicMood         String?   // romantic | playful | nostalgic
  
  // Template Reference (Phase 1)
  templateId        String?
  template          Template? @relation(fields: [templateId], references: [id], onDelete: SetNull)
  
  // AI Generation Metadata (Phase 3)
  aiGenerated       Boolean   @default(false)
  aiPrompt          String?   @db.Text // Original user prompt for AI generation
  aiModel           String?   // gpt-4, etc.
  
  // White-label (Phase 4)
  whiteLabelId      String?
  whiteLabel        WhiteLabel? @relation(fields: [whiteLabelId], references: [id])
  brandingOverride  Json?     // Custom colors, logo, etc.
  
  // Engagement Metrics (computed from analytics)
  viewCount         Int       @default(0)
  completionCount   Int       @default(0)
  averageTimeSpent  Int?      // Seconds
  retryCount        Int       @default(0) // How many times NO was clicked
  
  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  publishedAt       DateTime?
  completedAt       DateTime? // When YES was clicked
  deletedAt         DateTime? // Soft delete
  
  // Relations
  questions         JourneyQuestion[]
  photos            JourneyPhoto[]
  analytics         JourneyAnalytics[]
  deliveries        JourneyDelivery[] // Omnichannel deliveries (Phase 4)

  @@index([creatorId])
  @@index([uniqueSlug])
  @@index([status])
  @@index([occasionType])
  @@index([scheduledDelivery])
  @@index([whiteLabelId])
  @@map("journeys")
}

model JourneyQuestion {
  id                  String   @id @default(cuid())
  journeyId           String
  journey             Journey  @relation(fields: [journeyId], references: [id], onDelete: Cascade)
  
  questionOrder       Int      // 1, 2, 3, 4...
  questionText        String   @db.Text
  
  // Options
  option1             String
  option2             String
  option3             String
  option4             String?  // Optional 4th option
  
  // Response
  acknowledgmentText  String   @db.Text // Shown after answer selected
  
  // Analytics (computed from journey_analytics)
  timesAnswered       Int      @default(0)
  averageTimeToAnswer Int?     // Seconds
  
  // AI Generation (Phase 3)
  aiGenerated         Boolean  @default(false)
  
  createdAt           DateTime @default(now())

  @@index([journeyId])
  @@index([questionOrder])
  @@map("journey_questions")
}

model JourneyPhoto {
  id          String   @id @default(cuid())
  journeyId   String
  journey     Journey  @relation(fields: [journeyId], references: [id], onDelete: Cascade)
  
  photoOrder  Int      // 1, 2, 3, 4...
  imageUrl    String   // Supabase Storage path
  caption     String
  
  // Image Metadata
  width       Int?
  height      Int?
  fileSize    Int?     // Bytes
  mimeType    String?  // image/jpeg, etc.
  
  // AI Generation (Phase 3)
  aiCaption   Boolean  @default(false) // Caption generated by AI
  
  // Engagement (computed from analytics)
  viewDuration Int?    // Average seconds spent viewing this photo
  
  createdAt   DateTime @default(now())

  @@index([journeyId])
  @@index([photoOrder])
  @@map("journey_photos")
}

// =====================================================================
// ANALYTICS & TELEMETRY (Phase 1)
// =====================================================================

model JourneyAnalytics {
  id          String   @id @default(cuid())
  journeyId   String
  journey     Journey  @relation(fields: [journeyId], references: [id], onDelete: Cascade)
  
  // Event Classification
  eventType   String   // viewed | question_answered | photo_viewed | no_clicked | yes_clicked | completed | music_played | music_skipped
  eventData   Json?    // Additional context (question_id, photo_id, duration, etc.)
  
  // Session Tracking
  sessionId   String   // Random UUID per recipient visit
  fingerprint String?  // Browser fingerprint (privacy-conscious)
  
  // Privacy-Conscious Metadata
  // NOTE: No IP addresses, no device IDs, no PII
  timezone    String?
  language    String?
  
  timestamp   DateTime @default(now())

  @@index([journeyId])
  @@index([sessionId])
  @@index([eventType])
  @@index([timestamp])
  @@map("journey_analytics")
}

// =====================================================================
// TEMPLATE SYSTEM (Phase 1-3)
// =====================================================================

model Template {
  id                String   @id @default(cuid())
  
  // Categorization
  occasionType      String   // valentine | proposal | anniversary | apology | custom
  name              String
  description       String   @db.Text
  thumbnailUrl      String?
  
  // Visibility & Access
  visibility        String   @default("private") // private | public | marketplace
  isPremium         Boolean  @default(false) // Requires pro subscription
  isOfficial        Boolean  @default(false) // Platform-created vs user-created
  
  // Creator (null for platform templates)
  creatorId         String?
  creator           User?    @relation(fields: [creatorId], references: [id], onDelete: SetNull)
  
  // Template Content (JSONB for flexibility)
  defaultQuestions  Json     // Array of question objects
  defaultCaptions   Json     // Array of caption strings
  copyConfig        Json     // All text snippets (welcome, transitions, outcomes)
  styleConfig       Json?    // Custom colors, fonts (Phase 3)
  
  // Marketplace (Phase 3)
  price             Decimal? @db.Decimal(10, 2) // Null for free templates
  commission        Decimal? @db.Decimal(5, 2) // Platform commission percentage
  
  // Engagement Metrics
  usageCount        Int      @default(0)
  rating            Decimal? @db.Decimal(3, 2) // 1.00 to 5.00
  reviewCount       Int      @default(0)
  
  // AI Generation (Phase 3)
  aiGenerated       Boolean  @default(false)
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  publishedAt       DateTime?
  deletedAt         DateTime? // Soft delete
  
  // Relations
  journeys          Journey[]
  reviews           TemplateReview[] // Phase 3

  @@index([occasionType])
  @@index([visibility])
  @@index([isPremium])
  @@index([isOfficial])
  @@index([creatorId])
  @@map("templates")
}

model TemplateReview {
  id         String   @id @default(cuid())
  templateId String
  template   Template @relation(fields: [templateId], references: [id], onDelete: Cascade)
  userId     String
  
  rating     Int      // 1-5 stars
  review     String?  @db.Text
  
  createdAt  DateTime @default(now())

  @@unique([templateId, userId]) // One review per user per template
  @@index([templateId])
  @@map("template_reviews")
}

// =====================================================================
// QUESTION BANK (Phase 1)
// =====================================================================
// Pre-written questions users can pick from during journey creation

model QuestionBank {
  id                  String   @id @default(cuid())
  
  // Categorization
  occasionType        String   // valentine | proposal | anniversary | etc.
  category            String?  // memories | future | feelings | playful
  
  // Question Content
  questionText        String   @db.Text
  option1             String
  option2             String
  option3             String
  option4             String?
  acknowledgmentText  String   @db.Text
  
  // Access Control
  isPremium           Boolean  @default(false) // AI-generated questions
  
  // Engagement Metrics
  usageCount          Int      @default(0)
  
  // AI Generation (Phase 3)
  aiGenerated         Boolean  @default(false)
  
  createdAt           DateTime @default(now())

  @@index([occasionType])
  @@index([category])
  @@index([isPremium])
  @@map("question_bank")
}

// =====================================================================
// SUBSCRIPTION & BILLING (Phase 2)
// =====================================================================

model SubscriptionPlan {
  id                String   @id @default(cuid())
  
  // Plan Details
  name              String   @unique // free | pro | business | enterprise
  displayName       String
  description       String   @db.Text
  
  // Pricing
  priceMonthly      Decimal  @db.Decimal(10, 2)
  priceYearly       Decimal? @db.Decimal(10, 2) // Annual discount
  
  // Limits
  journeysPerMonth  Int      // -1 for unlimited
  maxPhotos         Int      // Per journey
  maxStorageGB      Int      // Total storage
  
  // Features (JSONB array)
  features          Json     // ["password_protection", "scheduled_delivery", "ai_generation", etc.]
  
  // Stripe Integration
  stripePriceIdMonthly String? @unique
  stripePriceIdYearly  String? @unique
  
  // Status
  isActive          Boolean  @default(true)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  subscriptions     UserSubscription[]

  @@map("subscription_plans")
}

model UserSubscription {
  id                    String   @id @default(cuid())
  userId                String
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  planId                String
  plan                  SubscriptionPlan @relation(fields: [planId], references: [id])
  
  // Status
  status                String   // active | canceled | past_due | trialing | paused
  
  // Billing Period
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  cancelAtPeriodEnd     Boolean  @default(false)
  
  // Usage Tracking
  journeysThisPeriod    Int      @default(0)
  storageUsedGB         Decimal  @default(0) @db.Decimal(10, 4)
  
  // Stripe Integration
  stripeSubscriptionId  String?  @unique
  
  // Timestamps
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  canceledAt            DateTime?

  @@index([userId])
  @@index([planId])
  @@index([status])
  @@map("user_subscriptions")
}

// =====================================================================
// OMNICHANNEL DELIVERY (Phase 4)
// =====================================================================
// Tracks delivery across multiple channels: email, SMS, WhatsApp

model JourneyDelivery {
  id               String   @id @default(cuid())
  journeyId        String
  journey          Journey  @relation(fields: [journeyId], references: [id], onDelete: Cascade)
  
  // Channel Configuration
  channel          String   // web | email | sms | whatsapp
  recipientContact String   // Email or phone number
  
  // Delivery Status
  status           String   @default("pending") // pending | sent | delivered | failed | opened | completed
  
  // Message Content (channel-specific)
  messageTemplate  String?  // Template used for email/SMS
  messageContent   String?  @db.Text // Actual message sent
  
  // Delivery Metadata
  sentAt           DateTime?
  deliveredAt      DateTime?
  openedAt         DateTime?
  completedAt      DateTime? // When YES was clicked
  
  // Error Handling
  errorMessage     String?  @db.Text
  retryCount       Int      @default(0)
  
  // Provider Metadata
  providerMessageId String? // Twilio SID, WhatsApp message ID, etc.
  
  createdAt        DateTime @default(now())

  @@index([journeyId])
  @@index([channel])
  @@index([status])
  @@map("journey_deliveries")
}

// =====================================================================
// WHITE-LABEL B2B (Phase 4)
// =====================================================================
// Multi-tenant white-label deployment for businesses

model WhiteLabel {
  id                String   @id @default(cuid())
  
  // Organization Details
  organizationName  String
  organizationId    String   @unique // FK to Organization
  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  // Custom Domain
  customDomain      String?  @unique // e.g., love.jewelrystore.com
  domainVerified    Boolean  @default(false)
  
  // Branding Configuration (JSONB)
  branding          Json     // { logo, colors, fonts, emailTemplates, etc. }
  
  // Features
  allowTemplateMarketplace Boolean @default(true)
  allowAIFeatures          Boolean @default(true)
  
  // Billing
  subscriptionTier  String   // business | enterprise
  
  // Status
  isActive          Boolean  @default(true)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  users             User[]
  journeys          Journey[]

  @@index([organizationId])
  @@index([customDomain])
  @@map("white_labels")
}

// =====================================================================
// ORGANIZATIONS (Phase 4)
// =====================================================================
// Team/company accounts for enterprise users

model Organization {
  id                String   @id @default(cuid())
  
  // Organization Details
  name              String
  slug              String   @unique // URL-safe identifier
  
  // Billing
  stripeCustomerId  String?  @unique
  subscriptionTier  String   @default("business") // business | enterprise
  
  // Enterprise Features
  ssoEnabled        Boolean  @default(false)
  ssoProvider       String?  // google | microsoft | okta
  samlMetadataUrl   String?
  
  // Limits & Usage
  maxUsers          Int      @default(10)
  currentUserCount  Int      @default(0)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  users             User[]
  whiteLabels       WhiteLabel[]
  apiKeys           ApiKey[]

  @@index([slug])
  @@map("organizations")
}

// =====================================================================
// API ACCESS (Phase 4)
// =====================================================================
// API keys for programmatic access to platform

model ApiKey {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  // Key Details
  name           String   // User-defined name for the key
  key            String   @unique // API key (hashed)
  keyPrefix      String   // First 8 chars for identification
  
  // Permissions
  scopes         Json     // Array of permission scopes
  
  // Rate Limiting
  rateLimit      Int      @default(1000) // Requests per hour
  
  // Status
  isActive       Boolean  @default(true)
  
  // Usage Tracking
  lastUsedAt     DateTime?
  totalRequests  Int      @default(0)
  
  createdAt      DateTime @default(now())
  expiresAt      DateTime?

  @@index([userId])
  @@index([organizationId])
  @@index([key])
  @@map("api_keys")
}

// =====================================================================
// SYSTEM ADMINISTRATION (Phase 3-4)
// =====================================================================

model AuditLog {
  id          String   @id @default(cuid())
  
  // Actor
  userId      String?
  userEmail   String?
  
  // Action
  action      String   // user.created, journey.published, template.approved, etc.
  resourceType String  // user | journey | template | organization
  resourceId  String
  
  // Changes (JSONB)
  changes     Json?    // Before/after values
  
  // Context
  ipAddress   String?  // For security audits only
  userAgent   String?
  
  timestamp   DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([resourceType, resourceId])
  @@index([timestamp])
  @@map("audit_logs")
}

model FeatureFlag {
  id          String   @id @default(cuid())
  
  // Flag Details
  key         String   @unique // ai_generation_enabled, template_marketplace_live
  name        String
  description String   @db.Text
  
  // Status
  isEnabled   Boolean  @default(false)
  
  // Rollout Strategy
  rolloutPercent Int    @default(0) // 0-100, for gradual rollout
  
  // Targeting (JSONB)
  targeting   Json?    // { users: [], organizations: [], tiers: [] }
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([key])
  @@map("feature_flags")
}
```

### 3.3 Database Indexes Strategy

**Primary Indexes (Phase 1):**
- All foreign keys
- Unique slugs for journeys
- Email lookups
- Session tokens

**Performance Indexes (Phase 2):**
- Composite indexes for common queries
- Analytics aggregation indexes
- Scheduled delivery lookups

**Search Indexes (Phase 3):**
- Full-text search on templates
- Question bank search
- User search for admin panel

**Enterprise Indexes (Phase 4):**
- Organization-scoped queries
- White-label domain lookups
- API key validation

---

## 4. Authentication & Authorization

### 4.1 Authentication Architecture

**Provider:** NextAuth.js v5 (Auth.js)

**Supported Auth Methods:**

**Phase 1:**
- Email + Password (with email verification via Resend)
- Google OAuth

**Phase 2:**
- GitHub OAuth
- Facebook OAuth
- Apple Sign In

**Phase 4 (Enterprise):**
- SSO via SAML 2.0
- Microsoft Azure AD
- Okta
- Custom OIDC providers

**Session Management:**
- **Strategy:** Database sessions (via Prisma adapter)
- **Session Duration:** 30 days
- **Refresh:** Automatic on activity
- **Security:** httpOnly cookies, CSRF protection

### 4.2 Authorization Model

**Role-Based Access Control (RBAC):**

```
User Roles:
├── Free User
│   ├── Create 1 journey/month
│   ├── Max 6 photos per journey
│   └── Basic templates only
│
├── Pro User
│   ├── Unlimited journeys
│   ├── Max 20 photos per journey
│   ├── All templates
│   ├── AI features
│   └── Password protection
│
├── Business User
│   ├── Everything in Pro
│   ├── White-label branding
│   ├── Team accounts
│   └── Priority support
│
├── Enterprise User (Phase 4)
│   ├── Everything in Business
│   ├── Custom domain
│   ├── API access
│   ├── SSO
│   └── Dedicated support
│
└── Platform Admin (Internal)
    ├── User management
    ├── Content moderation
    ├── Analytics access
    ├── Feature flags
    └── System configuration
```

**Permission Matrix:**

| Feature | Free | Pro | Business | Enterprise |
|---------|------|-----|----------|------------|
| Journeys/month | 1 | Unlimited | Unlimited | Unlimited |
| Photos per journey | 6 | 20 | 50 | Unlimited |
| Password protection | ❌ | ✅ | ✅ | ✅ |
| Scheduled delivery | ❌ | ✅ | ✅ | ✅ |
| AI generation | ❌ | ✅ | ✅ | ✅ |
| Custom branding | ❌ | ❌ | ✅ | ✅ |
| Custom domain | ❌ | ❌ | ❌ | ✅ |
| API access | ❌ | ❌ | ❌ | ✅ |
| SSO | ❌ | ❌ | ❌ | ✅ |
| Team accounts | ❌ | ❌ | ✅ | ✅ |

### 4.3 Email Verification Flow

```
User Registration
    ↓
NextAuth creates user (emailVerified = null)
    ↓
Resend sends verification email
    ↓
User clicks verification link
    ↓
NextAuth validates token
    ↓
emailVerified = current timestamp
    ↓
User can now create journeys
```

**Email Template:**
- Subject: "Verify your email - Emotional Moments"
- From: noreply@nerva.studio
- Contains: Magic link with expiring token (24 hour TTL)

### 4.4 Password Reset Flow

```
User clicks "Forgot Password"
    ↓
Enters email
    ↓
Resend sends reset link
    ↓
User clicks link
    ↓
NextAuth validates token
    ↓
User sets new password
    ↓
All sessions invalidated
```

---

## 5. API Architecture

### 5.1 API Design Principles

1. **RESTful conventions** with pragmatic extensions
2. **Versioned** (`/api/v1/`) to support future changes
3. **Type-safe** contracts using Zod schemas
4. **Consistent error handling** across all endpoints
5. **Rate limited** per user/IP
6. **Documented** via OpenAPI 3.0 (Phase 4)

### 5.2 API Structure

```
/api/v1/
├── auth/
│   ├── [...nextauth]     (NextAuth.js handler)
│   ├── verify-email      (Email verification)
│   └── resend-verification
│
├── journeys/
│   ├── GET    /           (List user's journeys)
│   ├── POST   /           (Create journey)
│   ├── GET    /:id        (Get journey details)
│   ├── PATCH  /:id        (Update journey)
│   ├── DELETE /:id        (Delete journey)
│   ├── POST   /:id/publish (Publish journey)
│   ├── POST   /:id/duplicate (Copy journey)
│   └── GET    /:id/analytics (Get analytics)
│
├── questions/
│   ├── GET    /bank       (Get question suggestions)
│   ├── POST   /journey/:id (Add/update questions)
│   └── DELETE /:id        (Remove question)
│
├── photos/
│   ├── POST   /upload     (Upload photo to storage)
│   ├── POST   /journey/:id (Attach photo to journey)
│   ├── PATCH  /:id        (Update caption)
│   └── DELETE /:id        (Remove photo)
│
├── templates/
│   ├── GET    /           (List templates)
│   ├── GET    /:id        (Get template details)
│   ├── POST   /           (Create template) [Phase 3]
│   └── POST   /:id/use    (Create journey from template)
│
├── public/
│   ├── GET /j/:slug       (Get journey data - no auth)
│   ├── POST /j/:slug/verify (Verify password)
│   ├── POST /j/:slug/event (Log analytics event)
│   └── POST /j/:slug/complete (Mark completed)
│
├── user/
│   ├── GET    /profile    (Get user profile)
│   ├── PATCH  /profile    (Update profile)
│   ├── GET    /usage      (Get usage stats)
│   └── DELETE /account    (Delete account)
│
├── billing/ [Phase 2]
│   ├── POST   /create-checkout-session
│   ├── POST   /create-portal-session
│   ├── POST   /webhook    (Stripe webhook handler)
│   └── GET    /invoices
│
├── ai/ [Phase 3]
│   ├── POST   /generate-questions
│   ├── POST   /optimize-copy
│   └── POST   /suggest-captions
│
├── marketplace/ [Phase 3]
│   ├── GET    /templates  (Browse marketplace)
│   ├── POST   /submit     (Submit template)
│   ├── POST   /:id/purchase
│   └── POST   /:id/review
│
├── admin/ [Phase 3]
│   ├── GET    /users
│   ├── GET    /journeys
│   ├── POST   /moderate-template
│   ├── GET    /analytics
│   └── POST   /feature-flags
│
└── integrations/ [Phase 4]
    ├── POST   /whatsapp/send
    ├── POST   /sms/send
    └── GET    /nerva-voice/tts
```

### 5.3 API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* payload */ },
  "meta": {
    "timestamp": "2026-02-02T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": { /* additional context */ }
  },
  "meta": {
    "timestamp": "2026-02-02T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

**Error Codes:**
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (422): Invalid input data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

### 5.4 Rate Limiting Strategy

**Per-Tier Limits:**

| Tier | Requests/Hour | Burst |
|------|---------------|-------|
| Free | 60 | 10 |
| Pro | 600 | 50 |
| Business | 3000 | 100 |
| Enterprise | 10000 | 500 |

**Critical Endpoints (Stricter Limits):**
- `/api/v1/ai/*` → 10/hour (free), 100/hour (pro)
- `/api/v1/photos/upload` → 20/hour (all tiers)
- `/api/v1/auth/verify-email` → 3/hour

**Implementation:** Vercel Edge Middleware + Redis (Phase 2) or in-memory (Phase 1)

---

## 6. File Storage Architecture

### 6.1 Storage Provider

**Service:** Supabase Storage (S3-compatible)

**Buckets:**

```
supabase-storage/
├── journey-photos/          (User-uploaded memories)
│   ├── {userId}/
│   │   ├── {journeyId}/
│   │   │   ├── original/    (Original uploads)
│   │   │   └── optimized/   (Processed images)
│
├── user-avatars/            (Profile pictures)
│   └── {userId}/
│
├── template-thumbnails/     (Template preview images)
│   └── {templateId}/
│
└── white-label-assets/      (Custom branding) [Phase 4]
    └── {whiteLabelId}/
        ├── logo.png
        └── email-header.png
```

### 6.2 Upload Flow

```
User selects photo in journey builder
    ↓
Frontend validates:
    - File type (JPEG, PNG, WebP only)
    - File size (<5MB)
    - Dimensions (min 800x800px)
    ↓
POST /api/v1/photos/upload
    ↓
Server:
    1. Authenticates user
    2. Checks storage quota
    3. Generates unique filename
    4. Uploads original to Supabase Storage
    5. Processes image (resize, optimize)
    6. Uploads optimized version
    7. Creates JourneyPhoto record in database
    ↓
Returns:
    {
      imageUrl: "journey-photos/{userId}/{journeyId}/optimized/abc123.webp",
      width: 1200,
      height: 1200,
      fileSize: 234567
    }
```

### 6.3 Image Optimization

**Processing Pipeline (using Sharp):**

1. **Resize:** Max 1200x1200px (maintain aspect ratio)
2. **Format:** Convert to WebP (better compression)
3. **Quality:** 85% (balance between quality and size)
4. **Strip metadata:** Remove EXIF data (privacy)
5. **Generate thumbnail:** 400x400px for dashboard/gallery

**Delivery:**
- Serve via Supabase CDN (Cloudflare-backed)
- Lazy loading on recipient experience
- Progressive image loading (blur-up effect)

### 6.4 Storage Quotas

| Tier | Storage Limit | Photo Uploads/Month |
|------|---------------|---------------------|
| Free | 100 MB | 6 photos/journey × 1 journey = 6 |
| Pro | 5 GB | 20 photos/journey × unlimited |
| Business | 50 GB | 50 photos/journey × unlimited |
| Enterprise | Unlimited | Unlimited |

**Quota Enforcement:**
- Check before upload via `UserSubscription.storageUsedGB`
- Background job recalculates usage nightly
- User notified at 80% and 100% capacity

### 6.5 Access Control

**Public Bucket (`journey-photos`):**
- Published journeys: Public read access
- Draft journeys: Signed URLs with 1-hour expiration

**Private Buckets:**
- User avatars: Public read
- White-label assets: Public read (per custom domain)
- Template thumbnails: Public read

**Supabase RLS Policies:**
```sql
-- Example: Only creator or published status can access photos
CREATE POLICY "Journey photos access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'journey-photos'
  AND (
    auth.uid() = (storage.foldername(name))[1]::uuid  -- Creator
    OR EXISTS (
      SELECT 1 FROM journeys
      WHERE id = (storage.foldername(name))[2]::uuid
      AND status = 'published'
    )
  )
);
```

---

## 7. Email & Communication Architecture

### 7.1 Email Service Provider

**Service:** Resend (existing Nerva account)

**Configuration:**
- **Sending Domain:** noreply@nerva.studio (Phase 1) → noreply@emotionalmoments.app (Phase 2)
- **API Key:** Stored in `RESEND_API_KEY` environment variable
- **Rate Limit:** 100 emails/hour (Resend free tier) → 10,000/hour (paid)

### 7.2 Email Templates

**Template System:** React Email (type-safe email templates)

**Templates to Build:**

**Phase 1:**
1. **Email Verification**
   - Subject: "Verify your email - Emotional Moments"
   - Trigger: User signup
   - Contains: Magic link (24h TTL)

2. **Password Reset**
   - Subject: "Reset your password"
   - Trigger: User requests reset
   - Contains: Magic link (1h TTL)

3. **Welcome Email**
   - Subject: "Welcome to Emotional Moments 💕"
   - Trigger: After email verification
   - Contains: Quick start guide

**Phase 2:**
4. **Journey Published**
   - Subject: "Your journey is live!"
   - Trigger: User publishes journey
   - Contains: Sharing link + QR code

5. **Journey Opened**
   - Subject: "{recipientName} opened your journey 👀"
   - Trigger: Recipient views journey
   - Contains: Link to analytics

6. **They Said YES!**
   - Subject: "🎉 They said YES!"
   - Trigger: Recipient clicks YES
   - Contains: Celebration message + journey replay link

7. **Scheduled Delivery**
   - Subject: "{creatorName} has something special for you 💕"
   - Trigger: Scheduled delivery time
   - Contains: Journey link for recipient

**Phase 3:**
8. **Template Approved** (Marketplace)
   - Subject: "Your template is now live in the marketplace"
   - Trigger: Admin approves user-submitted template

9. **Subscription Expiring**
   - Subject: "Your Pro subscription expires in 3 days"
   - Trigger: 3 days before subscription end

**Phase 4:**
10. **White-Label Welcome** (Custom branded)
    - Subject configurable by white-label customer
    - Custom logo, colors, copy

### 7.3 Email Sending Flow

```
Trigger event (e.g., journey opened)
    ↓
EmailService.send({
  to: user.email,
  template: "journeyOpened",
  data: { recipientName, journeyUrl }
})
    ↓
Render React Email template with data
    ↓
Resend API call
    ↓
Log to database (for debugging/analytics)
    ↓
Handle delivery status via webhook (Phase 2)
```

### 7.4 Email Deliverability

**Best Practices:**
- SPF, DKIM, DMARC records configured for sending domain
- Unsubscribe link in all marketing emails (GDPR compliance)
- Bounce handling via Resend webhooks
- Email engagement tracking (opens, clicks) - opt-in only

**Transactional vs. Marketing:**
- Transactional: Verification, reset, journey notifications (always sent)
- Marketing: Product updates, tips (user can opt out)

### 7.5 Scheduled Delivery System (Phase 2)

**Architecture:**

```
Scheduled Journeys Table
    ↓
Cron job runs every 5 minutes (Vercel Cron or Supabase Edge Functions)
    ↓
Query journeys WHERE scheduledDelivery <= NOW() AND deliveryStatus = 'pending'
    ↓
For each journey:
    1. Send email via Resend
    2. Update deliveryStatus = 'sent'
    3. Create JourneyDelivery record
    ↓
Recipient clicks link in email
    ↓
Standard recipient experience flow
```

**Edge Cases:**
- User timezone handling (store timezone with scheduled delivery)
- Retry failed deliveries (exponential backoff: 5min, 15min, 1hr)
- Cancel scheduled delivery if journey is deleted

---

## 8. Frontend Architecture

### 8.1 Application Structure

```
app/
├── (marketing)/              # Marketing site (no auth required)
│   ├── page.tsx              # Homepage
│   ├── features/             # Feature pages
│   ├── pricing/              # Pricing page
│   ├── about/                # About page
│   └── layout.tsx            # Marketing layout
│
├── (auth)/                   # Authentication pages
│   ├── login/
│   ├── signup/
│   ├── verify-email/
│   └── reset-password/
│
├── (dashboard)/              # Authenticated user area
│   ├── dashboard/            # User dashboard
│   ├── create/               # Journey builder (multi-step)
│   ├── journeys/
│   │   ├── [id]/
│   │   │   ├── edit/         # Edit journey
│   │   │   ├── analytics/    # Journey analytics
│   │   │   └── preview/      # Preview before publish
│   ├── templates/            # Template browser
│   ├── settings/             # User settings
│   ├── billing/              # Subscription management [Phase 2]
│   └── layout.tsx            # Dashboard layout (sidebar, nav)
│
├── j/                        # Public journey recipient experience
│   └── [slug]/
│       ├── page.tsx          # Main recipient experience
│       └── password/         # Password entry (if protected)
│
├── admin/                    # Platform admin [Phase 3]
│   ├── users/
│   ├── journeys/
│   ├── templates/
│   └── analytics/
│
├── api/                      # API routes (see API Architecture section)
│   └── v1/
│
└── layout.tsx                # Root layout (global styles, providers)
```

### 8.2 Component Architecture

**Design System:** shadcn/ui + custom components

**Component Structure:**
```
components/
├── ui/                       # shadcn/ui base components
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
│
├── journey/                  # Journey-specific components
│   ├── QuestionCard.tsx
│   ├── PhotoReveal.tsx
│   ├── MemoryGallery.tsx
│   ├── BigQuestion.tsx
│   └── Celebration.tsx
│
├── builder/                  # Journey builder components
│   ├── StepIndicator.tsx
│   ├── OccasionSelector.tsx
│   ├── QuestionEditor.tsx
│   ├── PhotoUploader.tsx
│   └── PreviewModal.tsx
│
├── dashboard/                # Dashboard components
│   ├── JourneyCard.tsx
│   ├── StatsCard.tsx
│   ├── UsageChart.tsx
│   └── QuickActions.tsx
│
├── templates/                # Template components
│   ├── TemplateCard.tsx
│   ├── TemplatePreview.tsx
│   └── TemplateFilters.tsx
│
└── shared/                   # Shared components
    ├── Header.tsx
    ├── Footer.tsx
    ├── Sidebar.tsx
    ├── Loading.tsx
    └── ErrorBoundary.tsx
```

### 8.3 State Management Strategy

**Global State (Zustand):**
- User session/auth state
- Journey builder state (multi-step form)
- UI state (sidebar open/closed, modals)

**Server State (React Query / TanStack Query):**
- API data fetching
- Caching strategies
- Optimistic updates

**Form State (React Hook Form):**
- Journey builder forms
- Settings forms
- Template creation

**Example Store:**
```typescript
// stores/journeyBuilder.ts
interface JourneyBuilderStore {
  // State
  currentStep: number
  journeyData: Partial<Journey>
  isDirty: boolean
  
  // Actions
  setStep: (step: number) => void
  updateJourneyData: (data: Partial<Journey>) => void
  saveProgress: () => Promise<void>
  resetBuilder: () => void
}
```

### 8.4 Routing & Navigation

**Route Structure:**
- Marketing: `/`, `/features`, `/pricing`, `/about`
- Auth: `/login`, `/signup`, `/verify-email`, `/reset-password`
- Dashboard: `/dashboard`, `/create`, `/journeys/[id]`, `/templates`
- Public: `/j/[slug]` (recipient experience)
- Admin: `/admin/*` (protected by role check)

**Navigation Guards:**
- Protected routes require authentication (middleware)
- Admin routes require `role === 'admin'`
- Public journey routes accessible to everyone

**Middleware (middleware.ts):**
```typescript
export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request })
  const pathname = request.nextUrl.pathname
  
  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Protect admin routes
  if (pathname.startsWith('/admin') && session?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}
```

### 8.5 Progressive Web App (PWA)

**Phase 2 Feature:**
- Service worker for offline access
- Add to home screen prompt
- Push notifications (journey opened, YES clicked)

**Implementation:**
- `next-pwa` plugin
- Manifest.json configuration
- Icon assets (all sizes)

---

## 9. AI Integration Architecture

### 9.1 AI Service Provider

**Provider:** OpenAI API

**Models:**
- **GPT-4 Turbo:** Question generation, template creation
- **GPT-3.5 Turbo:** Copy optimization, caption suggestions (cheaper, faster)

**Cost Management:**
- Rate limiting per user/tier
- Caching common patterns
- Token usage tracking

### 9.2 AI Features

**Phase 3 Features:**

#### 9.2.1 AI Question Generator

**Use Case:** Generate personalized questions based on relationship context

**Input:**
```typescript
interface AIQuestionRequest {
  occasionType: string        // "valentine", "proposal", etc.
  relationshipContext: string // Free-text description
  tone: "romantic" | "playful" | "heartfelt"
  count: number               // 4-6 questions
}
```

**Output:**
```typescript
interface AIQuestionResponse {
  questions: {
    questionText: string
    options: [string, string, string, string?]
    acknowledgmentText: string
  }[]
  tokensUsed: number
}
```

**Prompt Structure:**
```
System: You are an expert at crafting emotionally meaningful relationship questions...

User: Generate 4 questions for a Valentine's journey.
Relationship context: We met in college in 2019, both love hiking, she's a teacher.
Tone: Romantic
Format: Return JSON with structure {...}