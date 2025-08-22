export const slugify = (s: string) =>
  s.toLowerCase()
   .replace(/[^a-z0-9\s-]/g,'')
   .trim()
   .replace(/\s+/g,'-')
   .slice(0,70)
