function on(usersid, title) {
    document.getElementById("notif").style.display = "block";
    document.getElementById("nextdelete").setAttribute("href", `users/delete/${usersid}`);
    document.getElementById(
      "ask"
    ).innerHTML = `Apakah kamu yakin akan menghapus data '${title}'?`;
    return false
  }
  
  function off() {
    document.getElementById("notif").style.display = "none";
  }