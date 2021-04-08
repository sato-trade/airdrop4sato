import React from 'react';
import {makeStyles,} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import './CustomTextField.css';


const useStylesInput = makeStyles((theme) => ({
    root: {

        // 'label + &': {
        //     marginTop: theme.spacing(3),
        // },


        // '&:hover': {
        //     backgroundColor: '#1B2A8C',
        // },
        // '&$focused': {
        //     backgroundColor: '#1F32B4',
        // },
        // backgroundColor: 'red',
        borderRadius: 16,
        alignItems: 'center',
        // backgroundColor: 'red',
        overflow: 'hidden',
    },

    input: {
        position: 'relative',
        // backgroundColor: '#1F32B4',
        fontSize: 40,
        // width: 'auto',
        padding: '10px 12px',
        color: '#1DF0A9',

        fontFamily: [
            'Arial',
        ].join(','),

        // '&:focused': {
        //     color: '#1DF0A9'
        // },
    },


}));


export default function CustomDropBox(props) {
    const classes = useStylesInput();

    return <TextField
        {...props}
        id="outlined-basic"
        variant="filled"
        select
        style={{ opacity: props.disabled ? 0.2 : 1, width: '100%', height: '70%', backgroundColor: '#1DF0A9', borderRadius: 16 }}
        InputProps={{ disableUnderline: true }}
        InputLabelProps={{ className: "dropBox__label" }}
        disabled={props.disabled}


    // root={{ backgroundColor: 'blue' }}
    >

    </TextField>


}


