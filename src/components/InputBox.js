import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

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
}));


const InputBox = ({handleAddWebsite, onSetUrlChange}) => {
    const classes = useStyles();
    return (
        <Paper component="form" className={classes.root}>
            <InputBase
                className={classes.input}
                placeholder="Website URL"
                onChange={onSetUrlChange}
            />
            <IconButton onClick={handleAddWebsite} className={classes.iconButton}>
                <AddIcon />
            </IconButton>
        </Paper>
    )
}

export default InputBox;