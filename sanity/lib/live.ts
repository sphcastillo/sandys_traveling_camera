import { defineLive } from 'next-sanity/live'

import { client } from './client'
import { token } from './token'

/**
 * Passing `false` rather than `undefined` tells next-sanity the missing token is
 * deliberate: published content still streams live, and draft previewing is left
 * to the Presentation Tool. Set SANITY_API_READ_TOKEN to turn both on.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token ?? false,
  browserToken: token ?? false,
})
