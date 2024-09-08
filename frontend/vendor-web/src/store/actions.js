import { createAsyncThunk } from '@reduxjs/toolkit';

export const submitAllForms = createAsyncThunk(
    'forms/submitAllForms',
    async ({ formData, triviaTime }, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost/api/brand/event/add/event-and-voucher?brandId=1', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Event response:', errorText);
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            const data = await response.json();

            if (triviaTime !== null) {
                const response = await fetch("http://localhost/api/brand/game/create-game", {
                    method: "POST",
                    body: JSON.stringify({
                        event_id: data.eventId,
                        start_time: String(triviaTime).replace('T', ' ') + ':00',
                        type: "trivia",
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Game response:', errorText);
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }
                else {
                    console.log('yup')
                }
            }
        } catch (error) {
            console.error('Submission error:', error);
            //return rejectWithValue(error.message);
        }
    }
);
