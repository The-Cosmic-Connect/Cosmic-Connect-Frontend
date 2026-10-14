// Google Analytics 4 measurement ID.
// G-HXFKKJN8X6 = stream "Cosmic Connect 2.0" in GA4 property 278488443
// ("The Cosmic Connect" account) - the property that holds all history,
// including the old Wix stream. (G-M07HDW6CVR is a newer, empty property.)
// Page views on client-side navigation are tracked by GA4's Enhanced
// measurement ("Page changes based on browser history events"), so there is
// no manual route-change tracking (that would count every page twice).
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-HXFKKJN8X6'
