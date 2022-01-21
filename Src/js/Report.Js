App = {
    web3Provider: null,
    contracts: {},
    account: "0x0",
    hasVoted: false,
  
    init: function () {
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
      $.getJSON("/build/contracts/Report.json", function (Report) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.Report = TruffleContract(Report);
        // Connect provider to interact with Report
        App.contracts.Report.setProvider(App.web3Provider);
      });
      // Load account data
      web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          App.account = account;
        }
      });
    },
  
    addReport: function () {
      console.log("Function started");
      var title = $("#Title").val();
      var description = $("#Description").val();
      var details = "Details";// $("#CNIC").val();
      var pateintAddress =  $('#patienAddress').val(); // needs to update the hospital id in the final version
      console.log(title)
      console.log(description)

      App.contracts.Report.deployed()
        .then(function (instance) {
          return instance.createReport( title, description, details, pateintAddress, { from: App.account });
        })
        .then(function (result) {
          if (result) {
            window.open("../WebPages/patients_Input.html", "_self");
          } else {
            window.open("../WebPages/patients_Input.html", "_self");
            console.log(result);
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    },
  };
  $(function () {
    $(window).load(function () {
      App.init();
    });
  });

  const form = document.querySelector("#addReport");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    App.addReport();
  });
  