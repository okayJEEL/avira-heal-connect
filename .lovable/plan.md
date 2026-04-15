

## Plan: Branded Email Template for Appointment Notifications

### What Changes

Replace the current plain EmailJS template with a professionally branded HTML email matching the reference image. The email sent to avirahospital@gmail.com on every new booking will include:

- **Blue header** with Avira Hospital logo and name
- **Appointment Details** section (consultation type, doctor, date, time slot, reason)
- **Patient Information** section (name, mobile, email, age/gender, city)
- **Action Required** section with a "Review Appointment in Portal" button linking to the staff login page (`/staff-login`)
- **Footer** with pending status note and hospital branding

### How It Works

Since the project already uses **EmailJS** for this email, we keep EmailJS but switch to a custom HTML template built inline in the code. EmailJS supports sending raw HTML via template variables.

**Files changed:**

1. **`src/pages/BookAppointment.tsx`** — Replace the current `emailjs.send()` call with one that passes a fully rendered HTML string as a template variable. The HTML will be constructed as a string matching the reference design:
   - Blue gradient header with logo (`https://i.ibb.co/ZRjCdVqB/final-logo.png`)
   - Appointment details in a light yellow card with blue header bar
   - Patient info in a similar card
   - Green "Action Required" card with a button linking to `https://avirahospital.in/staff-login` (or the current domain + `/staff-login`)
   - Footer note about pending approval

2. **EmailJS template update** — The EmailJS template (`template_nh07zjn`) needs to be updated on the EmailJS dashboard to simply render a `{{{html_content}}}` variable (triple braces for unescaped HTML). This is a one-time manual step on emailjs.com.

### Alternative approach (recommended)

Instead of relying on EmailJS template rendering, we build the full HTML email string in the frontend code and pass it as a single variable to EmailJS. This gives us full control over the design without needing to edit the EmailJS dashboard template.

The EmailJS template just needs one variable like `{{{message_html}}}` that outputs raw HTML.

### Technical Details

- Build an `generateEmailHTML()` function that takes appointment data and returns a complete HTML email string
- Uses inline CSS for email client compatibility
- Colors: header `#2563EB` (primary blue), appointment section header `#93C5FD` bg, patient section same, action section `#BBF7D0` green bg
- Button: `#2F855A` green background linking to staff portal login
- Logo from the hosted URL
- The "Review Appointment in Portal" button links to the published site's `/staff-login` route

### User Action Required

You will need to update your EmailJS template on the EmailJS dashboard to render raw HTML from a variable. I'll provide the exact variable name to use.

