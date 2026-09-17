import type { StructureResolver } from 'sanity/structure'

/**
 * Singletons get explicit, stable document IDs so the frontend can fetch them
 * by ID and editors only ever see one of each.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('Meet Sandy')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.divider(),
      S.documentTypeListItem('continent').title('Continents'),
      S.documentTypeListItem('country').title('Countries'),
      S.listItem()
        .title('Photos by country')
        .id('photosByCountry')
        .child(
          S.documentTypeList('country')
            .title('Countries')
            .child((countryId) =>
              S.documentList()
                .title('Photos')
                .filter('_type == "photo" && country._ref == $countryId')
                .params({ countryId })
                .defaultOrdering([{ field: 'capturedAt', direction: 'asc' }]),
            ),
        ),
      S.documentTypeListItem('photo').title('All photos'),
      S.divider(),
      S.documentTypeListItem('trip').title('Trips'),
      S.documentTypeListItem('travelNote').title('Travel notes'),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
