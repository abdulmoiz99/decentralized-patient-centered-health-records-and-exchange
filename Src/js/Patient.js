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
    console.log("Function started");
    var fullName = $("#fullName").val();
    var dateOfBirth = $("#dateOfBirth").val();
    var CNIC = $("#CNIC").val();
    var hospitalId = 1; // $('#hospitalId').val(); // needs to update the hospital id in the final version
    var PhoneNo = $("#PhoneNo").val();
    var email = $("#email").val();
    var status = $("#status").val();
    var gender = $("#gender").val();

    App.contracts.Patient.deployed()
      .then(function (instance) {
        return instance.AddPatient(
          fullName,
          dateOfBirth,
          CNIC,
          hospitalId,
          PhoneNo,
          email,
          status,
          gender,
          { from: App.account }
        );
      })
      .then(function (result) {
        if (result) {
          window.open("../WebPages/patients_Input.html", "_self");
        } else {
          console.log(result);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },

  render: function () {
    var patientInstance;
    var tbody = $("#patients");

    // Load contract data
    App.contracts.Patient.deployed()
      .then(function (instance) {
        patientInstance = instance;
        return patientInstance.patientCount();
      })
      .then(function (count) {
        for (var i = 0; i < count.toNumber(); i++) {
          patientInstance.Patients(i).then(function (patient) {
            var name = patient[1];
            var dob = patient[2];
            var email = patient[6];
            var status = patient[7];
            var address = "0xfb1BF9cFeCe8727658b61b57B45dd17bDc08BfC2";
            // Render candidate Result
            var patientTemplate = `<tr>
              <td><input type="checkbox"></td>
              <td style="color: rgb(0,0,0);"><a href="patients_input.html" style="text-decoration: none;color: rgb(0,0,0);">${name}</a><label class="form-label d-block" style="font-size: 12px;color: rgb(46,131,242);">${email}</label></td>
              <td style="color: rgb(46,131,242);">${status}<label class="form-label d-block" style="font-size: 12px;color: rgb(46,131,242);">Date of Birth: ${dob}</label></td>
              <td style="color: rgb(0,0,0);">${address}<br></td>
              <td class="text-end">
                  <div class="dropdown"><button class="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button" style="background: rgb(255,255,255);color: rgb(46,131,242);border-color: rgb(255,255,255);"></button>
                      <div class="dropdown-menu"><a class="dropdown-item" href="#">Edit Details</a><a class="dropdown-item" href="#">Delete Record</a></div>
                  </div>
              </td>
          </tr>`;
            tbody.append(patientTemplate);
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

const form = document.querySelector("#addPatient");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  App.addPatient();
});
