import {Button} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import React from 'react';

const unlockStyle = makeStyles((theme) => ({
    root: {
        '&:hover': {
            backgroundColor: '#A2E6F5',
        },

        background:"#75E2F9",

        borderRadius: 36,
        border: 0,
        color: 'white',
        height:72
    },
    label: {
        fontWeight: 'bold',
        color:'#111C6F',
        fontSize: 20,

    }
}));

const connectStyle = makeStyles((theme) => ({
    root: {
        '&:hover': {
            backgroundColor: '#7095F0',
        },

        background:"#4477F1",

        borderRadius: 36,
        border: 0,
        color: 'white',
        height:72
    },
    label: {
        fontWeight: 'bold',
        color:'white',
        fontSize: 20,
        textTransform:"none"

    }
}));

const confirmStyle = makeStyles((theme) => ({
    root: {
        '&:hover': {
            backgroundColor: '#6BF5C6',
        },

        background:"#1DF0A9",
        // background:"red",

        borderRadius: 36,
        border: 0,
        color: 'white',
        height:72
    },
    label: {
        fontWeight: 'bold',
        color:'#111C6F',
        fontSize: 20,

    }
}));

export default function CustomButton(props) {
    var classes
    if (props.buttonStyle=="connectStyle"){
        classes = connectStyle()

    } else if (props.buttonStyle == "unlockStyle"){
        classes = unlockStyle()

    } else {
        classes = confirmStyle()
    }

    // return <TextField placeholder="666" InputProps={{ classes, disableUnderline: true, }} {...props} />;
    return <Button
        //   id="filled-full-width"
        //   margin="normal"
        //   InputLabelProps={{ className: "textfield__label" }}
        //   FormHelperTextProps={{className:"textfield__helperText"}}
        //   variant="filled"
        //   InputProps={{ classes, disableUnderline: true, }}
        {...props}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"

        classes={{
            root: classes.root, // class name, e.g. `classes-nesting-root-x`
            label: classes.label, // class name, e.g. `classes-nesting-label-x`
        }}
    >

    </Button>
}
