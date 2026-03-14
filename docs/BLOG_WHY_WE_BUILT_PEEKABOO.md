# Why I Built Peekaboo

*A founder's story about preschool photos, privacy paranoia, and building something simple that works.*

---

## The Question Every Parent Asks

"How was your day?"

My daughter's answer was always the same: a shrug, maybe a "good," and then she'd run off to do something more interesting than talking to her dad.

She had just started preschool. I wanted to know everything. What did she learn? Who did she play with? Did she eat her lunch? Was she happy?

Her answer: "Good."

---

## The Email Problem

Her preschool did their best. Once a week, sometimes twice, I'd get an email with photos attached. Classroom activities. Art projects. Playground time. It was wonderful to see glimpses of her day.

But something bothered me.

The photos included other kids. Of course they did — it's a classroom, not a solo portrait studio. I was looking at other families' children, and other families were looking at mine.

Then I noticed something else. I opened one of the photos on my phone and checked the metadata. There it was: GPS coordinates. The exact location of the preschool. The exact time the photo was taken. The device used.

If I could see that, so could anyone who got forwarded that email. Anyone who stumbled across it. Anyone.

I'm a software engineer. I'm probably more paranoid about digital privacy than most. But even for non-technical parents — shouldn't there be a better way?

---

## What I Wanted

Simple requirements, really:

1. **Show me photos of my kid.** Just mine. Not everyone else's.

2. **Remove location data.** Automatically. Every time.

3. **Make it easy for teachers.** They're already overworked. Don't add another complicated system.

4. **No passwords.** I forget passwords. Everyone forgets passwords. Send me a link.

5. **Don't be creepy.** Don't sell my data. Don't show me ads. Don't track everything I do.

I looked at what was available. There were all-in-one daycare platforms with billing, attendance, lesson plans, messaging, and yes, photo sharing buried somewhere in the menu. They were expensive. Complex. Built for administrators, not parents.

I just wanted to see my daughter's day.

---

## So I Built It

Peekaboo started as a weekend project. A way to scratch my own itch.

The core idea: teachers upload photos and tag which children are in each one. Parents sign in and only see photos of their own kids. Period.

The technical approach:
- **Row-Level Security** in the database ensures parents can't even request photos they shouldn't see. It's not just UI hiding — it's enforced at the data level.
- **EXIF stripping** happens automatically on upload. GPS coordinates, device information, timestamps in metadata — all removed before storage.
- **Magic links** instead of passwords. Click a link in your email, and you're in. No password to forget.
- **Signed URLs** with 15-minute expiration. Even if someone got hold of a photo link, it stops working quickly.

I built it for my daughter's preschool first. It worked. Teachers found it easy. Parents loved seeing photos of just their kids. No one complained about privacy.

---

## Why Not Just Use [Insert Big Platform Here]?

Fair question. Brightwheel, HiMama, Playground — they all exist. They all have photo sharing.

But they're all-in-one platforms. Photo sharing is a feature, not the focus. It shows.

They charge per child, which means growing classrooms pay more and more. Some charge parents directly, which creates friction. Their photo features are... fine. Not great. An afterthought bolted onto attendance and billing.

Peekaboo does one thing: secure photo sharing. That's it.

I believe in doing one thing well. When a product tries to do everything, it does nothing exceptionally. Parents don't need another app that does attendance and billing and messaging and photos and lesson plans. They need to see their child's day.

---

## Privacy Is the Feature

Most apps treat privacy as a compliance checkbox. GDPR? Check. CCPA? Check. Privacy policy written by lawyers? Check.

At Peekaboo, privacy is the product.

Parents choose us because they trust us. They trust us because:
- We strip location data before we even store photos
- We enforce parent-child access at the database level (not just the app)
- We don't sell data (our business model is subscriptions, not ads)
- We don't track everything you do (basic analytics, no creepy profiles)
- Photo links expire (sharing links doesn't mean sharing forever)

When you build a product for children, privacy isn't optional. It's the whole point.

---

## The Name

Peekaboo. The game you play with babies. Cover your eyes, reveal your face, and watch them light up.

It's about surprise and delight. About revealing something wonderful. About connection between parent and child.

That's what we're building. A way for parents to peek into their child's day and feel that moment of connection.

Also, it's easy to spell and the domain was available.

---

## What's Next

Peekaboo is live today. You can try it at [peekaboo.photos](https://peekaboo.photos).

We're starting small. A few pilot schools. Parents who care about privacy. Teachers who want something simple.

If you're a preschool director looking for a better way to share photos, I'd love to talk. If you're a parent who wishes your school used something like this, tell them about us.

We're not trying to replace Brightwheel or become the next big edtech platform. We just want to help parents see their child's day — securely, simply, and with peace of mind.

---

## One More Thing

My daughter still shrugs when I ask about her day.

But now, when I pick her up, I've already seen the photos. I know about the finger painting. The new friend she sat with at lunch. The silly face she made during story time.

"I saw you played with the blocks today," I say.

Her face lights up. "Yeah! I built a castle!"

And we talk about it all the way home.

That's why I built Peekaboo.

---

*Dan Sickles is the founder of Peekaboo. He lives in [Location] with his family, including one very creative preschooler.*

---

**Try Peekaboo**: [peekaboo.photos](https://peekaboo.photos)
**Questions?**: hello@peekaboo.app
**Follow us**: [@PeekabooApp](https://twitter.com/PeekabooApp)

---

*Published: March 2026*
