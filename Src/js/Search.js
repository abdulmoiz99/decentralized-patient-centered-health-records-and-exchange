function Search() {
    var input, filter, table, tr, name, i, nameValue, address;
    input = document.getElementById("search-bar");
    filter = input.value.toUpperCase();
    table = document.getElementById("dataTable");
    tr = table.getElementsByTagName("tr");
  
    for (i = 1; i < tr.length - 1; i++) {
      name = tr[i].getElementsByTagName("td")[1].firstChild;
      address = tr[i].getElementsByTagName("td")[3];
      if (name || address) {
        nameValue = name.textContent || name.innerText;
        addressValue = address.textContent || address.innerText;
        if (nameValue.toUpperCase().indexOf(filter) > -1 || addressValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }