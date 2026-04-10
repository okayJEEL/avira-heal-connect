

## Plan: Remove Images from Blog Section

### Change
Remove all blog post images and keep the blog as a clean, text-only layout while preserving the current alignment, animations, and expand/collapse functionality.

### Files to modify

**`src/pages/Blog.tsx`**
- Remove all image imports (`blog-1.jpg` through `blog-4.jpg`)
- Remove the `image` property from all `blogPosts` entries
- **Featured post**: Convert from 2-column (image + text) grid to a full-width text card
- **Grid posts**: Remove the `<div className="overflow-hidden h-48">` image block from each card, keeping only the text content below
- Keep all animations, badges, categories, author info, and expand/collapse logic intact

### Result
A clean, professional text-based blog with the same card styling, hover effects, and staggered animations — just without images.

