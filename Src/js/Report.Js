var ipfs_http_client = require('ipfs-http-client');

const ipfs = ipfs_http_client.create({
  host: 'ipfs.infura.io',
  port: 5001, 
  protocol: 'https'
});

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
    $.getJSON("/build/contracts/User.json", function (User) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.User = TruffleContract(User);
      // Connect provider to interact with contract
      App.contracts.User.setProvider(App.web3Provider);
    });
    $.getJSON("/build/contracts/Report.json", function (Report) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Report = TruffleContract(Report);
      // Connect provider to interact with Report
      App.contracts.Report.setProvider(App.web3Provider);
    });
    $.getJSON("/build/contracts/Patient.json", function (Patient) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Patient = TruffleContract(Patient);
      // Connect provider to interact with contract
      App.contracts.Patient.setProvider(App.web3Provider);
    });
    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        if (account == null) {
          document.body.style = "background: #359AF2;";
          document.body.innerHTML = `<section class="login-clean" style="background: #359AF2;">
      <div class="logo" style="text-align: center;"><i class="fa fa-heartbeat" style="font-size: 40px;color: rgb(255,255,255);text-align: left;margin-left: 0px;margin-right: 5px;"></i><label class="form-label" style="color: rgb(255,255,255);font-size: 35px;margin-left: 5px;">MyApp</label></div>
      <form id = "login" style="border-radius: 25px;box-shadow: 0px 4px 4px rgba(0,0,0,0.25);max-width: 450px;margin-top: 30px;">
          <p class="text-center" style="color: #0F2440;">You are not logged in to Web3. Please sign in with a registered account in MetaMask and click Reload.</p>  
          <div class="mb-3"><button class="btn btn-primary shadow-sm d-block w-100" type="submit" style="border-radius: 25px;background: #2E83F2;margin-top: 40px;" onClick="window.location.reload();">Reload</button></div>
      </form>
  </section>`;
        }
        else App.account = account;
      }
    });
  },

  addReport: function () {
    var title = $("#Title").val();
    var description = $("#Description").val();
    var details = document.getElementsByClassName("ql-editor");
    var patientAddress = $("#patientAddress").val();
    
    const saveButton = document.querySelector('#createReport'); 
    //Loading start
    saveButton.textContent = 'Loading...';
    saveButton.disabled = true;

    ipfs.add(details[0].innerHTML).then(function(hash) { 
    
      App.contracts.Report.deployed()
      .then(function (instance) {
        //Loading end
        saveButton.textContent = 'Save';
        saveButton.disabled = false;

        return instance.createReport(
          title,
          description,
          hash.path,
          patientAddress,
          { from: App.account }
        );
      })
      .then(function (result) {
        if (result) {
          window.open(`../WebPages/patients_report.html?id=${patientAddress}`, "_self");
        } 
      })
      .catch(function (err) {
        console.error(err);
      });
    })
  },

  render: async function () {
    var userInstance = await App.contracts.User.deployed();
    var patientInstance = await App.contracts.Patient.deployed();
    web3.eth.getAccounts((err, accounts) => {
      if (!err) {
        var roles = [2];
        userInstance
          .checkUser(accounts[0], roles)
          .then(function (authenticated) {
            if (authenticated) {
              userInstance.getRoleId(accounts[0]).then(function (id) {
                if (id == 2) {
                  document.getElementById("hospitals-link").style.display =
                    "none";
                  document.getElementById("settings-link").style.display =
                    "none";
                }
              });

              userInstance.getUsername(accounts[0]).then(function (name) {
                document.getElementById("nav-username").textContent = name;
              });

              patientInstance.getPatientCount().then(function (count) {
                for (var i = 0; i < count.toNumber(); i++) {
                  patientInstance
                    .getPatientNameAddress(i)
                    .then(function (patient) {
                      document.getElementById(
                        "patientAddress"
                      ).innerHTML += `<option value="${patient[1]}">
                        ${patient[0]}
                      </option>`;
                    });
                }
              });
            } else {
              //Render another page;
              document.body.style = "background: #359AF2;";
              document.body.innerHTML = `<section class="login-clean" style="background: #359AF2;">
              <div class="logo" style="text-align: center;"><i class="fa fa-heartbeat" style="font-size: 40px;color: rgb(255,255,255);text-align: left;margin-left: 0px;margin-right: 5px;"></i><label class="form-label" style="color: rgb(255,255,255);font-size: 35px;margin-left: 5px;">MyApp</label></div>
              <form id = "login" style="border-radius: 25px;box-shadow: 0px 4px 4px rgba(0,0,0,0.25);max-width: 450px;margin-top: 30px;">
                  <p class="text-center" style="color: #0F2440;">You are not authenticated to access this platform. Please sign in with a registered account in MetaMask and click Reload.</p>  
                  <div class="mb-3"><button class="btn btn-primary shadow-sm d-block w-100" type="submit" style="border-radius: 25px;background: #2E83F2;margin-top: 40px;" onClick="window.location.reload();">Reload</button></div>
              </form>
          </section>`;
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

const form = document.querySelector("#addReport");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  App.addReport();
});

ethereum.on('accountsChanged', function () {
  location.reload();
})