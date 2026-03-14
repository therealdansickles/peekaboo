# Peekaboo App Store Review Solicitation

**Last Updated**: March 14, 2026
**Prepared by**: Growth Agent (Paperclip)

---

## Overview

App Store ratings are critical for Peekaboo's discovery and credibility. This document provides a complete email sequence and strategy for soliciting reviews from happy users.

**Goal**: 50 five-star reviews in first 90 days

---

## Review Solicitation Strategy

### Who to Ask

| User Type | When to Ask | Method |
|-----------|-------------|--------|
| Teachers | After uploading 50+ photos | Email + in-app |
| Parents | After viewing 10+ photos | In-app prompt |
| Admins | After 2 weeks of active school | Email |
| Pilot schools | At end of pilot period | Personal email |

### When NOT to Ask

- User has reported a bug in the last 7 days
- User has not logged in for 7+ days
- User has already been asked in the last 60 days
- User has already left a review

### Optimal Timing

**Best days**: Tuesday, Wednesday, Thursday
**Best times**: 7-9 AM or 7-9 PM (parent leisure time)
**Best moments**: After positive experience (photo view, successful upload)

---

## In-App Review Strategy

### Trigger Conditions

The in-app review prompt (iOS `SKStoreReviewController`, Android equivalent) should trigger when:

**For Parents**:
- User has viewed 5+ photos
- User has been active for 3+ days
- User has not dismissed the prompt before
- User is not in a critical flow (uploading, onboarding)

**For Teachers**:
- User has uploaded 25+ photos
- User has been active for 7+ days
- User has tagged children successfully
- User is not mid-upload

### Implementation Notes

```javascript
// Pseudo-code for in-app review trigger
async function maybeRequestReview(user) {
  const eligible =
    user.role === 'parent' && user.photosViewed >= 5 ||
    user.role === 'teacher' && user.photosUploaded >= 25;

  const notRecent =
    !user.lastReviewPrompt ||
    daysSince(user.lastReviewPrompt) > 60;

  const noRecentIssues =
    !user.lastBugReport ||
    daysSince(user.lastBugReport) > 7;

  if (eligible && notRecent && noRecentIssues) {
    await requestReview();
    user.lastReviewPrompt = new Date();
  }
}
```

---

## Email Review Sequence

### Email 1: Initial Review Request (Day 14)

**Subject**: Quick favor? (30 seconds)

**To**: Teachers and admins at active schools

```
Hi [Name],

Your school has shared [X] photos with parents in the past two weeks. That's [X] moments of connection!

If Peekaboo is making your day easier, would you take 30 seconds to leave us a review?

[Leave a Review on the App Store]
[Leave a Review on Google Play]

Your review helps other preschools find us—and lets us know we're on the right track.

Thank you,
The Peekaboo Team

P.S. If something's not working right, please reply to this email instead. We'd rather fix it than have you leave a bad review!
```

---

### Email 2: Parent-Focused Review Request (Day 10)

**Subject**: Loving those classroom photos?

**To**: Parents who have viewed 10+ photos

```
Hi [Name],

You've viewed [X] photos of [Child Name] on Peekaboo. We hope each one made you smile!

If you're enjoying staying connected to [Child Name]'s day, we'd love a quick review:

[Leave a Review on the App Store]
[Leave a Review on Google Play]

Reviews help other parents discover Peekaboo and help their schools make the switch.

Thank you for being part of our community,
The Peekaboo Team

P.S. The best reviews mention what you love most—is it the daily updates? The simple sign-in? The privacy? Your words help other parents know what to expect.
```

---

### Email 3: Follow-Up for Non-Responders (Day 21)

**Subject**: One more thing...

**To**: Users who opened Email 1 but didn't leave a review

```
Hi [Name],

I know you're busy (preschool life is no joke), but I wanted to try one more time.

We're a small team building Peekaboo for schools like yours. Every review—especially the honest ones—helps us grow and improve.

If you have 30 seconds:
[Leave a Review]

And if you have feedback that's NOT a 5-star review, I'd genuinely love to hear it. Just reply to this email.

Thank you,
[Founder Name]
Founder, Peekaboo
```

---

### Email 4: Personalized Request for Pilot Schools

**Subject**: Thank you for being a founding school

**To**: Schools from pilot program

```
Hi [Name],

[School Name] was one of the first schools to try Peekaboo, and I can't thank you enough. Your feedback shaped the app into what it is today.

As we prepare for our official launch, I have one more favor to ask:

Would you leave us a review on the App Store?

Your voice carries extra weight because you've been with us from the start. Other directors trust reviews from experienced users.

[Leave a Review on the App Store]

If you prefer Google Play, here's that link: [Google Play Link]

And if there's anything—anything at all—that would prevent you from giving us 5 stars, please tell me first. I'll do everything I can to fix it.

With gratitude,
[Founder Name]
```

---

### Email 5: Teacher-to-Parent Ask (Template for Teachers to Send)

**Subject**: Help us help Peekaboo

**To**: Sent BY teachers TO their parents

