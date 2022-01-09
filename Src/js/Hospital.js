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
    $.getJSON("/build/contracts/Hospital.json", function (Hospital) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Hospital = TruffleContract(Hospital);
      // Connect provider to interact with contract
      App.contracts.Hospital.setProvider(App.web3Provider);
    });
    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
      }
    });
  },

  addHospital: function () {
    var name = $("#name").val();
    var location = $("#location").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var postalCode = $("#postalCode").val();
    var country = $("#country").val();
    var phoneNumber = $("#phoneNumber").val();

    App.contracts.Hospital.deployed()
      .then(function (instance) {
        return instance.CreateHospital(
          name,
          location,
          city,
          state,
          postalCode,
          country,
          phoneNumber,
          { from: App.account }
        );
      })
      .then(function (result) {
        if (result) {
          window.open("../WebPages/hospitals_input.html", "_self");
        } else {
          console.log(result);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },

  render: function () {
    var hospitalInstance;
    var tbody = $("tbody");

    // Load contract data
    App.contracts.Hospital.deployed()
      .then(function (instance) {
        hospitalInstance = instance;
        return hospitalInstance.getCount();
      })
      .then(function (count) {
        for (var i = 1; i <= count.toNumber(); i++) {
          hospitalInstance.Hospitals(i).then(function (hospital) {
            var name = hospital[1];
            var location = hospital[2];
            var email = "aku@hospital.com";
            var address = "0xfb1BF9cFeCe8727658b61b57B45dd17bDc08BfC2";
            // Render candidate Result
            var hospitalTemplate = `<tr>
          <td><input type="checkbox"></td>
          <td style="color: rgb(0,0,0);"><a href="hospitals_update.html" style="text-decoration: none;color: rgb(0,0,0);">${name}</a><label class="form-label d-block" style="font-size: 12px;color: rgb(46,131,242);">${email}</label></td>
          <td style="color: rgb(46,131,242);">Active<label class="form-label d-block" style="font-size: 12px;color: rgb(46,131,242);">Last login: 14/APR/2020</label></td>
          <td style="color: rgb(0,0,0);">${address}<br></td>
          <td class="text-end">
              <div class="dropdown"><button class="btn btn-primary dropdown-toggle" aria-expanded="false" data-bs-toggle="dropdown" type="button" style="background: rgb(255,255,255);color: rgb(46,131,242);border-color: rgb(255,255,255);"></button>
                  <div class="dropdown-menu"><a class="dropdown-item" href="#">First Item</a><a class="dropdown-item" href="#">Second Item</a><a class="dropdown-item" href="#">Third Item</a></div>
              </div>
          </td>
      </tr>
      <tr>`;
            tbody.append(hospitalTemplate);
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

// const form = document.querySelector('#addHospital');
// form.addEventListener('submit', event => {
//   event.preventDefault();
//   App.addHospital();
// });
