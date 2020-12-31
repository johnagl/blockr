/*global chrome*/
import React, { useState, useEffect } from 'react';

function InputBox() {
    const [url, setUrl] = useState('');
    const [blockedObj, setBlockedObj] = useState({});

    useEffect(() => {
        chrome.storage.sync.get('blocked', (result) => {
            console.log(`result useEffect ${JSON.stringify(result)}`);
            if (result) {
                setBlockedObj(result);
            }
        });
    }, []);

    const onSetUrlChange = (event) => {
        setUrl(event.target.value);
        console.log(`url ${url}`);
    }

    const handleAddWebsite = () => {
        console.log(`adding ${url} to blocked`);
        const websiteToBlock = {[url]: true};
        console.log(`websiteToBlock ${JSON.stringify(websiteToBlock)}`);
        const newBlockedObj = Object.assign({}, blockedObj, websiteToBlock);
        console.log(`newBlockedObj ${newBlockedObj}`);
        chrome.storage.sync.set({'blocked': newBlockedObj}, () => {
            console.log(`result after adding ${newBlockedObj}`);
        });
    }

    const handleDeleteAll = () => {
        chrome.storage.sync.remove("blocked", () => {
            console.log("Removed all from blocked");
        })
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
            <button
                id="deleteAll"
                onClick={handleDeleteAll}
            >
            </button>
        </>
    )
}

export default InputBox;