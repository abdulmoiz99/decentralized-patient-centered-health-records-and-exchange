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
      $.getJSON("/build/contracts/Patient.json", function(Patient) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.Patient = TruffleContract(Patient);
        // Connect provider to interact with contract
        App.contracts.Patient.setProvider(App.web3Provider);
      });
       // Load account data
         web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
        }
      });

    },
  
    addPatient: function() {
        console.log("Function started");
    //  var Hospitalname = $('#hospitalName').val();
    //  var password = $('#hospitalAddress').val();
      App.contracts.Patient.deployed().then(function(instance) {
        return instance. AddPatient("test Patient", "08/05/2025", "42401123123123", 1, "923142313111", "abdulmoiz@gmail.com", "healthy", "male", {from: App.account});
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
  
  const form = document.querySelector('#addPatient');
  form.addEventListener('submit', event => {
    event.preventDefault();
    App.addPatient();
  });
  
  
  