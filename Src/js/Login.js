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
    $.getJSON("/build/contracts/User.json", function(user) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.User = TruffleContract(user);
      // Connect provider to interact with contract
      App.contracts.User.setProvider(App.web3Provider);
    });
  },

  login: function() {
    var username = $('#username').val();
    var password = $('#password').val();
    App.contracts.User.deployed().then(function(instance) {
     // return instance.login(username, password);
        return instance.login("Abdul", "123");

    }).then(function(result) {
      console.log(result);
      if(result)
      {
        window.open("../WebPages/hospitals_input.html","_self");
      }
      else {
        window.open("../WebPages/hospitals_input.html","_self");
      }
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


