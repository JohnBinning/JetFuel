let foldersArray;
let matchingFolder;

const folderHtmlGenerator = (name) => {
  return(
    `
    <article class='folder'>
      <img src='./images/folder.svg' class='folder-icon' alt='folder icon'>
      <h2>${name}</h2>
    </article>
    `
  )
}

const getFolders = () => {
  fetch('/api/v1/folders')
    .then((resp) => resp.json())
    .then((folders) => {
      foldersArray = folders;
      displayFolders(folders);
    })
    .catch((error) => console.log('Problem retreiving folders: ', error))
}

const displayFolders = (folderArray) => {
  folderArray.forEach((folder) => {
    $('#folders-section').prepend(folderHtmlGenerator(folder.name))
  })
}

const clearInputs = () => {
  $('input').val('')
}

const postFolder = (folderNameVal) => {
  // console.log("POSTING FOLDER!!!!!!!!!!");

  const header = { "Content-Type": "application/json" };
  const body = { "name": `${folderNameVal}` };

  return fetch('/api/v1/folders', {method: "POST", headers: header, body: JSON.stringify(body)})
    .then(resp => resp.json())
    .then(id => {
      console.log(id, 'id in post folder');
      return id
    })
  .catch(error => console.log('Error retreiving folders: ', error))
}

const postLink = (linkNameVal, linkUrlVal, matchingFolder) => {
  // console.log('linkNameVal: ', linkNameVal);
  // console.log('linkUrlVal: ', linkUrlVal);
  // console.log('matchingFolder: ', matchingFolder);

  const header = { "Content-Type": "application/json" };
  const body = { "name": `${linkNameVal}`, "url": `${linkUrlVal}`, "folder_id": `${matchingFolder}` };

  fetch('/api/v1/links', {method: "POST", headers: header, body: JSON.stringify(body)});
}

$('.submit-btn').on('click', (e) => {
  e.preventDefault();
  let linkUrlVal = $('.input-url').val();
  let folderNameVal = $('.input-folder').val();
  let linkNameVal = $('.input-name').val();

  let matchingFolder = foldersArray.find((folder) => {
    return folder.name === folderNameVal
  })
console.log("********matchingFolder: ", matchingFolder);

  let folderToPass = 'default folder to pass';

  if (matchingFolder == undefined) {
    postFolder(folderNameVal)
      .then( folder_id => {
        console.log(folder_id, 'folder_id');
        postLink(linkNameVal, linkUrlVal, folder_id.id)
      })
  } else {
    postLink(linkNameVal, linkUrlVal, matchingFolder.id);
  }

  clearInputs();
  $('#folders-section').html('');
  getFolders();
})

getFolders()
