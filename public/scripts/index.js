let foldersArray = [];
let displayedLinkArray = [];
let mostToLeast = true;
const domain = 'steelbirdfood.herokuapp.com';

const clearInputs = (linkUrlVal, folderNameVal, linkNameVal) => {
  if (linkUrlVal !== '' || folderNameVal !== '' || linkNameVal !== '') {
    $('input').val('');
  }
};

const findMatchingFolder = (foldersArray, folderNameVal) => {
  return foldersArray.find((folder) => {
    return folder.name === folderNameVal;
  });
};

const verifyTld = (hostname) => {
  if (!hostname.includes('.')) {
    $('form').prepend(`<article class='error-alert'><p class='error-alert-text'>Please enter a valid URL</p></article>`);

    $('.input-url').on('focus', () => {
      $('.error-alert').empty();
    });
  } else {
    return hostname;
  }
};

const getHostname = (urlInput) => {
  let hostname;
  let verifiedUrl;
  if (urlInput.includes('http://') || urlInput.includes('https://')) {

    hostname = urlInput.split('://')[1];

    verifiedUrl = verifyTld(hostname);
    return verifiedUrl;
  } else {
    hostname = urlInput;
    verifiedUrl = verifyTld(hostname);
    return verifiedUrl;
  }
  return verifiedUrl;
};

const removeProtocol = (urlInput) => {
  let cleanUrl = getHostname(urlInput);

  return cleanUrl;
};

const incompleteFormErrorMessage = () => {
  $('form').prepend(`<article class='error-alert'><p class='error-alert-text'>Please fill out all input fields</p></article>`);

  $('.error-alert').on('focus', () => {
    $('.error-alert').empty();
  });
};

const successMessage = (name) => {
  $('form').append(`<article class='success-message'><p class='success-message-text'>SUCCESS! Your shortened link is in the ${name} folder below!</p></article>`);

  $('form').on('focusout', () => {
    $('.success-message').empty();
  });
};

const postFolder = (folderNameVal) => {

  const header = { "Content-Type": "application/json" };
  const body = { "name": `${folderNameVal}` };

  return fetch('/api/v1/folders', {method: "POST", headers: header, body: JSON.stringify(body)})
    .then(resp => resp.json())
    .then(id => {

      return id;
    })
  .catch(error => console.log('Error retreiving folders: ', error));
};

const getFolders = () => {
  fetch('/api/v1/folders')
    .then((resp) => resp.json())
    .then((folders) => {
      foldersArray = folders;
      $('#folders-section').empty();
      displayFolders(folders);
    })
    .catch((error) => console.log('Problem retreiving folders: ', error));
};

$('.submit-btn').on('click', (e) => {
  e.preventDefault();

  $('.error-alert').empty();

  let linkUrlVal = $('.input-url').val();
  let folderNameVal = $('.input-folder').val();
  let linkNameVal = $('.input-name').val();

  if (linkUrlVal === '' || folderNameVal === '' || linkNameVal === '') {
    incompleteFormErrorMessage();
  }

  const urlToStore = removeProtocol(linkUrlVal);

  if (urlToStore) {
    let matchingFolder = findMatchingFolder(foldersArray, folderNameVal);

    if (matchingFolder == undefined && urlToStore.includes('.') && linkUrlVal !== '' && folderNameVal !== '' && linkNameVal !== '') {
      postFolder(folderNameVal)
        .then( folder_id => {
          getFolders();
          postLink(linkNameVal, urlToStore, folder_id.id);
          successMessage(folderNameVal);
          clearInputs(linkUrlVal, folderNameVal, linkNameVal);
        })
        .catch((error) => console.log('Error posting folder: ', error));
    } else {
      getFolders();
      postLink(linkNameVal, urlToStore, matchingFolder.id);
      successMessage(folderNameVal);
      clearInputs(linkUrlVal, folderNameVal, linkNameVal);
    }

  }
});

const folderHtmlGenerator = (name) => {
  return(
    `
    <article class='folder' id='${name}'>
      <div class='folder-icon' alt='folder icon'></div>
      <h2 class='folder-name'>${name}</h2>
    </article>
    `
  );
};

const displayLinks = (linksArray) => {
  $('#folders-section').empty();
  return mostToLeast ? appendLinks(linksArray) : prependLinks(linksArray);
};

const clickFolders = () => {
  $('.folder-icon').on('click', (e) => {
    $('.search').addClass('hidden');
    $('h3').addClass('hidden');
    $('.sort-by-visits').removeClass('hidden');

    let folderName = e.target.closest('.folder').id;

    if (!foldersArray.length) {
      return;
    }

    let newMatchingFolder = foldersArray.find( folder => {
      return folder.name === folderName;
    });
    fetch(`/api/v1/folders/${newMatchingFolder.id}/links`)
      .then((response) => response.json())
      .then((linksArray) => {
        displayedLinkArray = linksArray;
        displayLinks(linksArray);
      })
    .catch((error) => console.log('error retrieving links: ', error));
  });
};

const linkHtmlGenerator = (linkObject, newUrl) => {
  return (
    `
    <article class='link ${newUrl} ${linkObject.visits}' id='${linkObject.id}'>
      <h2 class='${linkObject.name}'>
        <p>${linkObject.name}</p>
        <a id='link-text' href='http://${domain}/api/${newUrl}' target='_blank' rel='noopener noreferrer'>http://${domain}/api/${newUrl}</a>
        <p>visited: ${linkObject.visits} times</p>
      </h2>
    </article>
    `
  );
};

const appendLinks = (linksArray) => {
  linksArray.forEach( link => {
    const newUrl = `${link.shortened_url}`;
    $('#folders-section').append(linkHtmlGenerator(link, newUrl));
    clickLinks(link);
  });
};

const prependLinks = (linksArray) => {
  linksArray.forEach( link => {
    const newUrl = `${link.shortened_url}`;
    $('#folders-section').prepend(linkHtmlGenerator(link, newUrl));
    clickLinks(link);
  });
};


const clickLinks = () => {
  $('a').on('click', (e) => {
    const id = e.target.closest('.link').id;
    incrementLinkVisits(id);
  });
};

// link section server requests

const incrementLinkVisits = (linkId) => {
  fetch(`/api/v1/links/click/${linkId}`)
    .then((response) => response.json())
  .catch((error) => console.log('Error incrementing link visits: ', error));
};

const postLink = (linkNameVal, linkUrlVal, matchingFolder) => {

  const header = { "Content-Type": "application/json" };
  const body = { "name": `${linkNameVal}`, "url": `${linkUrlVal}`, "folder_id": `${matchingFolder}`, "visits": 0 };

  fetch('/api/v1/links', {method: "POST", headers: header, body: JSON.stringify(body)});
};

const displayFolders = (folderArray) => {
  folderArray.forEach((folder) => {
    $('#folders-section').prepend(folderHtmlGenerator(folder.name));
    clickFolders();
  });
};

$('.search').on('keyup', (e) => {
  if(foldersArray && foldersArray.length) {
    $('#folders-section').empty();
    let filtered = foldersArray.filter(folder => {
      return folder.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    displayFolders(filtered);
  }
});

$('.sort-by-visits').on('click', () => {
  sortLinks();
  mostToLeast = !mostToLeast;
});

const sortLinks = () => {
  const sortedMostLeastLinks = displayedLinkArray.sort((a, b) => {
    return a.visits < b.visits;
  });

  displayLinks(sortedMostLeastLinks);
};

$('.title').on('click', () => {
  location.reload();
});

getFolders();
