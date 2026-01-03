export const formConfig = {
    customerName: {
        required: true,
        labelKey: 'customerName',
        validation: {
            required: true,
            minLength: 3,
            errorMessage: 'Name must be at least 3 characters'
        }
    },
    mobileNumber: {
        required: true,
        labelKey: 'mobileNumber',
        validation: {
            required: true,
            pattern: /^[0-9]{10}$/,
            errorMessage: 'Valid 10-digit mobile number required'
        }
    },
    // Other fields can be added here without validation rules if not needed
    itemName: { required: false },
    quantity: { required: false },
    totalAmount: { required: false },
    advanceAmount: { required: false },
    deliveryDate: { required: false }
};
