App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  statusChart: null,
  reportsChart: null,
  reportsData: {},
  todos: null,

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

  calculateReportsCreated: function (data) {
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var backgroundColor = "rgba(78, 115, 223, 0.05)";
    var borderColor = "rgba(78, 115, 223, 1)";

    var ctx = document.getElementById("reportsCreated");
    App.reportsChart = new Chart(ctx, {
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
          display: false,
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
                drawOnChartArea: false,
              },
              ticks: {
                fontColor: "#858796",
                padding: 20,
              },
            },
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
                drawOnChartArea: false,
              },
              ticks: {
                fontColor: "#858796",
                padding: 20,
              },
            },
          ],
        },
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
          display: false,
        },
      },
    });
  },

  changeChartType: function (type) {
    const menu = document.querySelector("#type-menu");

    menu.childNodes.forEach(function (typeButton) {
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
          display: false,
        },
      },
    });
  },

  showReportsCreated: function (year) {
    const menu = document.getElementById("year-menu");
    App.reportsChart.data.datasets[0].data = App.reportsData[year];
    App.reportsChart.update();
    menu.childNodes.forEach(function (yearButton) {
      if (yearButton.disabled) {
        yearButton.disabled = false;
      }
    });

    document.getElementById(String(year)).disabled = true;
  },

  deleteTodo: function (id) {
    const deleteTodo = document.getElementById(id);
    const todoMenu = document.getElementById("todo");
    todoMenu.removeChild(deleteTodo.parentElement.parentElement);

    for (var i = 0; i < App.todos.length; i++) {
      if (App.todos[i].name == id) {
        App.todos.splice(i, 1);
        break;
      }
    }
    localStorage.setItem("todos", JSON.stringify(App.todos));
    App.updateTodoCard();
  },

  toggleCheck: function (id) {
    for (var i = 0; i < App.todos.length; i++) {
      if (App.todos[i].name == id) {
        App.todos[i].completed = document.getElementById(id + " " + id).checked;
        break;
      }
    }
    localStorage.setItem("todos", JSON.stringify(App.todos));
    App.updateTodoCard();
  },

  updateTodoCard: function () {
    var completedCount = 0;
    const todoPercentage = document.getElementById("todoText");
    const todoBar = document.getElementById("todoBar");

    if (App.todos.length == 0 || App.todos == undefined) {
      todoPercentage.textContent = "100%";
      todoBar.ariaValueNow = 100;
      todoBar.style.width = "100%";
      todoBar.children[0].textContent = "100%";
      return;
    }

    for (var i = 0; i < App.todos.length; i++) {
      if (App.todos[i].completed) completedCount++;
    }

    var value = Math.floor((completedCount / App.todos.length) * 100);
    todoPercentage.textContent = `${value}%`;
    todoBar.ariaValueNow = value;
    todoBar.style.width = `${value}%`;
    todoBar.children[0].textContent = `${value}%`;
  },

  render: async function () {
    if (localStorage.getItem("todos")) {
      App.todos = JSON.parse(localStorage.getItem("todos"));
    } else {
      App.todos = [];
      localStorage.setItem("todos", JSON.stringify(App.todos));
    }

    const todoMenu = document.getElementById("todo");

    for (var i = 0; i < App.todos.length; i++) {
      todoMenu.innerHTML += `<li class="list-group-item">
      <div class="row align-items-center no-gutters">
          <div class="col me-2" ondblclick="App.deleteTodo('${
            App.todos[i].name
          }')" id = "${App.todos[i].name}">
              <h6 class="mb-0"><strong>${
                App.todos[i].name
              }</strong></h6><span class="text-xs">${App.todos[i].time}</span>
          </div>
          <div class="col-auto">
            <div class="form-check"><input ${
              App.todos[i].completed ? "checked" : ""
            } class="form-check-input" id = "${App.todos[i].name} ${
        App.todos[i].name
      }" onchange = "App.toggleCheck('${
        App.todos[i].name
      }')" type="checkbox"><label class="form-check-label"></label></div>
          </div>
      </div>
  </li>`;
    }

    App.updateTodoCard();

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

              reportInstance.getAllReports().then(function (reports) {
                const menu = document.getElementById("year-menu");
                reports.forEach(function (report) {
                  var date = new Date(report.toNumber() * 1000);
                  var year = date.getFullYear();
                  if (App.reportsData[year] == undefined) {
                    App.reportsData[year] = [
                      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                    menu.innerHTML += `<button id = "${year}" class="dropdown-item" onclick = "App.showReportsCreated('${year}')">&nbsp;${year}</a>`;
                  }
                  var monthIndex = date.getMonth();
                  App.reportsData[year][monthIndex]++;
                });
                if (menu.children.length > 1) menu.children[1].disabled = true;
                App.calculateReportsCreated(
                  App.reportsData[new Date().getFullYear()]
                );
              });

              reportInstance
                .getAllHospitalAddress()
                .then(async function (addresses) {
                  var topReports = {};
                  addresses.forEach(function (address) {
                    if (topReports[address] == undefined) {
                      topReports[address] = 0;
                    }
                    topReports[address]++;
                  });

                  //Calculating Percentages and Ranking Top 5
                  var total = 0;
                  for (var address in topReports) total += topReports[address];
                  for (var address in topReports) {
                    topReports[address] *= 100 / total;
                    topReports[address] = Math.floor(topReports[address]);
                  }
                  const keys = Object.keys(topReports);
                  topReports.top5 = keys
                    .sort((key1, key2) => topReports[key2] - topReports[key1])
                    .slice(0, 5);

                  const topBody = document.getElementById("topReports");
                  for (var rank in topReports.top5) {
                    var hospitalAddress = topReports.top5[rank];
                    var percentage = topReports[hospitalAddress];
                    var color;
                    if (percentage < 17) color = "bg-secondary";
                    else if (percentage >= 17 && percentage < 34)
                      color = "bg-success";
                    else if (percentage >= 34 && percentage < 51)
                      color = "bg-info";
                    else if (percentage >= 51 && percentage < 68)
                      color = "bg-warning";
                    else if (percentage >= 68 && percentage < 85)
                      color = "bg-danger";
                    else color = "";
                    await userInstance
                      .getUsername(hospitalAddress)
                      .then(function (name) {
                        topBody.innerHTML +=
                          `<h4 class="small fw-bold">${name}<span class="float-end">${percentage}%</span></h4>
                    <div class="progress mb-4">
                        <div class="progress-bar ` +
                          color +
                          `" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100" style="width: ${percentage}%;"><span class="visually-hidden">${percentage}%</span></div>
                    </div>`;
                      });
                  }
                });

              patientInstance.getPatientStatus().then(function (data) {
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

$("#address").on("keyup", function (e) {
  if (e.key === "Enter" || e.keyCode === 13) {
    for (var i = 0; i < App.todos.length; i++) {
      if (App.todos[i].name == $("#address").val()) {
        alert("Todo already exists!");
        return;
      }
    }

    const todoInstance = {
      name: $("#address").val(),
      time: new Date().toLocaleString(),
      completed: false,
    };

    $("#address").val("");

    App.todos.push(todoInstance);
    localStorage.setItem("todos", JSON.stringify(App.todos));

    App.updateTodoCard();

    document.getElementById("todo").innerHTML += `<li class="list-group-item">
      <div class="row align-items-center no-gutters">
          <div class="col me-2" ondblclick="App.deleteTodo('${
            todoInstance.name
          }')" id = "${todoInstance.name}">
              <h6 class="mb-0"><strong>${
                todoInstance.name
              }</strong></h6><span class="text-xs">${todoInstance.time}</span>
          </div>
          <div class="col-auto">
              <div class="form-check"><input ${
                todoInstance.completed ? "checked" : ""
              } class="form-check-input" id = "${todoInstance.name} ${
      todoInstance.name
    }" onchange = "App.toggleCheck('${
      todoInstance.name
    }')" type="checkbox"><label class="form-check-label"></label></div>
          </div>
      </div>
  </li>`;
  }
});

$(function () {
  $(window).load(function () {
    App.init();
    setTimeout(() => App.render(), 500);
  });
});

ethereum.on("accountsChanged", function () {
  location.reload();
});
