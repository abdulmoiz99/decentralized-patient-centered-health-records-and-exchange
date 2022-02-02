App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  statusChart: null,

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
    $.getJSON("/build/contracts/Report.json", function (Report) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Report = TruffleContract(Report);
      // Connect provider to interact with contract
      App.contracts.Report.setProvider(App.web3Provider);
    });
    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
      }
    });
  },

  calculateReportsCreated: function (data) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var backgroundColor = "rgba(78, 115, 223, 0.05)";
    var borderColor = "rgba(78, 115, 223, 1)";

    var ctx = document.getElementById("reportsCreated");
    App.statusChart = new Chart(ctx, {
      type: "line", 
      data: {
        labels: months,
        datasets: [
          {
            backgroundColor,
            borderColor,
            label: "Reports",
            fill: true,
            data,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                drawTicks: false,
                borderDash: [2],
                zeroLineBorderDash: [2],
                drawOnChartArea: false
              },
              ticks: {
                fontColor: "#858796",
                padding: 20
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                drawTicks: false,
                borderDash: [2],
                zeroLineBorderDash: [2],
                drawOnChartArea: false
              },
              ticks: {
                fontColor: "#858796",
                padding: 20
              }
            }
          ]
        }
      },
    });
  },

  calculatePatientsStatus: function (data) {
    var status = ["Healthy", "Sick", "Deceased"];
    var backgroundColor = ["#4e73df", "#1cc88a", "#36b9cc"];
    var borderColor = ["#ffffff", "#ffffff", "#ffffff"];

    var ctx = document.getElementById("patientsStatus");
    App.statusChart = new Chart(ctx, {
      type: "doughnut", 
      data: {
        labels: status,
        datasets: [
          {
            backgroundColor,
            borderColor,
            label: "Patient Status",
            data,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
      },
    });
  },

  changeChartType: function(type) {
    const menu = document.querySelector("#type-menu");

    menu.childNodes.forEach(function(typeButton) {
      if (typeButton.disabled) {
        typeButton.disabled = false;
      }
    });

    document.getElementById(type).disabled = true;

    var tempData = App.statusChart.data;
    
    App.statusChart.destroy();

    var ctx = document.getElementById("patientsStatus");
    App.statusChart = new Chart(ctx, {
      type, 
      data: tempData,
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
      },
    });
  },

  setGivenYears: function (stamp) {
    var firstYear = new Date(stamp.toNumber() * 1000).getFullYear();
    var currentYear = new Date().getFullYear();
    const menu = document.getElementById("year-menu");
    for (var i = currentYear; i >= firstYear; i--) {
      menu.innerHTML += `<button id = "${i}" class="dropdown-item" onclick = "App.showReportsCreated('${i}')">&nbsp;${i}</a>`
    }
    menu.children[1].disabled = true;
  },

  showReportsCreated: function (year) {
    const menu = document.getElementById("year-menu");

    menu.childNodes.forEach(function(yearButton) {
      if (yearButton.disabled) {
        yearButton.disabled = false;
      }
    });

    document.getElementById(String(year)).disabled = true;
  },

  render: async function () {
    var patientInstance = await App.contracts.Patient.deployed();
    var userInstance = await App.contracts.User.deployed();
    var reportInstance = await App.contracts.Report.deployed();
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
              web3.eth.getBlockNumber(function (error, result) {
                if (!error) $("#blocks").text(result);
              });
              web3.eth.getTransactionCount(
                accounts[0],
                function (error, count) {
                  if (!error) $("#transactions").text(count);
                }
              );
              web3.eth.getGasPrice(function (error, result) {
                if (!error) $("#price").text(result + " wei");
              });
              reportInstance.getFirstReportDate().then(function(stamp) {
                App.setGivenYears(stamp);
              })
              App.calculateReportsCreated([100, 200, 300, 400, 500, 600, 500, 400, 300, 200, 100, 50]);
              patientInstance.getPatientStatus().then(function(data) {
                App.calculatePatientsStatus(data);
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
