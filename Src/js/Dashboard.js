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
    //   $.getJSON("/build/contracts/Hospital.json", function (Hospital) {
    //     // Instantiate a new truffle contract from the artifact
    //     App.contracts.Hospital = TruffleContract(Hospital);
    //     // Connect provider to interact with contract
    //     App.contracts.Hospital.setProvider(App.web3Provider);
    //   });
      // Load account data
      web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          App.account = account;
        }
      });
    },

  
    render: function () {
          web3.eth.getBlockNumber(function(error, result) { 
            if (!error)
                $('#blocks').text(result);
          });
          web3.eth.getAccounts(function(error, address) { 
            if (!error) {
                web3.eth.getTransactionCount(address[0], function(error, count){ 
                    if (!error)
                        $('#transactions').text(count);
                  });
            }
          });
          web3.eth.getGasPrice(function(error, result){ 
            if (!error)
                $('#price').text(result + " wei");
          });
    },
  };
  
  $(function () {
    $(window).load(function () {
      App.init();
      setTimeout(() => App.render(), 500);
    });
  });
  
