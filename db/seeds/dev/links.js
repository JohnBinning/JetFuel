let linksData = [
  {
    name: 'the cake is a lie',
    url: 'https://www.bettycrocker.com/recipes/black-forest-cake/4e66caed-4e29-4154-a92d-27332162baa4',
    folder_id: 1,
    shortened_url: 'http://localhost:3000/S16l-hWNZ',
    visits: 4
  },
  {
    name: 'gargoyle',
    url: 'https://lh3.googleusercontent.com/-ey0YbW6r-mA/VUeTA8R6LFI/AAAAAAAAAQw/i0BJ_-UuQ4w/s640/blogger-image-2097924919.jpg',
    folder_id: 1,
    shortened_url: 'http://localhost:3000/rJccW3ZV-',
    visits: 3
  },
  {
    name: 'crab grass',
    url: 'http://www.garden-counselor-lawn-care.com/getting-rid-of-crab-grass.html',
    folder_id: 1,
    shortened_url: 'http://localhost:3000/Sy1rzlzVb',
    visits: 8
  },
  {
    name: 'vinegar weedkiller recipe',
    url: 'http://www.garden-counselor-lawn-care.com/vinegar-weed-killer.html',
    folder_id: 1,
    shortened_url: 'http://localhost:3000/9Djee873K',
    visits: 93
  },
  {
    name: 'dwight pencil cup',
    url: 'http://3.bp.blogspot.com/-hGy0r-Zej60/UTZetVp5iTI/AAAAAAAABxE/pUwniVN5TY4/s1600/pencilcup.jpg',
    folder_id: 1,
    shortened_url: 'http://localhost:3000/Hih83no2Kj2',
    visits: 7
  },
  {
    name: 'writing instruments worthy of my pencil cup',
    url: 'https://financesonline.com/10-most-expensive-writing-instruments-in-the-world/',
    folder_id: 1,
    shortened_url: 'http://localhost:3000/98j2kLWa9ah',
    visits: 7
  }
]

const createLink = (knex, link) => {
  return knex('links').insert({ //knex.insert is a Promise and MUST be returned
    name: link.name,
    url: link.url,
    folder_id: link.folder_id,
    shortened_url: link.shortened_url,
    visits: link.visits
  }, 'id')
};

exports.seed = (knex, Promise) => {
  return knex('links').del() // delete footnotes first
    .then(() => {
      let linkPromises = []; //leverage Promise.all to generate a promise for each footnote we're inserting

      linksData.forEach(link => { //can't loop through anything in the insert step of knex
        linkPromises.push(createLink(knex, link));
      });

      return Promise.all(linkPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
