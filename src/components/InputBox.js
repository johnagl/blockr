/*global chrome*/
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import AddIcon from '@material-ui/icons/Add';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import CommentIcon from '@material-ui/icons/Comment';

import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px'
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    listRoot: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
      },
  }));

// TODO: Display added websites as a list 
function InputBox() {
    const [url, setUrl] = useState('');
    const [blockedObj, setBlockedObj] = useState({});

    useEffect(() => {
        chrome.storage.sync.get('blocked', (result) => {
            console.log(`result useEffect ${JSON.stringify(result.blocked)}`);
            if (result) {
                setBlockedObj(result.blocked);
                console.log(JSON.stringify(blockedObj));
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
        // TODO: Sanitize url, so that we do not add duplicates
        // TODO: Maybe remove the www. or https//: 
        const newBlockedObj = Object.assign({}, blockedObj, websiteToBlock);
        console.log(`newBlockedObj ${newBlockedObj}`);
        chrome.storage.sync.set({'blocked': newBlockedObj}, () => {
            console.log(`result after adding ${JSON.stringify(newBlockedObj)}`);
            chrome.runtime.sendMessage({type: "added website"});
            setBlockedObj(newBlockedObj);
        });
    }

    const handleRemoveWebsite = (id) => {
        console.log(`remove ${id}`);
        const newBlockedObj = Object.assign({}, blockedObj);
        delete newBlockedObj[id];
        console.log(JSON.stringify(newBlockedObj));
        chrome.storage.sync.set({'blocked': newBlockedObj}, () => {
            console.log(`result after removing ${JSON.stringify(newBlockedObj)}`);
            chrome.runtime.sendMessage({type: "remove website", payload: id});
            setBlockedObj(newBlockedObj);
        });
    }

    // const handleAddWebsite = () => {
    //     console.log(`adding ${url} to blocked`);
    //     const websiteToBlock = {[url]: true};
    //     console.log(`websiteToBlock ${JSON.stringify(websiteToBlock)}`);
    //     // TODO: Sanitize url, so that we do not add duplicates
    //     // TODO: Maybe remove the www. or https//: 
    //     const newBlockedObj = Object.assign({}, blockedObj, websiteToBlock);
    //     console.log(`newBlockedObj ${JSON.stringify(newBlockedObj)}`);
    //     setBlockedObj(newBlockedObj);
    //     console.log(`blockedObject: ${JSON.stringify(blockedObj)}`);
    // }

    // const handleDeleteAll = () => {
    //     chrome.storage.sync.remove("blocked", () => {
    //         console.log("Removed all from blocked");
    //     })
    // }

    const handleDeleteAll = () => {
        chrome.storage.sync.remove("blocked", () => {
            console.log("Removed all from blocked");
        })
    }

    const classes = useStyles();

    return (
        <>
        <Container maxWidth="lg">
            <Paper component="form" className={classes.root}>
                <InputBase
                    className={classes.input}
                    placeholder="Website URL"
                    inputProps={{ 'aria-label': 'Input website url' }}
                    onChange={onSetUrlChange}
                />
                <IconButton onClick={handleAddWebsite} className={classes.iconButton} aria-label="search">
                    <AddIcon />
                </IconButton>
            </Paper>
            <List className={classes.listRoot}>
                {blockedObj && Object.keys(blockedObj).map((value) => {
                    const labelId = `checkbox-list-label-${value}`;
                    console.log(`labelId : ${labelId}`);
                    console.log(`value ${value}`);
                    return (
                    <ListItem fullWidth key={value} role={undefined} button onClick={() => console.log("test")}>
                        <ListItemText id={labelId} primary={value} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveWebsite(value)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
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

export default InputBox;