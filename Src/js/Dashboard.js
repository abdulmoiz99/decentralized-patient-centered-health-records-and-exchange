App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: async function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // TODO: refactor conditional
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      ethereum.enable();
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      ethereum.enable();
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("/build/contracts/User.json", function (User) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.User = TruffleContract(User);
      // Connect provider to interact with contract
      App.contracts.User.setProvider(App.web3Provider);
    });
    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
      }
    });
  },

  render: async function () {
    var userInstance = await App.contracts.User.deployed();
    web3.eth.getAccounts((err, accounts) => {
      if (!err) {
        userInstance.checkUser(accounts[0], [1]).then(function(response)
        {
            authenticated = response;
            if (authenticated) {
              //After user is authenticated
              web3.eth.getBlockNumber(function (error, result) {
                if (!error) $("#blocks").text(result);
              });
              web3.eth.getTransactionCount(accounts[0], function (error, count) {
                if (!error) $("#transactions").text(count);
              });
              web3.eth.getGasPrice(function (error, result) {
                if (!error) $("#price").text(result + " wei");
              });
            }
            else 
            {
              //Render another page
            }
        }); 
      }
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
    setTimeout(() => App.render(), 500);
  });
});
