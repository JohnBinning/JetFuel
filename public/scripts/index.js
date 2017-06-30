let foldersArray;
let matchingFolder;
const domain = 'localhost:3000';

const folderHtmlGenerator = (name) => {
  return(
    `
    <article class='folder' id='${name}'>
      <img src='./images/folder.svg' class='folder-icon' alt='folder icon'>
      <h2 class='folder-name'>${name}</h2>
    </article>
    `
  )
}

const linkHtmlGenerator = (linkObject, newUrl) => {
  return (
    `
        <article class='link ${newUrl}' id='${linkObject.id}'>
          <h2 class='${linkObject.name}'>
            <p>${linkObject.name}</p>
            <p id='link-text'>http://${domain}/api/${newUrl}</p>
          </h2>
        </article>
    `
  )
}

const displayLinks = (linksArray) => {
  linksArray.forEach( link => {
      const newUrl = `${link.shortened_url}`
      $('#folders-section').prepend(linkHtmlGenerator(link, newUrl))
      clickLinks(link)
  })
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

const incrementLinkVisits = (linkId) => {
  fetch(`/api/v1/links/click/${linkId}`)
    .then((response) => response.json())
    .then((res) => console.log('Increment link visits response: ', res))
  .catch((error) => console.log('Error incrementing link visits: ', error))
}

const redirectLink = (url) => {
  fetch(`/api/${url}`)
    .then((response) => response.json())
  .catch((error) => console.log('Error redirecting: ', error))
}

const clickLinks = () => {
  $('p').on('click', (e) => {
    const id = e.target.closest('.link').id;
    const url = e.target.closest('.link').classList[1];
    // incrementLinkVisits(linkId);
    redirectLink(url)
    window.location = `http://${domain}/api/${url}`
  })
}

const clickFolders = () => {
  $('.folder-icon').on('click', (e) => {
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

const displayFolders = (folderArray) => {
  folderArray.forEach((folder) => {
    $('#folders-section').prepend(folderHtmlGenerator(folder.name))
    clickFolders()
  })
}

const clearInputs = () => {
  $('input').val('')
}

const postFolder = (folderNameVal) => {

  const header = { "Content-Type": "application/json" };
  const body = { "name": `${folderNameVal}` };

  return fetch('/api/v1/folders', {method: "POST", headers: header, body: JSON.stringify(body)})
    .then(resp => resp.json())
    .then(id => {
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

$('.title').on('click', () => {
  location.reload()
})
