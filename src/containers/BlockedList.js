/*global chrome*/
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Container from '@material-ui/core/Container';
import BlockedWebsite from '../components/BlockedWebsite';
import InputBox from '../components/InputBox';

const useStyles = makeStyles((theme) => ({
    listRoot: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
      },
  }));

// TODO: Display added websites as a list 
function BlockedList() {
    const [url, setUrl] = useState('');
    const [blockedObj, setBlockedObj] = useState({});

    useEffect(() => {
        chrome.storage.sync.get('blocked', (result) => {
            if (result) {
                setBlockedObj(result.blocked);
                console.log(JSON.stringify(blockedObj));
            }
        });
    }, []);

    const onSetUrlChange = (event) => {
        setUrl(event.target.value);
    }

    const handleAddWebsite = () => {
        const websiteToBlock = {[url]: true};
        // TODO: Sanitize url, so that we do not add duplicates
        const newBlockedObj = Object.assign({}, blockedObj, websiteToBlock);
        chrome.storage.sync.set({'blocked': newBlockedObj}, () => {
            chrome.runtime.sendMessage({type: "added website"});
            setBlockedObj(newBlockedObj);
        });
    }

    const handleRemoveWebsite = (id) => {
        const newBlockedObj = Object.assign({}, blockedObj);
        delete newBlockedObj[id];
        chrome.storage.sync.set({'blocked': newBlockedObj}, () => {
            chrome.runtime.sendMessage({type: "remove website", payload: id});
            setBlockedObj(newBlockedObj);
        });
    }

    const handleDeleteAll = () => {
        chrome.storage.sync.remove("blocked", () => {
            console.log("Removed all from blocked");
        })
    }

    const classes = useStyles();

    return (
        <>
        <Container maxWidth="lg">
            <InputBox handleAddWebsite={handleAddWebsite} onSetUrlChange={onSetUrlChange}></InputBox>
            <List className={classes.listRoot}>
                {blockedObj && Object.keys(blockedObj).map((value) => {
                    const labelId = `website=url-${value}`;
                    return (
                        <BlockedWebsite labelId={labelId} value={value} handleRemoveWebsite={handleRemoveWebsite} ></BlockedWebsite>
                    );
                })}
            </List>
            <button
                id="deleteAll"
                onClick={handleDeleteAll}
            >
                Remove All
            </button>
        </Container>
        </>
    )
}

export default BlockedList;