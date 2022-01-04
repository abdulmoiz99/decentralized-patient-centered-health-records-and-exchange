App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
  
    init: function() {
      return App.initWeb3(); 
    },
    
    initWeb3: function() {
      // TODO: refactor conditional
      if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;  
      ethereum.enable();
      web3 = new Web3(web3.currentProvider);
      } else {    
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      ethereum.enable();
      web3 = new Web3(App.web3Provider);
      }
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON("/build/contracts/Hospital.json", function(Hospital) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.Hospital = TruffleContract(Hospital);
        // Connect provider to interact with contract
        App.contracts.Hospital.setProvider(App.web3Provider);
      });
       // Load account data
         web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
        }
      });

    },
  
    login: function() {
        console.log("Function started");
    //  var Hospitalname = $('#hospitalName').val();
    //  var password = $('#hospitalAddress').val();
      App.contracts.Hospital.deployed().then(function(instance) {
        return instance.CreateHospital("name4","location1","city1","state1","postalcode1","country1","phoneNumber1", {from: App.account}); 
      }).then(function(result) {
        console.log("result" + result);
      }).catch(function(err) {
        console.error(err);
      });
    }
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  
  const form = document.querySelector('#login');
  form.addEventListener('submit', event => {
    event.preventDefault();
    App.login();
  });
  
  
  