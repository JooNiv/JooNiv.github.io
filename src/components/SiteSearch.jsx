import React, { useState, useEffect, useCallback } from 'react';
import { mdiMagnify, mdiArrowRight, mdiClose } from '@mdi/js';
import {
  CButton, CPagination, CIcon, CCheckbox, CModal, CCard,
  CCardTitle, CCardContent, CCardActions
} from '../lib/cscUi.js';
import { prependBaseURL } from '../utils/url';
import { capitalizeFirstLetter } from "../utils/textUtils";
import DOMPurify from 'dompurify';

const styleArrow = {
  "--_c-button-font-size": 14,
  "--_c-button-min-width": 0,
  "--_c-button-height": "auto",
  "--_c-icon-color": "var(--c-primary)"
};

const TYPE_CATEGORIES = {
  page: 'general',
  blog: 'blogs',
  news: 'blogs',
  instructions: 'blogs',
  'resource call': 'blogs',
  post: 'blogs',
  event: 'events'
};

let pagefindPromise;
const loadPagefind = () => pagefindPromise ??= import(/* @vite-ignore */ prependBaseURL('/pagefind/pagefind.js'));

async function searchContent(query) {
  const categorizedResults = { general: [], blogs: [], events: [] };
  if (!query.trim()) return categorizedResults;

  const pagefind = await loadPagefind();
  const search = await pagefind.search(query.trim());
  const pages = await Promise.all((search?.results || []).map(result => result.data()));

  pages
    .map(page => ({
      title: page.meta.title,
      url: page.url,
      excerpt: DOMPurify.sanitize(page.excerpt, { ALLOWED_TAGS: ['mark'] }),
      type: (page.meta.type || 'page').toLowerCase(),
      tags: page.meta.tags ? page.meta.tags.split(', ') : [],
      date: page.meta.date,
      link: page.meta.link,
      newestCall: page.meta.newest_call === 'true',
    }))
    .sort((a, b) => b.newestCall - a.newestCall)
    .forEach(item => {
      categorizedResults[TYPE_CATEGORIES[item.type] || 'general'].push(item);
    });

  return categorizedResults;
}

const SearchBar = ({ setResults, setQuery, query }) => {
  const handleSearchBar = (e) => {
    const input = e.target.value;
    setQuery(input);
  };

  const handleClose = () => {
    setQuery("");
    setResults({ general: [], blogs: [], events: [] });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const input = query;
    if (input.trim() !== "") {
      const searchResults = await searchContent(input);
      setResults(searchResults);
    } else {
      setResults({ general: [], blogs: [], events: [] });
    }
  }

  return (
    <div className='flex flex-row items-center w-full min-h-[42px]'>
      <span className='flex mx-3 text-on-surface'><CIcon size={24} path={mdiMagnify} /></span>
      <form onSubmit={handleSubmit} className='w-full mr-3'>
        <input onChange={handleSearchBar} className="w-full focus:outline-hidden" placeholder="Search..." type="text" id="search-box" name="query" value={query} />
      </form>
      <span className='flex mx-3 text-on-surface cursor-pointer' onClick={() => handleClose()}><CIcon size={24} path={mdiClose} /></span>
      <span className='flex mr-3'><CButton onClick={handleSubmit} size='small' ghost>Search</CButton></span>
    </div>
  )

}

