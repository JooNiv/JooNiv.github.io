import { mdiAlertOctagon, mdiAlert, mdiInformation, mdiChevronRight } from '@mdi/js';

const SECTIONS = [
  { type: 'error', title: 'Alerts', icon: mdiAlertOctagon, box: 'bg-red-100 border-red-700 dark:bg-red-950/40 dark:border-red-400', heading: 'text-red-900 dark:text-red-200' },
  { type: 'warning', title: 'Warnings', icon: mdiAlert, box: 'bg-orange-100 border-orange-600 dark:bg-orange-950/40 dark:border-orange-400', heading: 'text-orange-900 dark:text-orange-200' },
  { type: 'info', title: 'Information', icon: mdiInformation, box: 'bg-sky-100 border-sky-700 dark:bg-sky-950/40 dark:border-sky-400', heading: 'text-sky-900 dark:text-sky-200' },
];

const typeOf = alert => {
  const type = alert.type?.toLowerCase();
  return SECTIONS.some(section => section.type === type) ? type : 'info';
};

const Icon = ({ path, className = '' }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className={`shrink-0 fill-current ${className}`}>
    <path d={path} />
  </svg>
);

const AlertItem = ({ text, link }) => link
  ? (
    <a href={link} className='flex items-start gap-2 py-2 hover:underline'>
      <span>{text}</span>
      <Icon path={mdiChevronRight} className='ml-auto' />
    </a>
  )
  : <p className='py-2'>{text}</p>;

export const Alerts = ({ alerts = [] }) => {
  const sections = SECTIONS
    .map(section => ({ ...section, items: alerts.filter(alert => typeOf(alert) === section.type) }))
    .filter(section => section.items.length > 0);

  if (sections.length === 0) return null;

  return (
    <div className='flex flex-col gap-3 text-on-surface'>
      {sections.map(section => (
        <section key={section.type} aria-label={section.title} className={`border-l-4 px-4 py-3 ${section.box}`}>
          <h3 className={`flex items-center gap-2 font-bold ${section.heading}`}>
            <Icon path={section.icon} />
            {section.title}
          </h3>
          <ul className='pl-8 divide-y divide-black/10 dark:divide-white/10'>
            {section.items.map((alert, index) => (
              <li key={index}><AlertItem {...alert} /></li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
