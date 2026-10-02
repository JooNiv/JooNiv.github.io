import React from 'react';
import { CCard, CIcon, CCardContent } from '../lib/cscUi.js';
import { mdiArrowRight } from '@mdi/js';
import { prependBaseURL } from '../utils/url';
import { hideOldCalls } from '../utils/resourceCalls';

export const BlogCardComponent = props => {
    const type = props?.filters?.Type;
    return (
        <CCard className="flex flex-auto flex-col flex-wrap border border-gray-200 dark:border-border rounded-none shadow-md overflow-hidden hover:shadow-lg p-0 m-0 w-full"> {/* Adjusted card width */}
            <img src={props.teaser} alt="Logo" className="w-full h-28 scale-125 object-cover m-0 p-0" />
            <CCardContent className="flex flex-col border-none m-0">
                <div>
                    <a href={props.url.split(".")[0]}
                        className="text-on-surface hover:underline font-bold">
                        <div>
                            {props.title.length >= 89 ? props.title.slice(0, 90) + "..." : props.title}
                        </div>
                    </a>
                    <p className="text-sm text-gray-500 dark:text-on-surface-muted pb-2 pt-1">
                        {type} | {props.date}
                    </p>
                </div>
            </CCardContent>
        </CCard>
    );
};

export const BlogCards = ({ publications }) => {
    return (
        <div className="min-[2600px]:mx-auto min-[2600px]:max-w-[50vw]">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              { hideOldCalls(publications).slice(-4).reverse().map(({ key, ...blog }) => <BlogCardComponent key={key} {...blog} />) }
            </div>
            <div className="mt-4">
                <a
                    href={prependBaseURL("/publications/")}
                    className="text-fiqci-link hover:underline font-bold"
                >
                    <div className="mx-2 sm:mx-0 flex items-center gap-3">
                        <div className="text-sm">All blogs and instructions</div>
                        <CIcon className="text-lg" path={mdiArrowRight} />
                    </div>
                </a>
            </div>
        </div>
    );
};
