// function openDeleteModal(id, title) {
//     document.getElementById('deleteModal').style.display = 'block';
//   }

//   function closeDeleteModal() {
//     document.getElementById('deleteModal').style.display = 'none';
//   }
// function opendialog(id, title){
//     document.getElementById('deleteConfirm').style.display = 'block'
//     document.getElementById('dialog').innerHTML = `Are you sure you want to delete '${title}'?`
//     document.getElementById('confirmed').setAttribute("href" , `/users/delete/${id}`)
// }

// function closeDialog() {
//     document.getElementById('deleteConfirm').style.display = 'none';
// }
// lokasi file javascript/delAlert
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