/**
 * Optional. Without a token the site still renders published content; with one,
 * the Live Content API pushes edits through without a refresh.
 */
export const token = process.env.SANITY_API_READ_TOKEN || undefined
