# Peekaboo Analytics Implementation Guide

**Last Updated**: March 14, 2026
**Prepared by**: Growth Agent (Paperclip)

---

## Overview

This guide outlines the analytics strategy for Peekaboo, covering key metrics, event tracking, and recommended tools. Proper analytics enable data-driven decisions for growth, retention, and product development.

---

## Recommended Analytics Stack

### Primary: Product Analytics

| Tool | Cost | Best For |
|------|------|----------|
| **Mixpanel** | Free up to 20M events/mo | Event tracking, funnels, retention |
| **Amplitude** | Free up to 10M events/mo | Behavioral analytics, cohorts |
| **PostHog** | Free self-host or 1M events/mo | Open-source, privacy-focused |

**Recommendation**: Start with **PostHog** (free tier) for privacy alignment with Peekaboo's brand, or **Mixpanel** for more polished dashboards.

### Secondary: Web Analytics

| Tool | Cost | Best For |
|------|------|----------|
| **Plausible** | $9/mo | Privacy-first, simple |
| **Fathom** | $14/mo | GDPR-compliant, clean UI |
| **Google Analytics 4** | Free | Full-featured, complex |

**Recommendation**: **Plausible** aligns with Peekaboo's privacy-first positioning.

### App Store Analytics

| Platform | Tool | Notes |
|----------|------|-------|
| iOS | App Store Connect | Built-in downloads, ratings |
| Android | Google Play Console | Built-in installs, ratings |
| Both | **AppFollow** or **Sensor Tower** | Reviews monitoring, ASO |

---

## Core Metrics Framework

### North Star Metric

**Photos Viewed by Parents per Week**

