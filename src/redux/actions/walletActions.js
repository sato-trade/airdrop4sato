import Agent from '../../utils/Agent'

const Wallet = {
    getUserCapital: () =>
        Agent.Request.get(`/user/getCoinCapitals`),
    withdraw: () =>
        Agent.Request.post(`/financial/withdraw`),
    deposit: () =>
        Agent.Request.post(`/financial/deposit`)
    /**
     * raw transaction deposit into contract
     * maker transaction towards contract address through metamask transaction
     *
     * dont show any deposit pending records, only approved records
     *
     */
};
