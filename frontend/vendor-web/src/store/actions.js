export const submitAllForms = (data) => {
    return async (dispatch) => {
        try {
            const response = await fetch('api/brand/event/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Submit successful:', result); 
            } else {
                console.error('Submit failed');
            }
        } catch (error) {
            console.error('Error submitting forms:', error);
        }
    };
};
