let foldersArray;
let matchingFolder;
const domain = 'localhost:3000'

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

//<a href='${linkObject.shortened_url}' target='__blank'>
const linkHtmlGenerator = (linkObject) => {
  return (
    `
      <article class='link ${linkObject.shortened_url}' id='${linkObject.id}'>
          <h2 class='${linkObject.name}'>${linkObject.name}</h2>
          <p class='${linkObject.id}'>${linkObject.shortened_url}</p>
      </article>
    `
  )
}

const displayLinks = (linksArray) => {
  linksArray.forEach( link => {
      $('#folders-section').prepend(linkHtmlGenerator(link))
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


const clickLinks = () => {
  $('h2').on('click', (e) => {
    let linkId = e.target.closest('.link').id;
    let linkShortenedUrl = e.target.closest('.link').classList[1];
    console.log('Second class of clicked link: ', linkShortenedUrl);
    fetch(`/api/${linkId}/${linkShortenedUrl}`)
      .then((response) => response.json())
      .then((res) => {
        console.log(JSON.parse(res), 'clicklinks rsponse');

      })
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
        getFolders()
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
