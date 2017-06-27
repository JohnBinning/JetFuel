const folderGenerator = (name) => {
  return(
    `
    <article class='folder'>
      <img src='./images/folder.svg' class='folder-icon' alt='folder icon'>
      <h2>${name}</h2>
    </article>`
  )
}

const recipes = folderGenerator('recipes')
const norwegianCathedrals = folderGenerator('norwegian cathedrals')
const bestGrassSpecies = folderGenerator('best grass species')
const weedkiller = folderGenerator('weedkiller')
const pencilCups = folderGenerator('pencil cups')

$('#links-section').prepend(pencilCups)
$('#links-section').prepend(weedkiller)
$('#links-section').prepend(bestGrassSpecies)
$('#links-section').prepend(norwegianCathedrals)
$('#links-section').prepend(recipes)
