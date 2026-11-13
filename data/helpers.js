// data/helpers.js
// Shared helpers for the pages. Keeps data/issues.js (your daily file) untouched.
import { getAllPastIssues, getIssueBySlug } from './issues'
import { HELP_GROUPS } from './helpGroups'

// The real, primary address (rubberneck.ai redirects here).
export const SITE_URL = 'https://www.rubberneck.ai'

// A small version of an issue: only what cards and lists need.
// (The full body of every issue is large, so we don't send it to list pages.)
export function slimIssue(issue) {
  return {
    id: issue.id,
    slug: issue.slug || null,
    date: issue.date,
    headline: issue.headline,
    subheadline: issue.subheadline || '',
    tags: issue.tags || [],
    site: {
      name: issue.site?.name || '',
      url: issue.site?.url || '',
      screenshot: issue.site?.screenshot || null,
      category: issue.site?.category || '',
      vibe: issue.site?.vibe || '',
    },
  }
}

// Previous / next by DATE (not by issue number), published issues only.
export function getNeighbors(issue) {
  const past = getAllPastIssues() // newest first
  const idx = past.findIndex((i) => i.slug === issue.slug)
  if (idx === -1) {
    // A page that is dated in the future: previous = newest published issue, no next.
    return { prev: past[0] ? slimIssue(past[0]) : null, next: null }
  }
  const newer = idx > 0 ? past[idx - 1] : null
  const older = idx < past.length - 1 ? past[idx + 1] : null
  return {
    prev: older ? slimIssue(older) : null,
    next: newer ? slimIssue(newer) : null,
  }
}

// "More like this".
// 1) If the issue is on the Get Help page, its neighbors in that group come first.
// 2) Then issues that share RARE tags or a RARE category (common tags like "free"
//    or "tools" are ignored, because they match almost everything).
export function getRelatedIssues(issue, limit = 3) {
  const past = getAllPastIssues()
  const publishedSlugs = new Set(past.map((i) => i.slug))
  const picked = []
  const seen = new Set([issue.slug])
  const add = (other) => {
    if (!other || !other.slug || seen.has(other.slug) || !publishedSlugs.has(other.slug)) return
    seen.add(other.slug)
    picked.push(other)
  }

  // 1) siblings from the curated Get Help group, starting just after this issue
  const group = HELP_GROUPS.find((g) => g.slugs.includes(issue.slug))
  if (group) {
    const at = group.slugs.indexOf(issue.slug)
    for (let step = 1; step < group.slugs.length && picked.length < limit; step++) {
      add(getIssueBySlug(group.slugs[(at + step) % group.slugs.length]))
    }
  }

  // 2) rare shared tags / category
  if (picked.length < limit) {
    const N = past.length
    const tagFreq = {}
    const catFreq = {}
    for (const i of past) {
      for (const t of new Set((i.tags || []).map((x) => x.toLowerCase()))) tagFreq[t] = (tagFreq[t] || 0) + 1
      const c = (i.site?.category || '').toLowerCase()
      if (c) catFreq[c] = (catFreq[c] || 0) + 1
    }
    const common = (n) => n > N * 0.12 // used on more than ~12% of issues = too generic
    const myTags = new Set((issue.tags || []).map((t) => t.toLowerCase()))
    const myCat = (issue.site?.category || '').toLowerCase()
    const scored = []
    for (const other of past) {
      if (!other.slug || seen.has(other.slug)) continue
      let score = 0
      for (const t of new Set((other.tags || []).map((x) => x.toLowerCase()))) {
        if (myTags.has(t) && !common(tagFreq[t])) score += Math.log(N / tagFreq[t])
      }
      const c = (other.site?.category || '').toLowerCase()
      if (myCat && c === myCat && !common(catFreq[c])) score += 1
      if (score > 0) scored.push({ score, other })
    }
    scored.sort((a, b) => b.score - a.score || (a.other.date < b.other.date ? 1 : -1))
    for (const s of scored) {
      if (picked.length >= limit) break
      add(s.other)
    }
  }

  return picked.slice(0, limit).map(slimIssue)
}

// Everything the archive search needs, in lowercase, built once at build time.
export function buildSearchText(issue) {
  return [
    issue.headline,
    issue.subheadline,
    issue.meta_description,
    issue.site?.name,
    issue.site?.category,
    issue.site?.vibe,
    (issue.tags || []).join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function slimForSearch(issue) {
  return { ...slimIssue(issue), search: buildSearchText(issue) }
}
