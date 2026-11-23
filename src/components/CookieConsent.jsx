import React, { useEffect, useState } from 'react'

import { CModal, CCard, CCardTitle, CCardContent, CButton } from '@cscfi/csc-ui-react'

export const CookieModal = props => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const chapters = props.chapters || [];

    useEffect(() => {
        const cookieConsent = document.cookie
            .split('; ')
            .find(row => row.startsWith('cookie_consent='));

        if (!cookieConsent) {
            setIsModalOpen(true);
            return;
        }

        const consentValue = cookieConsent.split('=')[1];
        if (consentValue === 'true' || consentValue === 'false') {
            setIsModalOpen(false);
        } else {
            setIsModalOpen(true);
        }
    }, []);

    // Unified close handler
    const closeModal = () => setIsModalOpen(false);

    const clickOutside = () => {
        if (isModalOpen) {
            closeModal();
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            document.cookie = `cookie_consent=false; path=/; expires=${expiryDate.toUTCString()}`;
        }
    }

    const handleAcceptCookies = () => {
        closeModal();
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `cookie_consent=true; path=/; expires=${expiryDate.toUTCString()}`;
    }
    const handleDeclineCookies = () => {
        closeModal();
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            // Only delete cookies for the rahtiapp domain
            if (name.endsWith('.rahtiapp.fi')) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.rahtiapp.fi`;
            }
        }
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `cookie_consent=false; path=/; expires=${expiryDate.toUTCString()}`;
    }

    return (
        <CModal
            aria-label="Cookie consent"
            key={isModalOpen ? 'open' : 'closed'}
            value={isModalOpen}
            dismissable
            onUpdateValue={() => clickOutside()}
        >
            <CCard className='overflow-auto max-h-[85vh]'>
                <CCardTitle className='text-on-surface font-bold' >Cookie consent</CCardTitle>
                <CCardContent className='p-8'>
                    <h3 className='text-on-surface text-[32px]'>{props.title}</h3>
                    {chapters.map((chapter, index) => (
                        <div key={index}>
                            <p className='text-on-surface'>{chapter.text}</p>
                        </div>
                    ))}

                    <a className='text-fiqci-link hover:underline' href="/cookies">Cookie policy</a>
                    <div className='flex flex-col md:flex-row justify-around gap-4'>
                        <CButton
                            className='grow text-white bg-[#0D2B53] hover:bg-blue-600'
                            no-radius
                            size="large"
                            onClick={handleDeclineCookies} text>Decline
                        </CButton>
                        <CButton
                            className='grow text-white bg-[#0D2B53] hover:bg-blue-600'
                            no-radius
                            size="large"
                            onClick={handleAcceptCookies} text>Accept
                        </CButton>
                    </div>
                </CCardContent>
            </CCard>
        </CModal>
    );
};

export const CookieModalManual = props => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => setIsModalOpen(false);

    const chapters = props.chapters || [];

    const handleAcceptCookies = () => {
        closeModal();
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `cookie_consent=true; path=/; expires=${expiryDate.toUTCString()}`;
    }
    const handleDeclineCookies = () => {
        closeModal();
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            // Only delete cookies for the rahtiapp domain
            if (name.endsWith('.rahtiapp.fi')) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.rahtiapp.fi`;
            }
        }
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `cookie_consent=false; path=/; expires=${expiryDate.toUTCString()}`;
    }

    return (
        <div>
            <a className='text-fiqci-link hover:underline' onClick={() => setIsModalOpen(true)}>Open Cookie Consent popup</a>
            <CModal
                aria-label="Cookie consent"
                key={isModalOpen ? 'open' : 'closed'}
                value={isModalOpen}
                dismissable
                onUpdateValue={() => closeModal()}
            >
                <CCard className='overflow-scroll scroll-smooth max-h-[85vh]'>
                    <CCardTitle className='text-on-surface font-bold' >Cookie consent</CCardTitle>
                    <CCardContent className='p-8'>
                        <h3 className='text-on-surface text-[32px]'>{props.title}</h3>
                        {chapters.map((chapter, index) => (
                            <div key={index}>
                                <p className='text-on-surface'>{chapter.text}</p>
                            </div>
                        ))}
                        <a className='text-fiqci-link hover:underline' href="/cookies">Cookie policy</a>
                        <div className='flex flex-col md:flex-row justify-around gap-4'>
                            <CButton
                                className='grow text-white bg-[#0D2B53] hover:bg-blue-600'
                                no-radius
                                size="large"
                                onClick={handleDeclineCookies} text>Decline
                            </CButton>
                            <CButton
                                className='grow text-white bg-[#0D2B53] hover:bg-blue-600'
                                no-radius
                                size="large"
                                onClick={handleAcceptCookies} text>Accept
                            </CButton>
                        </div>
                    </CCardContent>
                </CCard>
            </CModal>
        </div>

    );
};
