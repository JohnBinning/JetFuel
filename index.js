
$('#links-section').prepend('strings or links')

const folderGenerator = (name) => {
  return(
    `<img src='http://icons.iconarchive.com/icons/dtafalonso/yosemite-flat/512/Folder-icon.png'>
     <h3>${name}</h3>`
  )
}

const thingToEnter = folderGenerator('an example title')

$('#links-section').prepend(thingToEnter)
