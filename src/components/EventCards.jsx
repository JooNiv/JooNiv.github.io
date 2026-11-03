import '../lib/cscUiTheme.js'
import React from 'react';
import { CCard, CIcon, CCardContent } from '@cscfi/csc-ui-react';
import { mdiArrowRight, mdiOpenInNew } from '@mdi/js';
import { prependBaseURL } from '../utils/url';

export const EventCardComponent = props => {
    return (
        <CCard className="flex flex-auto flex-col border border-gray-200 dark:border-border rounded-none shadow-md hover:shadow-lg p-0 m-0"> {/* Adjusted card width */}
            <CCardContent className="flex flex-col border-none m-0">
                <div className='my-3'>
                    <a
                        href={props.url}
                        className="text-md text-on-surface hover:underline font-bold"
                    >
                        <div className='flex justify-between text-on-surface'>
                            {props.title}
                            <CIcon className="text-lg" path={mdiOpenInNew} />
                        </div>
                    </a>
                    <p className="text-sm text-gray-500 dark:text-on-surface-muted pb-2 pt-1">
                        {props.content.split(":")[0]}
                    </p>
                    <p>
                        {props.content.split(":")[1].slice(0,90) + "..."}
                    </p>
                </div>
            </CCardContent>
        </CCard>
    );
};



export const EventCards = ({ events }) => {
    return (
        <div className="min-[2600px]:mx-auto min-[2600px]:max-w-[50vw]">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              { events.slice(-4).reverse().map(({ key, ...event }) => <EventCardComponent key={key} {...event} />) }
            </div>
            <div className="mt-4">
            <a
                    href={prependBaseURL("/events/")}
                    className="text-fiqci-link hover:underline font-bold"
                >
                    <div className="mx-2 sm:mx-0 flex items-center gap-3">
                        <div className="text-sm">All events</div>
                        <CIcon className="text-lg" path={mdiArrowRight} />
                    </div>
                </a>
            </div>
        </div>
    );
};