This metric captures:
- Teacher engagement (they upload photos)
- Parent engagement (they view photos)
- Value delivery (connection to child's day)

### Supporting Metrics

| Category | Metric | Target |
|----------|--------|--------|
| **Acquisition** | New schools/week | 2-3 |
| **Acquisition** | New parents/week | 50-100 |
| **Activation** | Parent views first photo | 80% Day 1 |
| **Activation** | Teacher uploads first photo | 70% Day 1 |
| **Engagement** | Photos uploaded per teacher/week | 10+ |
| **Engagement** | Photos viewed per parent/week | 8+ |
| **Retention** | Day 1 parent retention | 60% |
| **Retention** | Day 7 parent retention | 40% |
| **Retention** | Day 30 parent retention | 25% |
| **Revenue** | Free → Paid conversion | 10% |
| **Revenue** | Monthly Recurring Revenue (MRR) | $1,500 (M12) |

---

## Event Tracking Specification

### User Identity

Track users with these identifiers:

```javascript
// Parent identification
analytics.identify(userId, {
  email: 'parent@example.com',
  role: 'parent',
  schoolId: 'school_123',
  childrenCount: 2,
  createdAt: '2026-03-14T10:00:00Z'
});

// Teacher identification
analytics.identify(userId, {
  email: 'teacher@school.com',
  role: 'teacher',
  schoolId: 'school_123',
  classroomId: 'classroom_456',
  createdAt: '2026-03-14T10:00:00Z'
});

// Admin identification
analytics.identify(userId, {
  email: 'admin@school.com',
  role: 'admin',
  schoolId: 'school_123',
  schoolPlan: 'free',
  createdAt: '2026-03-14T10:00:00Z'
});
```

### Core Events

#### Authentication Events

| Event Name | Properties | Trigger |
|------------|------------|---------|
| `magic_link_requested` | `{ email, role }` | User requests magic link |
| `magic_link_clicked` | `{ email, role, linkAge }` | User clicks magic link |
| `signed_in` | `{ method: 'magic_link', role }` | Successful sign-in |
| `signed_out` | `{ role }` | User signs out |

#### Photo Events

| Event Name | Properties | Trigger |
|------------|------------|---------|
| `photo_uploaded` | `{ count, classroomId, childrenTagged }` | Teacher uploads photos |
| `photo_viewed` | `{ photoId, childId, viewDuration }` | Parent views a photo |
| `photo_downloaded` | `{ photoId, childId }` | Parent downloads a photo |
| `photo_tagged` | `{ photoId, childrenCount }` | Teacher tags children |

#### School/Classroom Events

| Event Name | Properties | Trigger |
|------------|------------|---------|
| `school_created` | `{ schoolName, plan }` | New school signs up |
| `classroom_created` | `{ classroomName, schoolId }` | Classroom added |
| `teacher_invited` | `{ schoolId, classroomId }` | Teacher invited |
| `parent_invited` | `{ schoolId, childId }` | Parent invited |
| `child_added` | `{ schoolId, classroomId }` | Child added to roster |

#### Engagement Events

| Event Name | Properties | Trigger |
|------------|------------|---------|
| `timeline_viewed` | `{ photoCount, scrollDepth }` | Parent views timeline |
| `notification_received` | `{ type, platform }` | Push/email delivered |
| `notification_clicked` | `{ type, platform }` | User clicks notification |
| `app_opened` | `{ source, role }` | App is opened |
| `app_backgrounded` | `{ sessionDuration }` | App goes to background |

#### Conversion Events

| Event Name | Properties | Trigger |
|------------|------------|---------|
| `plan_viewed` | `{ currentPlan, viewedPlan }` | User views pricing |
| `plan_upgraded` | `{ fromPlan, toPlan, mrr }` | School upgrades |
| `plan_downgraded` | `{ fromPlan, toPlan }` | School downgrades |
| `trial_started` | `{ plan }` | Trial begins |
| `trial_converted` | `{ plan }` | Trial converts to paid |

#### Error Events

| Event Name | Properties | Trigger |
|------------|------------|---------|
| `upload_failed` | `{ reason, fileCount, fileSize }` | Photo upload fails |
| `sign_in_failed` | `{ reason, email }` | Sign-in fails |
| `permission_denied` | `{ resource, action }` | Access denied |

---

## Implementation Examples

### React/TypeScript Implementation

```typescript
// analytics.ts
import mixpanel from 'mixpanel-browser';

// Initialize
mixpanel.init('YOUR_MIXPANEL_TOKEN', {
  debug: process.env.NODE_ENV === 'development',
  track_pageview: true,
  persistence: 'localStorage'
});

// Track event helper
export function track(event: string, properties?: Record<string, any>) {
  mixpanel.track(event, {
    ...properties,
    timestamp: new Date().toISOString(),
    platform: 'web' // or 'ios', 'android'
  });
}

// Identify user
export function identify(userId: string, traits: Record<string, any>) {
  mixpanel.identify(userId);
  mixpanel.people.set(traits);
}

// Reset on logout
export function reset() {
  mixpanel.reset();
}
```

### Usage in Components

```typescript
// PhotoUpload.tsx
import { track } from '@/lib/analytics';

async function handleUpload(files: File[]) {
  try {
    const result = await uploadPhotos(files);

    track('photo_uploaded', {
      count: files.length,
      classroomId: currentClassroom.id,
      childrenTagged: taggedChildren.length,
      totalSizeKb: files.reduce((sum, f) => sum + f.size, 0) / 1024
    });
  } catch (error) {
    track('upload_failed', {
      reason: error.message,
      fileCount: files.length
    });
  }
}

// PhotoView.tsx
import { track } from '@/lib/analytics';
import { useEffect, useRef } from 'react';

function PhotoView({ photo, child }) {
  const viewStart = useRef(Date.now());

  useEffect(() => {
    // Track view duration on unmount
    return () => {
      const duration = Date.now() - viewStart.current;
      track('photo_viewed', {
        photoId: photo.id,
        childId: child.id,
        viewDuration: duration
      });
    };
  }, [photo.id]);

  // ... render
}
```

---

## Funnels to Track

### 1. Parent Activation Funnel

```
School invites parent
    ↓
Parent receives invitation email
    ↓
Parent clicks magic link
    ↓
Parent signs in successfully
    ↓
Parent views first photo
    ↓
Parent downloads first photo
```

**Target conversion**: 70% invitation → first photo viewed

### 2. Teacher Activation Funnel

```
Admin invites teacher
    ↓
Teacher receives invitation
    ↓
Teacher signs in
    ↓
Teacher uploads first photo
    ↓
Teacher tags children
    ↓
Parents receive notifications
```

**Target conversion**: 80% invitation → first photo uploaded

### 3. School Conversion Funnel

```
School discovers Peekaboo (landing page)
    ↓
School starts signup
    ↓
School completes signup (free tier)
    ↓
School invites first teacher
    ↓
First photo uploaded
    ↓
10+ photos uploaded
    ↓
School upgrades to paid tier
```

**Target conversion**: 10% free → paid within 60 days

---

## Dashboards to Build

### 1. Executive Dashboard

| Metric | Visualization |
|--------|---------------|
| Total schools | Number + trend |
| Total active users | Number + trend |
| Photos shared (7-day) | Line chart |
| MRR | Number + trend |
| Free → Paid conversion | Percentage |

### 2. Engagement Dashboard

| Metric | Visualization |
|--------|---------------|
| Daily Active Users (DAU) | Line chart |
| Photos uploaded/day | Line chart |
| Photos viewed/day | Line chart |
| Avg photos per teacher | Number |
| Avg photos viewed per parent | Number |

### 3. Retention Dashboard

| Metric | Visualization |
|--------|---------------|
| Day 1 retention | Percentage |
| Day 7 retention | Percentage |
| Day 30 retention | Percentage |
| Retention by cohort | Retention chart |
| Churn rate | Percentage |

### 4. Acquisition Dashboard

| Metric | Visualization |
|--------|---------------|
| New signups/week | Line chart |
| Source attribution | Pie chart |
| Cost per acquisition | Number |
| App store downloads | Line chart |
| App store ratings | Number + trend |

---

## Cohort Definitions

### User Cohorts

| Cohort | Definition |
|--------|------------|
| **New Users** | Signed up in last 7 days |
| **Active Users** | Logged in within last 7 days |
| **Power Users** | 20+ photos viewed in last 7 days |
| **Churned Users** | No login in 30+ days |
| **At-Risk Users** | No login in 14-30 days |

### School Cohorts

| Cohort | Definition |
|--------|------------|
| **New Schools** | Created in last 30 days |
| **Activated Schools** | 10+ photos uploaded |
| **High-Engagement Schools** | 50+ photos/week |
| **Churning Schools** | No uploads in 14+ days |
| **Paid Schools** | On Starter/Growth/Enterprise tier |

---

## Privacy Considerations

Peekaboo's privacy-first positioning means analytics must also respect privacy:

### Do Track

- Aggregate metrics (counts, averages)
- Event names and timing
- User roles and school associations
- Feature usage patterns

### Don't Track

- Photo contents or thumbnails
- Child names or identifiers in events
- Location data
- Device identifiers beyond session
- Personal messages or captions

### Implementation

```typescript
// Good: Anonymous, aggregate
track('photo_uploaded', {
  count: 3,
  classroomId: 'classroom_123'  // Not child-identifying
});

// Bad: Too much personal info
track('photo_uploaded', {
  childNames: ['Emma', 'Liam'],  // Don't do this
  photoUrls: [...]              // Don't do this
});
```

### Data Retention

- Event data: 12 months
- User profiles: Account lifetime
- Delete on account deletion: Yes (GDPR/CCPA compliant)

---

## A/B Testing Strategy

### Recommended Tool

**PostHog** or **Optimizely** (free tier)

### Initial A/B Tests

| Test | Variants | Success Metric |
|------|----------|----------------|
| Onboarding flow | 3-step vs 5-step | Activation rate |
| Photo notification frequency | Immediate vs batched | Click rate, unsubscribe rate |
| Magic link expiration | 1 hour vs 24 hours | Sign-in completion |
| CTA button color | Violet vs Green | Click-through rate |

### Testing Process

1. Define hypothesis
2. Set sample size (minimum 100 per variant)
3. Run for statistical significance
4. Document results
5. Implement winner

---

## Immediate Implementation Steps

### Week 1
- [ ] Choose analytics platform (recommend PostHog)
- [ ] Create account and get SDK token
- [ ] Install SDK in web app
- [ ] Implement user identification

### Week 2
- [ ] Implement core authentication events
- [ ] Implement photo upload/view events
- [ ] Test event flow in development

### Week 3
- [ ] Deploy to production
- [ ] Set up first dashboard (Executive)
- [ ] Configure daily/weekly email reports

### Week 4
- [ ] Implement remaining events
- [ ] Set up funnels
- [ ] Create cohort definitions
- [ ] Build engagement dashboard

---

## Reporting Cadence

| Report | Frequency | Audience |
|--------|-----------|----------|
| Daily Pulse | Daily | Founder/team |
| Weekly Metrics | Weekly | Founder/team |
| Monthly Review | Monthly | Stakeholders |
| Quarterly Deep Dive | Quarterly | All hands |

### Daily Pulse (automated email)

- DAU count
- Photos shared today
- New signups
- Any errors/issues

### Weekly Metrics

- All core metrics
- Week-over-week changes
- Notable events/anomalies
- Top performing schools

---

*Document prepared by Growth Agent. For questions, contact the project owner.*
