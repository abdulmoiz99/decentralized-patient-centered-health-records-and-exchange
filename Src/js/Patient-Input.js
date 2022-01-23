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
    $.getJSON("/build/contracts/Patient.json", function (Patient) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Patient = TruffleContract(Patient);
      // Connect provider to interact with contract
      App.contracts.Patient.setProvider(App.web3Provider);
    });
    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
      }
    });
  },

  addPatient: function () {
    var address = $("#address").val();
    var fullName = $("#fullName").val();
    var dateOfBirth = $("#dateOfBirth").val();
    var CNIC = $("#CNIC").val();
    var creatorAddress = App.account;
    var PhoneNo = $("#PhoneNo").val();
    var email = $("#email").val();
    var status = $("#status").find(":selected").text();
    var gender = $("#gender").find(":selected").text();

    //Medical Conditions
    var dependence = $("#formCheck-1").is(":checked");
    var seizure = $("#formCheck-8").is(":checked");
    var heartDisease = $("#formCheck-6").is(":checked");
    var blackOut = $("#formCheck-4").is(":checked");
    var stroke = $("#formCheck-12").is(":checked");
    var VFAI = $("#formCheck-20").is(":checked");
    var diabetes = $("#formCheck-17").is(":checked");
    var mentalIllness = $("#formCheck-21").is(":checked");
    var alzheimer = $("#formCheck-23").is(":checked");
    var sleepingDisorder = $("#formCheck-25").is(":checked");
    var other = $("#formCheck-30").is(":checked")
      ? $("#other-textbox").val()
      : "";

    App.contracts.Patient.deployed()
      .then(function (instance) {
        return instance.AddPatient(
          fullName,
          dateOfBirth,
          CNIC,
          creatorAddress,
          PhoneNo,
          email,
          status,
          gender,
          address,
          { from: App.account }
        );
      })
      .then(function (result) {
        if (result) {
          App.contracts.Patient.deployed()
            .then(function (instance) {
              return instance.AddMedicalCondition(
                dependence,
                seizure,
                heartDisease,
                blackOut,
                stroke,
                VFAI,
                diabetes,
                mentalIllness,
                alzheimer,
                sleepingDisorder,
                other,
                { from: App.account }
              );
            })
            .then(function (result) {
              if (result) {
                window.open("../WebPages/patients_view.html", "_self");
              } else {
                console.log(result);
              }
            })
            .catch(function (err) {
              console.error(err);
            });
        } else {
          console.log(result);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },

  render: async function () {
    var userInstance = await App.contracts.User.deployed();
    web3.eth.getAccounts((err, accounts) => {
      if (!err) {
        var roles = [1, 2];
        userInstance
          .checkUser(accounts[0], roles)
          .then(function (authenticated) {
            if (authenticated) {
              //If the user is authenticated
              userInstance.getRoleId(accounts[0]).then(function (id) {
                if (id == 1)
                  document.getElementById("reports-link").style.display =
                    "none";
                else if (id == 2) {
                  document.getElementById("hospitals-link").style.display =
                    "none";
                  document.getElementById("settings-link").style.display =
                    "none";
                }
              });
              userInstance.getUsername(accounts[0]).then(function (name) {
                document.getElementById("nav-username").textContent = name;
              });
              const form = document.querySelector("#addPatient");
              form.addEventListener("submit", (event) => {
                event.preventDefault();
                App.addPatient();
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

  toggleInput: function () {
    const checkbox = document.getElementById("formCheck-30");
    const textbox = document.getElementById("other-textbox");

    if (checkbox.checked) {
      textbox.disabled = false;
    } else {
      textbox.disabled = true;
    }
  },
};

$(function () {
  $(window).load(function () {
    App.init();
    setTimeout(() => App.render(), 500);
  });
});
