export const pages = [
  { path: 'pages/home.md', url: '/', title: 'Welcome' },
  { path: 'pages/about.md', url: '/about/', title: 'About FiQCI', subtitle: 'The FiQCI consortium maintains, operates, and develops the infrastructure' },
  { path: 'pages/access.md', url: '/access/', title: 'Get Access', subtitle: 'Access to FiQCI is granted through the CSC supercomputing environment' },
  { path: 'pages/accessibility.md', url: '/accessibility/', title: 'Accessibility Statement', subtitle: 'Accessibility Statement' },
  { path: 'pages/events.md', url: '/events/', title: 'Events', subtitle: 'Upcoming and past events with connection to FiQCI' },
  { path: 'pages/publications.md', url: '/publications/', title: 'Blogs and Instructions', subtitle: 'Blog posts, publications, and other material of interest' },
  { path: 'pages/search.md', url: '/search/', title: 'Search Results' },
  { path: 'pages/status.md', url: '/status/', title: 'Status', subtitle: 'View the status of the Quantum Connections' },
]

export const pageByUrl = url => pages.find(page => page.url === url)
