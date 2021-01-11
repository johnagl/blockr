import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';

const BlockedWebsite = ( {labelId, value, handleRemoveWebsite } ) => {
    return (
        <ListItem fullWidth key={value} role={undefined} button>
            <ListItemText id={labelId} primary={value} />
                <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleRemoveWebsite(value)}>
                        <DeleteIcon />
                            </IconButton>
                </ListItemSecondaryAction>
        </ListItem>
    )
}

export default BlockedWebsite;