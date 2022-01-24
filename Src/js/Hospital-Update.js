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
    $.getJSON("/build/contracts/User.json", function (User) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.User = TruffleContract(User);
      // Connect provider to interact with contract
      App.contracts.User.setProvider(App.web3Provider);
    });
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

  updateHospital: function () {
    var address = $("#address").val();
    var name = $("#name").val();
    var email = $("#email").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var postalCode = $("#postalAddress").val();
    var country = $("#country").val();
    var phoneNumber = $("#phoneNumber").val();

    App.contracts.User.deployed()
      .then(function (instance) {
        return instance.changeName(address, name, { from: App.account });
      })
      .then(function (result) {
        if (!result) {
          alert("Address not found!");
        }
      })
      .catch(function (err) {
        console.error(err);
      });

    App.contracts.Hospital.deployed()
      .then(function (instance) {
        return instance.updateHospital(
          address,
          name,
          email,
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
          window.open("../WebPages/hospitals_view.html", "_self");
        } else {
          alert(result);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },

  render: async function () {
    var userInstance = await App.contracts.User.deployed();
    var hospitalInstance = await App.contracts.Hospital.deployed();
    web3.eth.getAccounts((err, accounts) => {
      if (!err) {
        var roles = [1];
        userInstance
          .checkUser(accounts[0], roles)
          .then(function (authenticated) {
            if (authenticated) {
              //If the user is authenticated
              userInstance.getRoleId(accounts[0]).then(function (id) {
                if (id == 1)
                  document.getElementById("reports-link").style.display =
                    "none";
              });
              userInstance.getUsername(accounts[0]).then(function (name) {
                document.getElementById("nav-username").textContent = name;
              });

              const urlParams = new URLSearchParams(window.location.search);
              const id = urlParams.get("id");
              document.getElementById("address").value = id;

              hospitalInstance.getHospital(id).then(function (hospital)
              {
                  document.getElementById("name").value = hospital[0];
                  document.getElementById("email").value = hospital[1];
                  document.getElementById("city").value = hospital[2];
                  document.getElementById("state").value = hospital[3];
                  document.getElementById("postalAddress").value = hospital[4];
                  document.getElementById("country").value = hospital[5];
                  document.getElementById("phoneNumber").value = hospital[6];
              });


              const form = document.querySelector("#addHospital");
              form.addEventListener("submit", (event) => {
                event.preventDefault();
                App.updateHospital();
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
