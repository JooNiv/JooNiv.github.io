import React from 'react'

import { CModal } from '@cscfi/csc-ui-react';

import { ModalContent } from './StatusModalConent';

export const StatusModal = (props) => {
    return (
        <CModal
            aria-label={props.name}
            className="modal-wide"
            value={props.isModalOpen}
            dismissable
            onUpdateValue={e => props.setIsModalOpen(e.detail)}
        >
            <ModalContent {...props} />
        </CModal>
    );

}
