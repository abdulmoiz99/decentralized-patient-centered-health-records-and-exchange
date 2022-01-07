App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
  
    init: async function() {
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
  
    addHospital: function() {
      var name = $('#name').val();
      var location = $('#location').val();
      var city = $('#city').val();
      var state = $('#state').val();
      var postalCode = $('#postalCode').val();
      var country = $('#country').val();
      var phoneNumber = $('#phoneNumber').val();

      App.contracts.Hospital.deployed().then(function(instance) {
        return instance.CreateHospital(name,location,city,state,postalCode,country,phoneNumber, {from: App.account}); 
      }).then(function(result) {
        if(result)
        {
          window.open("../WebPages/hospitals_input.html","_self");
        }
        else {
          console.log(result);
        }
      }).catch(function(err) {
        console.error(err);
      });
    },

    getHospitals: function() {
      console.log("fff");
      var name = "1";
      var location = "1";
      var city ="1";
      var state = "1";
      var postalCode = "1";
      var country ="1";
      var phoneNumber = "1";

      App.contracts.Hospital.deployed().then(function(instance) {
        return instance.CreateHospital(name,location,city,state,postalCode,country,phoneNumber, {from: App.account}); 
      }).then(function(result) {
        if(result)
        {
          window.open("../WebPages/hospitals_input.html","_self");
        }
        else {
          console.log(result);
        }
      }).catch(function(err) {
        console.error(err);
      });
  }
  };
  
  $(function() {
    $(window).load(function() {
          App.init();
          setTimeout(() => App.getHospitals(), 500);
      });
  });
  
  // const form = document.querySelector('#addHospital');
  // form.addEventListener('submit', event => {
  //   event.preventDefault();
  //   App.addHospital();
  // });
  

  