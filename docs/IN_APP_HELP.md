# Peekaboo In-App Help Content

**Last Updated**: March 14, 2026

This document contains help content designed for in-app help modals and tooltips. Each section is written for quick scanning on mobile screens.

---

## Help Modal Content

### Parent Help Screen

**Header**: How Peekaboo Works

**Content**:

#### Viewing Photos
Your teacher shares photos and tags which children appear. You'll see every photo with your child in it.

#### Privacy Protected
- You only see your own child's photos
- Photo links expire after 15 minutes
- Location data is removed from all photos

#### Favorites
Tap the heart on any photo to save it to your favorites.

#### Need More Help?
- Check your email for photos (we send notifications)
- Contact your school if photos aren't appearing
- Email support@peekaboo.app

---

### Teacher Help Screen

**Header**: Sharing Photos

**Content**:

#### Quick Upload
1. Tap "Share Photos"
2. Take or select photos
3. Tag children who appear
4. Add a caption (optional)
5. Upload!

#### Tagging
- Tap each child in the photo
- Only tagged families see the photo
- You can tag multiple children

#### Privacy Automatic
- Location data removed automatically
- Photos compressed for fast viewing
- Secure signed URLs

#### Need Help?
Contact your school administrator or email support@peekaboo.app

---

## Tooltip Content

Short text for UI elements (max ~50 characters each):

### General
- **Magic Link**: Sign in without a password
- **Refresh**: Load the latest photos
- **Sign Out**: Sign out of your account

### Parent View
- **Favorites**: Photos you've marked as favorites
- **Heart Icon**: Tap to save to favorites
- **Child Selector**: Switch between your children

### Teacher View
- **Share Photos**: Upload new photos to share
- **Tag Children**: Select which children appear
- **Delete Photo**: Remove this photo permanently
- **Classroom Selector**: Switch between classrooms

---

## First-Time User Tooltips

### Parent First Login

**Tooltip 1 (Photo Feed)**
Title: Your Photo Feed
Text: Photos of your child appear here. Pull down to refresh!

**Tooltip 2 (Heart Icon)**
Title: Save Favorites
Text: Tap the heart to save photos you love.

**Tooltip 3 (Security Badge)**
Title: Photos Protected
Text: Your connection is encrypted. Only you see your child's photos.

---

### Teacher First Login

**Tooltip 1 (Share Button)**
Title: Share Photos
Text: Tap here to upload photos for parents to see.

**Tooltip 2 (Child Tags)**
Title: Tag Children
Text: Tap each child in the photo. Only their families will see it.

**Tooltip 3 (Classroom Selector)**
Title: Your Classroom
Text: If you have multiple classrooms, switch between them here.

---

## Empty State Content

### Parent: No Photos Yet

**Illustration**: Camera with sparkles

**Headline**: No photos yet!

**Body**: Your child's teacher will share photos here. Check back soon—or ask them about Peekaboo!

---

### Parent: No Children Linked

**Illustration**: Family silhouette

**Headline**: Account not linked

**Body**: Contact your school to link your account to your child. Use the same email address your school has on file.

**Button**: Contact School (opens email to school)

---

### Teacher: No Children in Classroom

**Illustration**: Empty classroom

**Headline**: No children yet

**Body**: Ask your administrator to add children to your classroom. Once added, you can start tagging photos!

---

### Teacher: No Recent Photos

**Illustration**: Camera

**Headline**: Ready to share?

**Body**: Tap "Share Photos" to capture a classroom moment. Parents will be notified automatically!

**Button**: Share Photos

---

## Error Message Content

### Sign In Errors

**Invalid Email**
- Headline: Check your email
- Body: Make sure you're using the email address your school has on file.

**Link Expired**
- Headline: Link expired
- Body: Magic links are valid for 1 hour. Tap below to request a new one.
- Button: Send new link

**Already Used**
- Headline: Link already used
- Body: Magic links work once. Request a new one to sign in.
- Button: Send new link

**Network Error**
- Headline: Connection problem
- Body: Check your internet and try again.
- Button: Retry

---

### Upload Errors

**Upload Failed**
- Headline: Upload failed
- Body: Check your connection and try again. If the problem continues, try a smaller photo.
- Button: Retry

**No Children Tagged**
- Headline: Tag at least one child
- Body: Tap children who appear in this photo so their families can see it.

**Photo Too Large**
- Headline: Photo too large
- Body: This photo exceeds our size limit. Try selecting a different photo.

---

### General Errors

**Something Went Wrong**
- Headline: Something went wrong
- Body: We're looking into it. Try again in a moment.
- Button: Refresh

**Offline**
- Headline: You're offline
- Body: Connect to the internet to view photos and upload.

---

## Confirmation Dialogs

### Delete Photo (Teacher)

**Title**: Delete photo?

**Body**: This photo will be permanently removed. Families will no longer be able to see it.

**Buttons**: Cancel | Delete

---

### Sign Out

**Title**: Sign out?

**Body**: You'll need to request a new magic link to sign back in.

**Buttons**: Cancel | Sign Out

---

## Success Messages

### Photo Uploaded

**Headline**: Photo shared!

**Body**: [X] families have been notified.

**Auto-dismiss**: 3 seconds

---

### Favorite Saved

**Headline**: Saved to favorites

**Auto-dismiss**: 2 seconds

---

### Magic Link Sent

**Headline**: Check your email!

**Body**: We sent a sign-in link to [email]. Tap it to continue.

**Note**: Check spam if you don't see it.

---

## Onboarding Screens (First Launch)

### Screen 1: Welcome

**Illustration**: Peekaboo eye logo

**Headline**: Welcome to Peekaboo

**Body**: See your child's preschool day, securely.

**Button**: Get Started

---

### Screen 2: Privacy First

**Illustration**: Shield with checkmark

**Headline**: Your photos are protected

**Body**: Location data removed. Links that expire. Access only for your family.

**Button**: Next

---

### Screen 3: No Passwords

**Illustration**: Magic wand/email

**Headline**: No password needed

**Body**: We'll send you a magic link every time you sign in. Just tap and you're in!

**Button**: Next

---

### Screen 4: Choose Your Role

**Illustration**: Two paths

**Headline**: I am a...

**Buttons**:
- I'm a Parent
- I'm a Teacher

---

## Loading States

### Photos Loading
"Loading your child's photos..."

### Uploading Photo
"Sharing with families... [X]%"

### Signing In
"Sending your magic link..."

### Refreshing
"Checking for new photos..."

---

## Accessibility Labels

Screen reader text for key UI elements:

- **Heart (empty)**: "Add to favorites"
- **Heart (filled)**: "Remove from favorites"
- **Refresh button**: "Refresh photos"
- **Upload button**: "Upload new photos"
- **Delete button**: "Delete this photo"
- **Child tag (unselected)**: "[Child name], not tagged"
- **Child tag (selected)**: "[Child name], tagged"
- **Photo thumbnail**: "Photo of [tagged children names], uploaded [date]"
- **Sign out button**: "Sign out of your account"

---

## Push Notification Text (Future)

### New Photo Available
Title: New photo from [School Name]
Body: [Teacher Name] shared a photo of [Child Name]
Action: Tap to view

### Daily Summary
Title: Today at [School Name]
Body: [X] new photos of [Child Name]
Action: Tap to view

### Week in Review
Title: This week's moments
Body: See [X] photos from [Child Name]'s week!
Action: Tap to view

---

*This content is designed for integration into the Peekaboo app. All text should be easily editable in a future CMS or localization file.*
