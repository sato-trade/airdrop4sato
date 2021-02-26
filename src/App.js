import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import React, { useState, useEffect } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding'
import { recoverPersonalSignature } from 'eth-sig-util'
const Web3 = require("web3");
const { isMetaMaskInstalled } = MetaMaskOnboarding
const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
    ? 'http://localhost:9010'
    : undefined

function App() {
    const [ connected, setConnected ] = useState(false)
    const [ chainId, setChainId ] = useState(0)
    const [ network, setNetwork ] = useState('')
    const [ addr, setAddr ] = useState('')
    const [ signResult, setSignResult ] = useState('')
    const [ recoveryResult, setRecoverResult ] = useState('')
    const [ ecRecoveryResult, setEcRecoverResult ] = useState('')
    const [button1, setButton1] = useState('')
    const [button2, setButton2] = useState('SIGN')
    const [button3, setButton3] = useState('VERIFY')
    const [button1Disabled, setButton1Disabled] = useState(true)
    const [button2Disabled, setButton2Disabled] = useState(true)
    const [button3Disabled, setButton3Disabled] = useState(true)
    const [onBoard, setOnboard] = useState(new MetaMaskOnboarding({ forwarderOrigin }))

    const classes = useStyles();

    /**
     * Personal Sign
     */
    const sign = async () => {
        const exampleMessage = 'Example `personal_sign` message'
        try {
            const from = addr
            const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
            const sign = await window.ethereum.request({
                method: 'personal_sign',
                params: [msg, from, 'Example password'],
            })
            setSignResult(sign)
            let payload = {
                data: msg,
                sig: sign,
                address: addr
            }
            console.log('payload: ', payload)
        } catch (err) {
            console.error(err)
            setSignResult(`Error: ${err.message}`)
        }
    }

    /**
     * Personal Sign Verify
     */
    const verify = async () => {
        const exampleMessage = 'Example `personal_sign` message'
        try {
            const from = addr
            const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
            const sign = signResult
            const recoveredAddr = recoverPersonalSignature({
                'data': msg,
                'sig': sign,
            })
            if (recoveredAddr === from) {
                console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`)
                setRecoverResult(recoveredAddr)
            } else {
                console.log(`SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`)
                console.log(`Failed comparing ${recoveredAddr} to ${from}`)
            }
            const ecRecoverAddr = await window.ethereum.request({
                method: 'personal_ecRecover',
                params: [msg, sign],
            })
            if (ecRecoverAddr === from) {
                console.log(`Successfully ecRecovered signer as ${ecRecoverAddr}`)
                setEcRecoverResult(ecRecoverAddr)
            } else {
                console.log(`Failed to verify signer when comparing ${ecRecoverAddr} to ${from}`)
            }
        } catch (err) {
            console.error(err)
            setRecoverResult(`Error: ${err.message}`)
            setEcRecoverResult(`Error: ${err.message}`)
        }
    }

    const onClickInstall = () => {
        setButton1('Onboarding in progress')
        setButton1Disabled(true)
        onBoard.startOnboarding()
    }

    const onClickConnect = async () => {
        try {
            const newAccounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })
            handleNewAccounts(newAccounts)
        } catch (error) {
            console.error(error)
        }
    }

    const updateButtons = () => {
        const accountButtonsDisabled = !isMetaMaskInstalled() || !isMetaMaskConnected()
        if (accountButtonsDisabled) {
            setButton2Disabled(true)
            setButton3Disabled(true)
        } else {
            setButton2Disabled(false)
            setButton3Disabled(false)
        }


        if (!isMetaMaskInstalled()) {
            setButton1('Click here to install MetaMask!')
            setButton1Disabled(false)
        } else if (isMetaMaskConnected()) {
            setButton1('Connected')
            setButton1Disabled(true)
            if (onBoard) {
                onBoard.stopOnboarding()
            }
        } else {
            setButton1('Connect')
            setButton1Disabled(false)
        }
    }

    function handleNewChain (chainId) {
        setChainId(chainId)
    }

    function handleNewNetwork (networkId) {
        setNetwork(networkId)
    }

    function handleNewAccounts (addr) {
        setAddr(addr[0])
        updateButtons()
    }

    async function getNetworkAndChainId () {
        try {
            const chainId = await window.ethereum.request({
                method: 'eth_chainId',
            })
            handleNewChain(chainId)

            const networkId = await window.ethereum.request({
                method: 'net_version',
            })
            handleNewNetwork(networkId)
        } catch (err) {
            console.error(err)
        }
    }


    const initialize = async () => {
        if (isMetaMaskInstalled()) {
            window.ethereum.autoRefreshOnNetworkChange = false
            window.ethereum.on('chainChanged', handleNewChain)
            window.ethereum.on('networkChanged', handleNewNetwork)
            window.ethereum.on('accountsChanged', handleNewAccounts)
        }
    }

    const isMetaMaskConnected = () => {
        setConnected(addr !== '')
        return addr !== ''
    }

    useEffect(() => {
        initialize().then(async () => {
            try {
                const newAccounts = await window.ethereum.request({
                    method: 'eth_accounts',
                })
                handleNewAccounts(newAccounts)
            } catch (err) {
                console.error('Error on init when getting accounts', err)
            }
        })
        return() => {
            console.log('cleared')
        }
    }, [])

    useEffect(() => {
        updateButtons()
        return() => {
            console.log('cleared')
        }
    }, [button1Disabled, button2Disabled, button3Disabled, button1 ])

    useEffect(() => {
        getNetworkAndChainId()
        return() => {
            console.log('cleared')
        }
    }, [chainId, network])

    return (
        <Grid className="App">
          <header className={classes.root}>
              <Button onClick={!isMetaMaskInstalled() ? onClickInstall : onClickConnect } disabled={button1Disabled} variant="outlined" color="primary">
                  {button1}
              </Button>
              <Button onClick={sign} variant="outlined" color="primary" disabled={button2Disabled}>
                  {button2}
              </Button>
              <Typography variant="h5" component="h5" className={classes.result}>
                  {signResult}
              </Typography>
              <Button onClick={verify} variant="outlined" color="primary" disabled={button3Disabled}>
                  {button3}
              </Button>
              <Typography variant="h5" component="h5" className={classes.result}>
                  {recoveryResult}
              </Typography>
          </header>
        </Grid>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        flexGrow: 1,
    },
    result: {
        fontSize: 10,
        color: '#000000',
        width: 200
    }
}));

export default App;
