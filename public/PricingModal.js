import React from 'react';
import classNames from 'classnames';
import Modal from 'react-modal';
import Select, { components } from 'react-select';
import { useDispatch, useSelector, useState } from 'react-redux';
import { IoMdCloudDownload } from 'react-icons/io';
import Button from './Button';
import EarthRectangle from '../../assets/images/earth-rectangle.svg';
import keyReactangle from '../../assets/images/key-reactangle.svg';
import RefreshIcon from '../../assets/images/browser/refresh.svg';
import WarningIcon from '../../assets/images/warning-icon.svg';
import closeIcon from '../../assets/images/close-icon.svg';
import searchIcon from '../../assets/images/search-icon.svg';
import priceIcon from '../../assets/images/dashboard/price.svg';
import smallGlobe from '../../assets/images/small-globe.svg';
import checked from '../../assets/images/checked.svg';
import { useTranslation } from 'react-i18next';

import './PricingModal.scss';
import { useDaemonWebsocket } from '../../hooks/daemonWebsocket';
import { useNodeWebsocket } from '../../hooks/nodeWebsocket';
import { Utils } from '../../utils/utils';
import { CountryNames } from '../../configs/countries.js';

const PricingModal = ({
    isOpen,
    handleClose,
    shouldCloseOnOverlayClick = false,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel='PricingModal Modal'
            className='PricingModal'
            overlayClassName='Overlay'
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
            ariaHideApp={false}
            closeTimeoutMS={200}
        >
            <div
                className='close-button'
                onClick={handleClose}
                aria-hidden='true'
            >
                <img src={closeIcon} alt='close modal' />
            </div>
            <div className='PricingModal__container'>
                <div className='PricingModal__header'>
                    {/* <img src={priceIcon} alt="Price Icon" /> */}
                    <div>
                        <p>{'Pricing Modal'}</p>
                        <p>{'COMING SOON'}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PricingModal;
