import { createAsyncThunk } from '@reduxjs/toolkit';

export const submitAllForms = createAsyncThunk(
    'forms/submitAllForms',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:8080/api/brand/event/add/event-and-voucher?brandId=1', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                console.error('Error response:', errorText);
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            //return await response.json();
        } catch (error) {
            console.error('Submission error:', error);
            return rejectWithValue(error.message);
        }
    }
);
