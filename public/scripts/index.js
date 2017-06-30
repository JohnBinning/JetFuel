let foldersArray = [];
let matchingFolder;
const domain = 'steelbirdfood.herokuapp.com';

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
      $('#folders-section').html('')
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

    if (!foldersArray.length) {
      return
    }

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

const validateUrl = (urlInput) => {
  let cleanUrl = getHostname(urlInput);

  return cleanUrl;
}

const getHostname = (urlInput) => {
  let nakedUrl = '';
  if (urlInput.includes('http://')) {
    let hostname;

    url.indexOf("://") > -1 ? hostname = url.split('/')[2] : hostname = url.split('/')[0]

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    nakedUrl = hostname;
    let verifiedUrl = verifyUrl(nakedUrl);
    return verifiedUrl;
  } else {
    nakedUrl = urlInput;
    let verifiedUrl = verifyUrl(nakedUrl);
    return verifiedUrl;
  }
  return verifiedUrl;
}

const verifyUrl = (nakedUrl) => {
  if (!nakedUrl.includes('.')) {
    $('form').prepend(`<p id='error-alert'>Please enter a valid URL</p>`)

    $('.input-url').on('focus', () => {
      $('#error-alert').html('')
    })
  } else {
    return nakedUrl;
  }
}

$('.search').on('keyup', (e) => {
  if(foldersArray && foldersArray.length) {
    $('#folders-section').html('')
    let filtered = foldersArray.filter(folder => {
      return folder.name.includes(e.target.value)
    })
    displayFolders(filtered)
  }

}

$('.submit-btn').on('click', (e) => {
  e.preventDefault();
  let linkUrlVal = $('.input-url').val();
  let folderNameVal = $('.input-folder').val();
  let linkNameVal = $('.input-name').val();

  const urlToStore = validateUrl(linkUrlVal);
  console.log(urlToStore);

  if (urlToStore) {
    let matchingFolder = foldersArray.find((folder) => {
      return folder.name === folderNameVal
    })

    let folderToPass = 'default folder to pass';

    if (matchingFolder == undefined) {
      postFolder(folderNameVal)
        .then( folder_id => {
          getFolders()
          postLink(linkNameVal, urlToStore, folder_id.id)
        })
    } else {
      postLink(linkNameVal, urlToStore, matchingFolder.id);
      getFolders();
    }

    clearInputs();
  }

})

getFolders()

$('.title').on('click', () => {
  location.reload()
})
