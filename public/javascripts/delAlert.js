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

function on(id, name) {
    document.getElementById("notif").style.display = "block";
    document.getElementById("nextdelete").setAttribute("href", `/delete/${id}`);
    document.getElementById(
      "ask"
    ).innerHTML = `Apakah kamu yakin akan menghapus data '${name}'?`;
  }
  
  function off() {
    document.getElementById("notif").style.display = "none";
  }