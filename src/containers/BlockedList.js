/*global chrome*/
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Container from '@material-ui/core/Container';
import BlockedWebsite from '../components/BlockedWebsite';
import InputBox from '../components/InputBox';
import Button from '@material-ui/core/Button';

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

    const sanitizeUrl = (url) => {
    }

    const handleAddWebsite = () => {
        let validUrl = isValidUrl(url);
        if (validUrl) {
            const websiteToBlock = {[url.slice(4)]: true};
            // TODO: Sanitize url, so that we do not add duplicates
            const newBlockedObj = Object.assign({}, blockedObj, websiteToBlock);
            chrome.storage.sync.set({'blocked': newBlockedObj}, () => {
                chrome.runtime.sendMessage({type: "added website"});
                setBlockedObj(newBlockedObj);
            });
        } else {
            alert("Invalid url, please use the following format: www.twitter.com");
        }
    }

    const isValidUrl = (url) => {
        // TODO: Make this less restrictive
        let validUrl = new RegExp('^w{3}\.{1}.+\.{1}[a-z]+$');
        return validUrl.test(url);
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
            chrome.runtime.sendMessage({type: "remove website"});
            setBlockedObj({});
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
            <Button id="deleteAll" variant="contained" color="secondary" disableElevation onClick={handleDeleteAll}>
                Remove All
            </Button>
        </Container>
        </>
    )
}

export default BlockedList;