```
Hi Parents,

Quick favor!

We've been using Peekaboo to share classroom photos, and I hope you've enjoyed seeing [class name]'s adventures.

The Peekaboo team asked if we could help them get more reviews on the App Store. If you have 30 seconds, it would mean a lot:

[Leave a Review on the App Store]
[Leave a Review on Google Play]

Thank you for being such an engaged community!

—[Teacher Name]
```

---

## Review Request Best Practices

### What Works

1. **Ask at the right moment**: After a positive experience
2. **Keep it short**: Under 100 words in email
3. **Make it easy**: Direct link to review page
4. **Give an alternative**: Offer email feedback for unhappy users
5. **Personalize**: Use real data (photos viewed, school name)
6. **Be human**: Sign with a real name, not "The Team"

### What Doesn't Work

1. ~~Offering incentives for reviews~~ (App Store violation)
2. ~~Asking too frequently~~ (once per 60 days max)
3. ~~Generic "please review us" messages~~
4. ~~Asking users who've had issues~~
5. ~~Long, wordy emails~~

---

## Handling Negative Reviews

### Response Templates

**1-2 Star Review (Bug/Issue)**:
```
Hi [Name], I'm so sorry you're having trouble with [issue]. This isn't the experience we want you to have. Please email us at hello@peekaboo.photos so we can fix this for you. We read every message personally. —[Name], Peekaboo Team
```

**1-2 Star Review (Feature Request)**:
```
Thank you for this feedback, [Name]. We're always working to improve Peekaboo, and your input helps prioritize what we build next. If you have more details to share, please email hello@peekaboo.photos—we'd love to hear more. —[Name], Peekaboo Team
```

**1-2 Star Review (Misunderstanding)**:
```
Hi [Name], thanks for the feedback. It sounds like there might be a misunderstanding about [feature]. [Brief clarification]. If you're still having trouble, please email hello@peekaboo.photos and we'll help you directly. —[Name], Peekaboo Team
```

### Response Protocol

1. Respond within 24 hours
2. Always be polite and helpful
3. Take the conversation offline (email)
4. Never argue or be defensive
5. Follow up after resolution
6. Ask if they'd consider updating their review (only if genuinely resolved)

---

## Review Monitoring

### Tools

| Tool | Cost | Features |
|------|------|----------|
| **AppFollow** | $0-$79/mo | Review monitoring, reply management |
| **Sensor Tower** | Custom | Deep ASO + review analytics |
| **Manual** | Free | Check daily via App Store Connect + Play Console |

### Daily Checklist

- [ ] Check App Store Connect for new reviews
- [ ] Check Google Play Console for new reviews
- [ ] Respond to any negative reviews
- [ ] Thank any particularly glowing reviews
- [ ] Log review trends (rating over time)

---

## Metrics to Track

| Metric | Target | Notes |
|--------|--------|-------|
| Average rating (iOS) | 4.8+ | Updated weekly |
| Average rating (Android) | 4.7+ | Android users rate lower on average |
| Total reviews (iOS) | 50 in 90 days | Credibility threshold |
| Total reviews (Android) | 30 in 90 days | Lower volume OK |
| Review response rate | 100% for 1-3 stars | Critical for trust |
| Review response time | <24 hours | Faster = better |

---

## Review Milestones

### Week 1-2 (Soft Launch)
- Ask pilot schools personally
- Goal: 10 reviews

### Week 3-4 (Public Launch)
- Send Email 1 to active teachers
- Enable in-app review prompt
- Goal: 25 cumulative reviews

### Month 2
- Send Email 2 to active parents
- Follow up with non-responders (Email 3)
- Goal: 40 cumulative reviews

### Month 3
- Send Email 4 to remaining pilot schools
- Provide teacher-to-parent template (Email 5)
- Goal: 50 cumulative reviews (4.8+ average)

---

## App Store Optimization: Review Keywords

Encourage reviewers to mention these naturally:

| Keyword | Why |
|---------|-----|
| "preschool photos" | Primary search term |
| "private" / "privacy" | Differentiator |
| "easy" | Reduces adoption anxiety |
| "love seeing my child" | Emotional, relatable |
| "daily updates" | Feature highlight |
| "no password" / "magic link" | Unique feature |
| "safe" / "secure" | Trust signal |

**Don't ask reviewers to include specific keywords**—that's against App Store guidelines. But you can mention these benefits in your email so they're top of mind.

---

## Sample Review Prompts (What Good Reviews Look Like)

These are examples of the kind of reviews we hope to generate:

**5-Star Parent Review**:
> "I love seeing what my daughter does at preschool! Peekaboo sends me a notification and I can see her photos right away. No passwords to remember, just tap and see her smiling face. So glad her school uses this!"

**5-Star Teacher Review**:
> "Game changer for sharing classroom photos. I snap pics throughout the day, tag the kids, and parents get them instantly. No more email chains or worrying about sharing the wrong photo with the wrong family. Takes me 2 minutes instead of 20."

**5-Star Director Review**:
> "We switched from Brightwheel just for photos and parents are thrilled. The privacy features (location data stripped, parents only see their own kids) give us peace of mind. And the flat pricing is refreshing—no per-child fees."

---

*Document prepared by Growth Agent. For questions, contact the project owner.*
