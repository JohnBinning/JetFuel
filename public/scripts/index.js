let foldersArray;
let matchingFolder;

function folderHtmlGenerator(name) {
  return(
    `
    <article class='folder' id='${name}'>
      <img src='./images/folder.svg' class='folder-icon' alt='folder icon'>
      <h2 class='folder-name'>${name}</h2>
    </article>
    `
  )
}

const linkHtmlGenerator = (linkObject) => {
  return (
    `
      <article class='link' id='${linkObject.name}'>
        <a href='${linkObject.shortened_url}' target='__blank'>
          <h2 class='${linkObject.name}'>${linkObject.name}</h2>
        </a>
      </article>
    `
  )
}

const displayLinks = (linksArray) => {
  linksArray.map( link => {
    return $('#folders-section').prepend(linkHtmlGenerator(link))
  })
}

function getFolders()  {
  fetch('/api/v1/folders')
    .then(function(resp){
      return resp.json()
    })
    .then(function(folders) {
      foldersArray = folders;
      displayFolders(folders);
    })
    .catch((error) => console.log('Problem retreiving folders: ', error))
}

function clickFolders() {
  $('.folder-icon').on('click', function(e) {
    let folderName = e.target.closest('.folder').id
    let newMatchingFolder = foldersArray.find( folder => {
      return folder.name === folderName
    })
    fetch(`/api/v1/folders/${newMatchingFolder.id}/links`)
      .then((response) => response.json())
      .then((linksArray) => {
        $('#folders-section').html('')
        displayLinks(linksArray)
      })
  })
}

function displayFolders (folderArray) {
  folderArray.forEach(function(folder) {
    $('#folders-section').prepend(folderHtmlGenerator(folder.name))
    clickFolders()
  })
}

const clearInputs = () => {
  $('input').val('')
}

function postFolder (folderNameVal) {

  const header = { "Content-Type": "application/json" };
  const body = { "name": `${folderNameVal}` };

  return fetch('/api/v1/folders', {method: "POST", headers: header, body: JSON.stringify(body)})
    .then(resp => resp.json())
    .then(id => {
      return id
    })
  .catch(error => console.log('Error retreiving folders: ', error))
}

function postLink(linkNameVal, linkUrlVal, matchingFolder) {
  // console.log('linkNameVal: ', linkNameVal);
  // console.log('linkUrlVal: ', linkUrlVal);
  // console.log('matchingFolder: ', matchingFolder);

  const header = { "Content-Type": "application/json" };
  const body = { "name": `${linkNameVal}`, "url": `${linkUrlVal}`, "folder_id": `${matchingFolder}` };

  fetch('/api/v1/links', {method: "POST", headers: header, body: JSON.stringify(body)});
}

$('.submit-btn').on('click', function(e) {
  e.preventDefault();
  let linkUrlVal = $('.input-url').val();
  let folderNameVal = $('.input-folder').val();
  let linkNameVal = $('.input-name').val();

  let matchingFolder = foldersArray.find((folder) => {
    return folder.name === folderNameVal
  })

  let folderToPass = 'default folder to pass';

  if (matchingFolder == undefined) {
    postFolder(folderNameVal)
      .then( folder_id => {
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
