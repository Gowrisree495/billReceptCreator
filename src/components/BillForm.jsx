import React from 'react';
import SmartRow from './SmartRow';
import { formConfig } from '../formConfig';

const BillForm = ({ data, t, actions, activeField, errors }) => {
    return (
        <main className="p-4 space-y-4 max-w-lg mx-auto">

            <SmartRow
                label={t.customerName}
                value={data.customerName}
                onChange={(e) => actions.handleChange('customerName', e.target.value)}
                icon="person"
                onMicClick={() => actions.handleMicClick('customerName')}
                isListening={activeField === 'customerName'}
                onClick={() => actions.speakPrompt('customerName')}
                error={errors?.customerName}
                required={formConfig.customerName.required}
            />

            <SmartRow
                label={t.mobileNumber}
                value={data.mobileNumber}
                onChange={(e) => actions.handleChange('mobileNumber', e.target.value)}
                icon="smartphone"
                type="tel"
                onMicClick={() => actions.handleMicClick('mobileNumber')}
                isListening={activeField === 'mobileNumber'}
                onClick={() => actions.speakPrompt('mobileNumber')}
                error={errors?.mobileNumber}
                required={formConfig.mobileNumber.required}
            />

            <SmartRow
                label={t.itemName}
                value={data.itemName}
                onChange={(e) => actions.handleChange('itemName', e.target.value)}
                icon="shopping_bag"
                onMicClick={() => actions.handleMicClick('itemName')}
                isListening={activeField === 'itemName'}
                onClick={() => actions.speakPrompt('itemName')}
            />

            <SmartRow
                label={t.quantity}
                value={data.quantity}
                onChange={(e) => actions.handlePositiveNumberChange('quantity', e.target.value)}
                icon="format_list_numbered"
                type="number"
                onMicClick={() => actions.handleMicClick('quantity')}
                isListening={activeField === 'quantity'}
                onClick={() => actions.speakPrompt('quantity')}
            />

            <SmartRow
                label={t.totalAmount}
                value={data.totalAmount}
                onChange={(e) => actions.handlePositiveNumberChange('totalAmount', e.target.value)}
                icon="currency_rupee"
                type="number"
                onMicClick={() => actions.handleMicClick('totalAmount')}
                isListening={activeField === 'totalAmount'}
                onClick={() => actions.speakPrompt('totalAmount')}
            />

            <SmartRow
                label={t.advanceAmount}
                value={data.advanceAmount}
                onChange={(e) => actions.handlePositiveNumberChange('advanceAmount', e.target.value)}
                icon="payment"
                type="number"
                onMicClick={() => actions.handleMicClick('advanceAmount')}
                isListening={activeField === 'advanceAmount'}
                onClick={() => actions.speakPrompt('advanceAmount')}
            />

            <SmartRow
                label={t.deliveryDate}
                value={data.deliveryDate}
                onChange={(e) => actions.handleChange('deliveryDate', e.target.value)}
                icon="event"
                type="date"
                isListening={false}
                iconColor="text-purple-500"
            />

        </main>
    );
};

export default BillForm;