const ResultArea = ({ paginationOptions, setOptions, results, type, href, id }) => {
  // Track last page to prevent scroll on results update
  const lastPageRef = React.useRef(paginationOptions.currentPage);

  const handlePageChange = (setOptions) => (event) => {
    setOptions(prev => ({ ...prev, currentPage: event.detail.currentPage }));
  };

  // Only scroll when user triggers page change, not when results update
  const onPageChange = (setOptions) => (event) => {
    handlePageChange(setOptions)(event);
    // Only scroll if the page actually changed
    if (event.detail.currentPage !== lastPageRef.current) {
      lastPageRef.current = event.detail.currentPage;
      const thisElement = document.getElementById(id);
      if (thisElement) {
        const yOffset = -80; // Account for navbar
        const y = thisElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  React.useEffect(() => {
    // Keep ref in sync with external page changes (e.g. results update)
    lastPageRef.current = paginationOptions.currentPage;
  }, [paginationOptions.currentPage]);

  return (
    <div id={id} className='mb-8 text-on-surface'>
      {results[type].length !== 0 &&
        <div>
          <div className='flex flex-row pt-2'>
            <h1 className='mb-6 mr-3 text-xl font-bold'>{capitalizeFirstLetter(type)}</h1>
            {type !== "general" &&
              <a href={href} >
                <CIcon style={styleArrow} className='pt-1 text-primary' path={mdiArrowRight} />

              </a>
            }
          </div>
          <ul>
            {results[type].slice((paginationOptions.currentPage - 1) *
              paginationOptions.itemsPerPage, (paginationOptions.currentPage - 1) *
              paginationOptions.itemsPerPage + paginationOptions.itemsPerPage).map((item, index) => (
                <li className='pb-6' key={index}>
                  <strong><a className='text-primary hover:underline' href={type === "events" ? item.link : prependBaseURL(item.url)}>{item.title}</a></strong><br />
                  <div className='flex flex-row'>
                    <p className='font-semibold'>{capitalizeFirstLetter(item.type)}</p>
                    {type !== "general" &&
                      <p> &nbsp;&nbsp; | &nbsp;&nbsp;{item?.date}</p>
                    }
                  </div>
                  {type !== "general" &&
                    <span dangerouslySetInnerHTML={{ __html: item.excerpt }} />
                  }
                </li>
              ))}
          </ul>
          <CPagination
            value={paginationOptions}
            hideDetails
            onChangeValue={onPageChange(setOptions)}
            control
          />
        </div>
      }
    </div>
  )
}

const Filters = ({ filters, handleCheckboxChange }) => {
  return (
    <div className='text-on-surface'>
      <p className='font-semibold mb-[16px]'>Results type</p>
      <div className='ml-[-10px] flex flex-col'>
        {Object.keys(filters).map(option => (
          <CCheckbox
            className='flex flex-col'
            hide-details={true}
            hideDetails
            key={option}
            checked={filters[option]}
            onChangeValue={() => handleCheckboxChange(option)}
          >
            <p className='text-sm'>{option}</p>
          </CCheckbox>
        ))}
      </div>
    </div>
  );
};

const FilterModal = ({ isModalOpen, setIsModalOpen, filters, handleCheckboxChange }) => {

  return (
    <CModal
      aria-label="Search filters"
      key={isModalOpen ? 'open' : 'closed'}

      value={isModalOpen}
      dismissable
      onChangeValue={event => setIsModalOpen(event.detail)}
    >
      <CCard style={{ "overflow": "scroll" }} className='overflow-scroll max-h-[80vh]'>
        <CCardTitle>Filters</CCardTitle>
        <CCardContent>
          <Filters filters={filters} handleCheckboxChange={handleCheckboxChange} />
        </CCardContent>
        <CCardActions justify='end'>
          <CButton onClick={() => setIsModalOpen(false)} text>Close</CButton>
        </CCardActions>
      </CCard>
    </CModal>
  )
};

function setLocalStorageState(key, value, minutes) {
  const expires = Date.now() + minutes * 60 * 1000;
  localStorage.setItem(key, JSON.stringify({ value, expires }));
}

function getLocalStorageState(key) {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    const { value, expires } = JSON.parse(item);
    if (Date.now() > expires) {
      localStorage.removeItem(key);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

export const SiteSearch = () => {

  const [isModalOpen, setIsModalOpen] = useState(false); //modal control
  const [results, setResults] = useState({ general: [], blogs: [], events: [] });
  const [filteredResults, setFilteredResults] = useState(results);
  const [searchCount, setSearchCount] = useState(-1);
  const [filters, setFilters] = useState({
    "Blog": false,
    "Event": false,
    "Instructions": false,
    "News": false,
    "Resource Call": false,
    "General information": false,
  }); //filter state

  const [paginationOptionsGen, setOptionsGen] = useState({
    itemCount: 5,
    itemsPerPage: 5,
    currentPage: 1,
    pageSizes: [5, 10, 15, 25, 50]
  });

  const [paginationOptionsBlog, setOptionsBlog] = useState({
    itemCount: 5,
    itemsPerPage: 5,
    currentPage: 1,
    pageSizes: [5, 10, 15, 25, 50]
  });

  const [paginationOptionsEvent, setOptionsEvent] = useState({
    itemCount: 5,
    itemsPerPage: 5,
    currentPage: 1,
    pageSizes: [5, 10, 15, 25, 50]
  });

  const [query, setQuery] = useState("");

  useEffect(() => {
    document.body.classList.add("min-w-fit")
  })

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
    // Always clean up on unmount
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isModalOpen]);

  useEffect(() => {
    setFilteredResults(results)
    setOptionsGen(prev => ({ ...prev, itemCount: results.general.length }));
    setOptionsBlog(prev => ({ ...prev, itemCount: results.blogs.length }));
    setOptionsEvent(prev => ({ ...prev, itemCount: results.events.length }));
  }, [results]);

  // Try to load from localStorage on mount
  useEffect(() => {
    let params = new URLSearchParams(document.location.search);
    let initSearch = params.get("search");
    if (initSearch && initSearch.trim() !== "") {
      setQuery(initSearch);
      searchContent(initSearch).then(setResults);
    }
    else{
      const state = getLocalStorageState('siteSearchState');
      if (state && state.query !== undefined && state.filters) {
        setFilters(state.filters);
        setQuery(state.query);
        if (state.query && state.query.trim() !== "") {
          searchContent(state.query).then(setResults);
        }
      }
    }
  }, []);

  // Save to localStorage on query or filter change
  useEffect(() => {
    setLocalStorageState('siteSearchState', { query, filters }, 30);
  }, [query, filters]);

  const handleFilterChange = (newFilters, type) => {
    setFilters(newFilters);
    if (type === "general") {
      setOptionsGen(prev => ({ ...prev, currentPage: 1 }));
    }
    else if (type === "blogs") {
      setOptionsBlog(prev => ({ ...prev, currentPage: 1 }));
    }
    else {
      setOptionsEvent(prev => ({ ...prev, currentPage: 1 }));
    }
  };

  const handleCheckboxChange = useCallback((option) => {
    handleFilterChange({
      ...filters,
      [option]: !filters[option] //toggle the state
    });
  }, [filters, handleFilterChange]);

  useEffect(() => {
    const applyFilters = (item) => {

      const activeFilters = Object.keys(filters).filter(key => filters[key]);

      if (activeFilters.length === 0) return true;

      return activeFilters.some(filter => {
        const filterLower = filter.toLowerCase();
        if (filterLower === "blog" && item.type === "blog") return true;
        if (filterLower === "event" && item.type === "event") return true;
        if (filterLower === "general information" && item.type === "page") return true;
        if (filterLower === "instructions" && item.type == "instructions") return true;
        if (filterLower === "news" && item.type == "news") return true;
        if (filterLower === "resource call" && item.type == "resource call") return true;

        return false;
      });
    };

    const filtered = {
      general: results.general.filter(applyFilters),
      blogs: results.blogs.filter(applyFilters),
      events: results.events.filter(applyFilters)
    };
    setFilteredResults(filtered);
    setOptionsGen(prev => ({ ...prev, itemCount: filtered.general.length }));
    setOptionsBlog(prev => ({ ...prev, itemCount: filtered.blogs.length }));
    setOptionsEvent(prev => ({ ...prev, itemCount: filtered.events.length }));
    setSearchCount(searchCount + 1);
  }, [filters, results]);

  const onOpenDialog = () => { //modal control
    setIsModalOpen(true);
  };

  return (
    <div className='text-on-surface min-[2600px]:mx-auto min-[2600px]:max-w-[50vw] mx-2 sm:mx-8 lg:mx-[100px] lg:grid grid-cols-5 gap-0'>
      <div className='mt-24 hidden lg:block lg:sticky lg:top-16 lg:self-start z-10'>
        <Filters filters={filters} handleCheckboxChange={handleCheckboxChange} />
      </div>

      <div className='mt-24 col-span-5 lg:col-span-3'>
        <div className='mb-2 lg:mb-20 border-2 border-on-surface min-h-[45px] flex flex-row items-center text-lg'>
          <SearchBar setResults={setResults} setQuery={setQuery} query={query} />
        </div>
        <div>
          <CButton
            className='mb-8 inline-flex items-center py-2 lg:hidden'
            onClick={() => onOpenDialog()}
          >
            Filters
          </CButton>
        </div>
        <div>
          {
            (Object.keys(filteredResults).every(key => filteredResults[key].length === 0) && searchCount > 0) &&
            <p>No results found</p>
          }

          <ResultArea paginationOptions={paginationOptionsGen} setOptions={setOptionsGen} results={filteredResults} type={"general"} href={""} id="general" />

          <ResultArea paginationOptions={paginationOptionsBlog} setOptions={setOptionsBlog} results={filteredResults} type={"blogs"} href={prependBaseURL("/publications")} id="blogs" />

          <ResultArea paginationOptions={paginationOptionsEvent} setOptions={setOptionsEvent} results={filteredResults} type={"events"} href={prependBaseURL("/events")} id="events" />

        </div>
      </div>
      <FilterModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange} />
    </div>
  );
};