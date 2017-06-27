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

const displayFolders = () => {
  folderArray.forEach( folder => {
    $('#folders-section').prepend(folder)
  })
}

const clearInputs = () => {
  $('input').val('')
}

$('.submit-btn').on('click', (e) => {
  e.preventDefault()
  let folderVal = $('.input-folder').val()

  folderPush(folderHtmlGenerator(folderVal))
  $('#folders-section').html('')
  displayFolders()
  clearInputs()
})

const recipes = folderHtmlGenerator('recipes')
const norwegianCathedrals = folderHtmlGenerator('norwegian cathedrals')
const bestGrassSpecies = folderHtmlGenerator('best grass species')
const weedkiller = folderHtmlGenerator('weedkiller')
const pencilCups = folderHtmlGenerator('pencil cups')
const folderArray = [recipes, norwegianCathedrals, bestGrassSpecies, weedkiller, pencilCups]

//need to rename this function badly
const folderPush = (folder) => {
  folderArray.push(folder)
}

displayFolders()
