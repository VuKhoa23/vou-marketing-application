import React from 'react';
import { useSelector } from 'react-redux';
import VoucherForm from '../components/VoucherForm';
import EventForm from '../components/EventForm';
import PolicyPrivacy from '../components/PolicyPrivacy';
import { motion, AnimatePresence } from 'framer-motion';

const StepContent = ({ step }) => {
    switch (step) {
        case 1:
            return <EventForm />;
        case 2:
            return <VoucherForm />;
        case 3:
            return <PolicyPrivacy />;
        default:
            return null;
    }
};

function CollaborationRequest() {

    const currentStep = useSelector(state => state.step.currentStep);

    return (
        <>
            <h1 className='text-5xl font-bold mt-10 flex justify-center'> Đăng ký sự kiện</h1>
            <div className="flex justify-center items-center p-4">
                <ul className="steps">
                    <li
                        className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}
                    >
                        Thông tin sự kiện
                    </li>
                    <li
                        className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}
                    >
                        Chi tiết voucher
                    </li>
                    <li
                        className={`step ${currentStep === 3 ? 'step-primary' : ''}`}
                    >
                        Xác nhận và Chấp nhận
                    </li>
                </ul>
            </div>
            <div className="relative mb-16"> 
                <AnimatePresence>
                    <motion.div
                        key={currentStep}
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: '0%', opacity: 1 }}
                        exit={{ x: '-100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="relative"
                    >
                        <StepContent step={currentStep}/>
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
};

export default CollaborationRequest;
