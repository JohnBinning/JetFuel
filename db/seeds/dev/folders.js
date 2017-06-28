let foldersData = [{
  name: 'recipes'
},
{
  name: 'Norwegian cathedrals'
},
{
  name: 'best grass species'
},
{
  name: 'weedkiller'
},
{
  name: 'pencil cups'
}
]

const createFolder = (knex, folder) => {
  return knex('folders').insert({ //knex.insert is a Promise and MUST be returned
    name: folder.name
  }, 'id')
};

exports.seed = (knex, Promise) => {
  return knex('folders').del() // delete footnotes first
    .then(() => {
      let folderPromises = []; //leverage Promise.all to generate a promise for each footnote we're inserting

      foldersData.forEach(folder => { //can't loop through anything in the insert step of knex
        folderPromises.push(createFolder(knex, folder));
      });

      return Promise.all(folderPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
