
$('#links-section').prepend('strings or links')

const folderGenerator = (name) => {
  return(
    `
    <article class='folder'>
      <img src='http://icons.iconarchive.com/icons/dtafalonso/yosemite-flat/512/Folder-icon.png'>
      <h3>${name}</h3>
    </article>`
  )
}

const thingToEnter = folderGenerator('an example title')

$('#links-section').prepend(thingToEnter)
