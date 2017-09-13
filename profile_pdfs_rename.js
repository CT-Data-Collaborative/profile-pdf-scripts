const minimist = require('minimist');
const fs = require('fs');

const args = minimist(process.argv.slice(2)),
  source_dir = args.source.toString(),
  target_dir = args.target.toString(),
  year = args.year.toString();


const slug = (city) => {
    var $slug = city.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return $slug.toLowerCase();
};

const rename = (filename) => {
    const root = filename.split('.');
    if (root[1] == 'DS_Store') {

    } else {
      const nameSlug = slug(root[0]);
      const oldPath = source_dir + '/' + filename;
      const newPath = './' + target_dir + '/' + nameSlug + '-' + year + '.pdf';
      console.log(oldPath + "  ----->  " + newPath);
      fs.rename(oldPath, newPath);
    }

};


fs.readdir(source_dir, (err, data) => {
    data.forEach((p) => {
      if (p != source_dir + '/.DS_Store') {
        rename(p);
      }
    });
});

