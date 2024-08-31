import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import RNShake from 'react-native-shake';

const ShakeComponent = () => {
    useEffect(() => {
        const subscription = RNShake.addListener(() => {
            Alert.alert('Shake detected!');

        });

        // Cleanup subscription on unmount
        return () => {
            subscription.remove();
        };
    }, []);

    return null;
};

export default ShakeComponent;
