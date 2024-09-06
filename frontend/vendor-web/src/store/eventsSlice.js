import { createSlice } from '@reduxjs/toolkit';

const eventsSlice = createSlice({
    name: 'events',
    initialState: [],
    reducers: {
        setEvents: (state, action) => {
            return action.payload;
        },
        addEvent: (state, action) => {
            state.push(action.payload);
        },
        updateEvent: (state, action) => {
            return state.map(event =>
                event.id === action.payload.id
                    ? { ...event, ...action.payload }
                    : event
            );
        },

    },
});

export const { setEvents, addEvent, updateEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
