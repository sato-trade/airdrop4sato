import React from 'react';
import {makeStyles,} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CancelIcon from '@material-ui/icons/Cancel';

import IconButton from '@material-ui/core/IconButton';

import './CustomTextField.css';

import InputAdornment from '@material-ui/core/InputAdornment';

const useStylesInput = makeStyles((theme) => ({
  root: {

    'label + &': {
      marginTop: theme.spacing(3),
    },

    // 'label.Mui-focused': {
    //   color: 'green',
    // },
    '&:hover': {
      backgroundColor: '#1B2A8C',
    },
    '&$focused': {
      backgroundColor: '#1F32B4',
    },
    backgroundColor: '#111C6F',
    borderRadius: 16,
    alignItems: 'center',
    // backgroundColor: 'red',
    overflow: 'hidden'
  },

  input: {
    position: 'relative',
    // backgroundColor: '#1F32B4',
    fontSize: 36,
    // width: 'auto',
    padding: '10px 12px',
    color: '#1DF0A9',

    fontFamily: [
      'Arial',
    ].join(','),

    '&:focused': {
      color: '#1DF0A9'
    }
  }


}));


export default function CustomTextField(props) {
  const classes = useStylesInput();

  // return <TextField placeholder="666" InputProps={{ classes, disableUnderline: true, }} {...props} />;
  return <TextField
    id="filled-full-width"
    margin="normal"
    InputLabelProps={{ className: "textfield__label" }}
    FormHelperTextProps={{ className: "textfield__helperText" }}
    variant="filled"
    InputProps={{
      classes, disableUnderline: true,

      endAdornment:
        <InputAdornment position="end">

          {props.rightbuttonlabel === "" ?
            null
            :

            <IconButton position="end"
              style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}
              onClick={props.onrightbuttonclick}
            >
              {props.rightbuttonlabel}
            </IconButton>

          }

          {props.showcancellbutton ?

            <CancelIcon style={{color:'white'}} onClick={props.clear} />
            :
            null
          }
        </InputAdornment>


    }

    }
    {...props}
    autoCapitalize="off"
    autoComplete="off"
    autoCorrect="off"
  >

  </TextField>
}


