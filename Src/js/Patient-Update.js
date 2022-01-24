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

  updatePatient: function () {
    var address = $("#address").val();
    var fullName = $("#fullName").val();
    var dateOfBirth = $("#dateOfBirth").val();
    var CNIC = $("#CNIC").val();
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

    App.contracts.User.deployed()
      .then(function (instance) {
        return instance.changeName(address, fullName, { from: App.account });
      })
      .then(function (result) {
        if (!result) {
          alert("Address already exists!");
        }
      })
      .catch(function (err) {
        console.error(err);
      });

    App.contracts.Patient.deployed()
      .then(function (instance) {
        return instance.updatePatient(
          address,
          fullName,
          dateOfBirth,
          CNIC,
          PhoneNo,
          email,
          status,
          gender,
          { from: App.account }
        );
      })
      .then(function (result) {
        if (result) {
          App.contracts.Patient.deployed()
            .then(function (instance) {
              return instance.updateConditions(
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
    var patientInstance = await App.contracts.Patient.deployed();
    web3.eth.getAccounts((err, accounts) => {
      if (!err) {
        var roles = [1, 2, 3];
        userInstance
          .checkUser(accounts[0], roles)
          .then(function (authenticated) {
            if (authenticated) {
              const urlParams = new URLSearchParams(window.location.search);
              const id = urlParams.get("id");
              //If the user is authenticated
              userInstance.getRoleId(accounts[0]).then(function (roleId) {
                if (roleId == 1)
                  document.getElementById("reports-link").style.display =
                    "none";
                else if (roleId == 2) {
                  document.getElementById("hospitals-link").style.display =
                    "none";
                  document.getElementById("settings-link").style.display =
                    "none";
                }
                else if (roleId == 3) {
                  if (accounts[0] != id) window.open(`../WebPages/patients_update.html?id=${accounts[0]}`,"_self");

                  document.querySelector("nav").style.display = "none";
                  document.querySelector("#save-button").style.display = "none";
                  document.querySelector("#back-button").href = `patients_report.html?id=${accounts[0]}`;
                  document.querySelector("#heading").innerText = "My Initial Summary";
                  $(document).ready(function(){
                    $("input[type=text], [type=date]").prop("disabled", true);
                    $("select").attr('disabled', true);
                    $("#addPatient :input[type=checkbox]").on("click", false);
                });
                }
              });
              userInstance.getUsername(accounts[0]).then(function (name) {
                document.getElementById("nav-username").textContent = name;
              });
            
              document.getElementById("address").value = id;

              patientInstance.getPatient(id).then(function (patient) {
                document.getElementById("fullName").value = patient[0];
                document.getElementById("dateOfBirth").value = new Date(
                  patient[1]
                )
                  .toISOString()
                  .split("T")[0];
                document.getElementById("CNIC").value = patient[2];
                document.getElementById("PhoneNo").value = patient[3];
                document.getElementById("email").value = patient[4];

                if (patient[5] == "Sick") $("#status").val("Sick");
                else if (patient[5] == "Deceased") $("#status").val("Deceased");

                if (patient[6] == "Female") $("#gender").val("Female");
                else if (patient[6] == "Other") $("#gender").val("Other");

                patientInstance
                .getPatientConditions(patient[7].toNumber())
                .then(function (condition) {
                  $("#formCheck-1").prop("checked", condition[0]);
                  $("#formCheck-8").prop("checked", condition[1]);
                  $("#formCheck-6").prop("checked", condition[2]);
                  $("#formCheck-4").prop("checked", condition[3]);
                  $("#formCheck-12").prop("checked", condition[4]);
                  $("#formCheck-20").prop("checked", condition[5]);
                  $("#formCheck-17").prop("checked", condition[6]);
                  $("#formCheck-21").prop("checked", condition[7]);
                  $("#formCheck-23").prop("checked", condition[8]);
                  $("#formCheck-25").prop("checked", condition[9]);

                  if (condition[10] == "") {
                    $("#formCheck-30").prop("checked", false);
                  }
                  else {
                    $("#formCheck-30").prop("checked", true);
                    $("#other-textbox").prop("disabled", false);
                    $("#other-textbox").prop("value", condition[10]);
                  }
                });
              });

              

              const form = document.querySelector("#addPatient");
              form.addEventListener("submit", (event) => {
                event.preventDefault();
                App.updatePatient();
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
