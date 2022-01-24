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
              const address = urlParams.get("id");

              userInstance.getRoleId(accounts[0]).then(function (id) {
                if (id == 1)
                  document.getElementById("reports-link").style.display =
                    "none";
                else if (id == 2) {
                  document.getElementById("hospitals-link").style.display =
                    "none";
                  document.getElementById("settings-link").style.display =
                    "none";
                } else if (id == 3) {
                  if (accounts[0] != address)
                    window.open(
                      `../WebPages/patients_report.html?id=${accounts[0]}`,
                      "_self"
                    );

                  document.querySelector("nav").style.display = "none";
                  document.querySelector("#back-button").style.display = "none";
                }
              });

              userInstance.getUsername(accounts[0]).then(function (name) {
                document.getElementById("nav-username").textContent = name;
              });

              patientInstance.getPatient(address).then(function (patient) {
                document.getElementById("patient-name").innerText = patient[0];
                const timeline = document.querySelector("ul.timeline");
                var date = new Date(patient[9].toNumber() * 1000);
                timeline.innerHTML = `<li id = "initial" class = "timeline-inverted">
                <div class="timeline-badge${App.getRandomColor()}">
                  <label style="font-size: x-small">${date.toLocaleDateString(
                    "en-US"
                  )}</label>
                </div>
                <div class="timeline-panel">
                  <div class="timeline-heading">
                    <h4 class="timeline-title">
                      <a
                        href="patients_update.html?id=${address}"
                        style="text-decoration: none"
                        >Initial Summary</a
                      >
                    </h4>
                  </div>
                  <div class="timeline-body">
                    <p>
                      This summary is created by ${
                        patient[8]
                      }. Please click the link above to see the details.
                    </p>
                  </div>
                </div>
              </li>`;

                //Will be binded with Patient Reports
                

                for (var i = 0; i < 5; i++) {
                  var oldHTML = document.querySelector("ul.timeline").innerHTML;
                  var inverted = (i % 2 == 0) ? "" : "-inverted";
                  document.querySelector("ul.timeline").innerHTML =
                    `<li class = "timeline${inverted}">
                              <div class="timeline-badge${App.getRandomColor()}">
                                <label style="font-size: x-small">${"00/00/0000"}</label>
                              </div>
                              <div class="timeline-panel">
                                <div class="timeline-heading">
                                  <h4 class="timeline-title">
                                    <a
                                      href="patients_update.html?id=${"NAN"}"
                                      style="text-decoration: none"
                                      >${i}</a
                                    >
                                  </h4>
                                </div>
                                <div class="timeline-body">
                                  <p>
                                    This summary is created by ${"NAN"}. Please click the link above to see the details.
                                  </p>
                                </div>
                              </div>
                            </li>` + oldHTML;
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

  getRandomColor: function () {
    var colors = ["", " danger", " success", " warning"];
    return colors[Math.floor(Math.random() * 4)];
  },
};

$(function () {
  $(window).load(function () {
    App.init();
    setTimeout(() => App.render(), 500);
  });
});
