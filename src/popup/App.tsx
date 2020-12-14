import React, { useState, useEffect } from "react";
import { messageBackgroundAction, initializePopUp } from '../background/actions';
import { InitializePopUpResponse } from '../types';



const App = () => {
    const [message, setMessage] = useState('');
    useEffect(() => {
        messageBackgroundAction(
            initializePopUp("hello"),
            (response: InitializePopUpResponse) => {
                const { id } = response.payload;
                setMessage(id)
            });
    }, [])

    return <div>Hello, {message}</div>
};

export default App;