function Search() {
    var input, filter, table, tr, name, i, nameValue, address, count;
    input = document.getElementById("search-bar");
    filter = input.value.toUpperCase();
    table = document.getElementById("dataTable");
    tr = table.getElementsByTagName("tr");
    count = 0;
    for (i = 1; i < tr.length - 1; i++) {
      name = tr[i].getElementsByTagName("td")[0].firstChild;
      address = tr[i].getElementsByTagName("td")[2];
      if (name || address) {
        nameValue = name.textContent || name.innerText;
        addressValue = address.textContent || address.innerText;
        if (nameValue.toUpperCase().indexOf(filter) > -1 || addressValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          count++;
        } else {
          tr[i].style.display = "none";
        }
      }
    }

    document.getElementById("dataTable_info").textContent = `Showing ${count} out of ${tr.length - 2} result(s)`
  }