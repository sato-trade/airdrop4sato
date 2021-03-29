import { Button, colors } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStylesInput = makeStyles((theme) => ({
    root: {

        // 'label + &': {
        //     marginTop: theme.spacing(3),
        // },

        // 'label.Mui-focused': {
        //   color: 'green',
        // },
        '&:hover': {
            backgroundColor: '#6DFFCE',
        },
        // '&$focused': {
        //     backgroundColor: '#1F32B4',
        // },
        // backgroundColor: '#111C6F',
        // borderRadius: 16,
        // alignItems: 'center',
        // backgroundColor: 'red',
        // overflow: 'hidden',
        // outerHeight:72,
        // innerHeight:72
        // background: 'linear-gradient(45deg, #3FF9D4 30%, #1DF0A9 90%)',
        background:"#1DF0A9",
        borderRadius: 36,
        border: 0,
        color: 'white',
        height: 48,
  
        // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height:72

    },
    label: {
        fontWeight: 'bold',
        color:'#111C6F',
        fontSize: 20,

    }
}));

export default function CustomButton(props) {
    const classes = useStylesInput();

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
