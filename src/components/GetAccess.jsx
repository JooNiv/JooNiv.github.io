import React from "react";
import { prependBaseURL } from '../utils/url';
import { Alerts } from './Alerts.jsx';
import { ResourceExplorer } from './ResourceExplorer.jsx';

export const GetAccess = props => {
    const getting_started = props?.getting_started

    return (
        <div className="flex flex-col gap-8 pt-[24px] pb-20 text-on-surface">
            <div>
                <h2>Getting Started</h2>

                <p className="pt-4">{getting_started?.text} <a className="text-base text-fiqci-link hover:underline" href={getting_started?.link.href}>{getting_started?.link.title}</a></p>

                <p className="pt-4">Please see status of services from <a className="text-base text-fiqci-link hover:underline" href={prependBaseURL("/status")}>Status</a> -page.</p>
            </div>

            <Alerts alerts={props.alerts} />

            <div className="flex flex-col gap-6">
                <h2>Resources</h2>
                <ResourceExplorer
                    quantum={props.quantum_resources}
                    supercomputers={props.supercomputer_resources}
                    emulation={props.emulation_resources}
                />
            </div>
        </div>
    );
};
