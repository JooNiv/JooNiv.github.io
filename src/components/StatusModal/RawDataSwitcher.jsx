import React from 'react';
import { CRadioGroup, CRadio, CSwitch, CButton } from '@cscfi/csc-ui-react';
import { getCurrentRawData, copyToClipboard, downloadRawData } from '../../utils/sidebarUtils';

export const RawDataSwitcher = (props) => {

    const { viewState, updateViewState, metricsState, updateMetricsState,
        calibrationDataAll, deviceInfoData, deviceData, copySuccess, setCopySuccess,
        dataLoading } = props;

    // Copy to clipboard function
    const handleCopyToClipboard = async () => {
        const data = JSON.stringify(getCurrentRawData(viewState.rawDataType, calibrationDataAll, deviceInfoData), null, 2);
        await copyToClipboard(data, setCopySuccess);
    };

    // Download as JSON file
    const handleDownloadRawData = () => {
        const data = JSON.stringify(getCurrentRawData(viewState.rawDataType, calibrationDataAll, deviceInfoData), null, 2);
        downloadRawData(data, deviceData, viewState.rawDataType);
    };

    return (
        <div>
            <p className='font-bold mb-[2px]'>Data Type:</p>
            <CRadioGroup className='text-sm'
                hideMessage={true}
                onChange={(e) => updateViewState('rawDataType', e.detail)}
                value={viewState.rawDataType}
                inline={true}
            >
                <CRadio value='calibration_data'>Calibration Data</CRadio>
                <CRadio value='device_info'>Device Info</CRadio>
            </CRadioGroup>
            {viewState.rawDataType === 'calibration_data' &&
                <div className='mt-8 ml-2'>
                    <CSwitch
                        value={viewState.tableView}
                        onChange={(e) => updateViewState('tableView', e.detail)}
                    >
                        Table View
                    </CSwitch>
                </div>
            }
            {viewState.tableView && viewState.rawDataType === 'calibration_data' &&
                <>
                    <div className='mt-2 ml-2 flex flex-col'>
                        <CSwitch
                            value={viewState.qubitSwitch}
                            onChange={(e) => {
                                updateViewState('qubitSwitch', e.detail)
                            }}
                        >
                            Qubits
                        </CSwitch>
                    </div>
                    <div className='mt-2 ml-2 flex flex-col'>
                        <CSwitch
                            value={!viewState.qubitSwitch}
                            onChange={(e) => {
                                updateViewState('qubitSwitch', !e.detail)
                            }}
                        >
                            Couplers
                        </CSwitch>
                    </div>
                </>
            }
            <div className='flex flex-col gap-2 mb-2 mt-8 mr-8'>
                <div className={`flex flex-col gap-2`}>
                    <CButton
                        size="sm"
                        onClick={handleCopyToClipboard}
                        disabled={dataLoading}
                        className={`max-w-[200px] ${copySuccess ? 'bg-[#B9DC9C] text-[#204303]' : ''}`}
                    >
                        {copySuccess ? 'Copied!' : 'Copy'}
                    </CButton>
                    <CButton
                        size="sm"
                        className='max-w-[200px]'
                        disabled={dataLoading}
                        onClick={handleDownloadRawData}
                    >
                        Download
                    </CButton>
                </div>
            </div>
        </div>
    )
}