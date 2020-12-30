import React, { useState } from 'react';

function InputBox() {
    const [url, setUrl] = useState('');

    const onSetUrlChange = (event) => {
        setUrl(event.target.value);
        console.log(`url ${url}`);
    }

    const handleAddWebsite = () => {
        console.log(`adding ${url} to blocked`);
    }

    return (
        <>
            <input
                id="inputBlockWebsite"
                type='text'
                placeholder='url'
                onChange={onSetUrlChange}
            />
            <button 
                id ="addWebsite"
                type="button"
                onClick={handleAddWebsite} >
                Add Website to Blocked List
            </button>
        </>
    )
}

export default InputBox;