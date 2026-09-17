'use client'

/**
 * The Studio config is imported here, behind a client boundary, on purpose.
 * Pulling `sanity` into the server graph makes Next resolve its dependencies
 * through the react-server export condition, which the Studio is not built for.
 */
import { NextStudio } from 'next-sanity/studio'

import config from '../../../../sanity.config'

export function Studio() {
  return <NextStudio config={config} />
}
