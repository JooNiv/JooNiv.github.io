import React from 'react';
import { CIcon } from '../lib/cscUi.js';
import { mdiArrowRight } from '@mdi/js';
import { BlogCardComponent } from './BlogCards';
import { prependBaseURL } from '../utils/url';

export const ReadNext = ({ title, publications }) => {
    const others = publications.filter(blog => blog.title !== title)
    const blogs = others.slice(-6).reverse()
    return (
        <>
            <div className='flex lg:hidden'>
                <div className='w-full'>
                    <h2 className='text-on-surface pt-8 pb-4'>Read next</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
                        {blogs.map(({ key, ...blog }) => <BlogCardComponent key={key} {...blog} />)}
                    </div>
                </div>
            </div>
            <div className='hidden lg:block bg-[#E5F2F8] dark:bg-surface-muted px-10 p-10 ml-0 lg:overflow-hidden!'>
                <h3 className='mb-10! text-[24px] font-bold!'>Read next:</h3>
                {others.slice(-5).map((blog, index) => (
                    <div key={index}>
                        <div className='flex flex-col gap-2 mb-4'>
                            <a href={blog.url.split(".")[0]} className='text-sm text-black-500 hover:underline font-bold'>
                                <h4 className='text-base text-fiqci-link! font-bold!'>{blog.title.length >= 89 ? blog.title.slice(0, 90) + "..." : blog.title}</h4>
                            </a>
                            <p className='text-gray-500 dark:text-on-surface-muted'>{blog.type} | {blog.date}</p>
                        </div>
                    </div>
                ))}

                <div className="mt-4 flex justify-end">
                    <a
                        href={prependBaseURL("/publications/")}
                        className="text-fiqci-link hover:underline font-bold"
                    >
                        <div className="flex items-center gap-3">
                            <p className='text-base text-fiqci-link!' >See all</p>
                            <CIcon className="text-fiqci-link" path={mdiArrowRight} />
                        </div>
                    </a>
                </div>

            </div>
        </>
    )
}