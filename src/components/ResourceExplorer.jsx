import React, { useEffect, useMemo, useRef, useState } from 'react';
import { mdiArrowRight, mdiOpenInNew, mdiChevronDown } from '@mdi/js';
import { prependBaseURL, isExternal } from '../utils/url';

const ICONS = { mdiArrowRight, mdiOpenInNew };

const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const Icon = ({ path, className = '' }) => (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className={`shrink-0 fill-current ${className}`}>
        <path d={path} />
    </svg>
);

const buildGroups = ({ quantum = [], super: supercomputers = [], emulation = [] }) => {
    const withIds = (resources, group) => resources.map(resource => ({ ...resource, id: resource.id || slugify(resource.name), group }));
    const all = [...withIds(quantum, 'quantum'), ...withIds(supercomputers, 'super'), ...withIds(emulation, 'emulation')];
    return [
        { id: 'quantum', title: 'Quantum computers', resources: all.filter(r => r.group === 'quantum' && !r.retired) },
        { id: 'super', title: 'Supercomputers', resources: all.filter(r => r.group === 'super' && !r.retired) },
        { id: 'emulation', title: 'Emulation', resources: all.filter(r => r.group === 'emulation' && !r.retired) },
        { id: 'retired', title: 'Retired', resources: all.filter(r => r.retired), collapsible: true },
    ].filter(group => group.resources.length > 0);
};

const ResourceDetails = ({ resource, hidden }) => (
    <article id={`resource-${resource.id}`} hidden={hidden} aria-labelledby={`resource-${resource.id}-name`}
        className="border border-gray-200 p-6 flex flex-col lg:flex-row gap-6">
        {resource.image && (
            <img
                className="w-full max-w-[420px] lg:w-[320px] shrink-0 aspect-video object-cover self-start"
                src={prependBaseURL(resource.image)}
                alt={resource.name}
            />
        )}
        <div className="flex flex-col gap-4 grow min-w-0">
            <div>
                <h3 id={`resource-${resource.id}-name`} className="text-xl font-bold">{resource.name}</h3>
                {resource.retired && <p className="text-sm font-semibold text-gray-600 pt-1">Decommissioned</p>}
            </div>
            <p className="text-sm">{resource.desc?.trim()}</p>
            {resource.links?.some(link => link.link) && (
                <ul className="flex flex-col gap-2">
                    {resource.links.filter(link => link.link).map((link, index) => (
                        <li key={index}>
                            <a href={prependBaseURL(link.link)} className="text-sky-800 hover:underline inline-flex items-center gap-2">
                                {link.teaser}
                                <Icon path={ICONS[link.icon] || (isExternal(link.link) ? mdiOpenInNew : mdiArrowRight)} />
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </article>
);

const SidebarGroup = ({ group, selectedId, onSelect }) => {
    const items = (
        <ul className="flex flex-col">
            {group.resources.map(resource => {
                const selected = resource.id === selectedId;
                return (
                    <li key={resource.id}>
                        <button
                            type="button"
                            aria-current={selected ? 'true' : undefined}
                            aria-controls={`resource-${resource.id}`}
                            onClick={() => onSelect(resource.id)}
                            className={`w-full text-left px-3 py-2 border-l-4 cursor-pointer ${selected
                                ? 'border-[#004E84] bg-[#E5F2F8] font-bold'
                                : 'border-transparent hover:bg-gray-100'}`}
                        >
                            {resource.name}
                        </button>
                    </li>
                );
            })}
        </ul>
    );

    const heading = 'text-xs font-bold uppercase tracking-wide text-gray-600 px-3 pb-1';

    if (group.collapsible) {
        const containsSelected = group.resources.some(resource => resource.id === selectedId);
        return (
            <details open={containsSelected || undefined} className="group">
                <summary className={`${heading} flex items-center gap-1 cursor-pointer list-none`}>
                    {group.title}
                    <Icon path={mdiChevronDown} className="transition-transform group-open:rotate-180" />
                </summary>
                {items}
            </details>
        );
    }

    return (
        <div>
            <h3 className={heading}>{group.title}</h3>
            {items}
        </div>
    );
};

export const ResourceExplorer = ({ quantum, supercomputers, emulation }) => {
    const groups = useMemo(() => buildGroups({ quantum, super: supercomputers, emulation }), [quantum, supercomputers, emulation]);
    const resources = groups.flatMap(group => group.resources);
    const [selectedId, setSelectedId] = useState(resources[0]?.id);
    const containerRef = useRef(null);

    useEffect(() => {
        const selectFromHash = () => {
            const hash = decodeURIComponent(window.location.hash.slice(1));
            if (!hash) return;
            const target = groups.find(group => group.id === hash)?.resources[0] ?? resources.find(resource => resource.id === hash);
            if (!target) return;
            setSelectedId(target.id);
            containerRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
        selectFromHash();
        window.addEventListener('hashchange', selectFromHash);
        return () => window.removeEventListener('hashchange', selectFromHash);
    }, [groups]);

    const select = id => {
        setSelectedId(id);
        history.replaceState(null, '', `#${id}`);
    };

    if (resources.length === 0) return null;

    return (
        <div ref={containerRef} className="scroll-mt-24 flex flex-col md:grid md:grid-cols-[240px_1fr] gap-6">
            <label className="md:hidden flex flex-col gap-2">
                <span className="text-sm font-bold">Choose a resource</span>
                <select
                    value={selectedId}
                    onChange={event => select(event.target.value)}
                    className="border border-gray-400 bg-white px-3 py-2"
                >
                    {groups.map(group => (
                        <optgroup key={group.id} label={group.title}>
                            {group.resources.map(resource => (
                                <option key={resource.id} value={resource.id}>{resource.name}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </label>

            <nav aria-label="Resources" className="hidden md:flex flex-col gap-6">
                {groups.map(group => (
                    <SidebarGroup key={group.id} group={group} selectedId={selectedId} onSelect={select} />
                ))}
            </nav>

            <div aria-live="polite">
                {resources.map(resource => (
                    <ResourceDetails key={resource.id} resource={resource} hidden={resource.id !== selectedId} />
                ))}
            </div>
        </div>
    );
};
