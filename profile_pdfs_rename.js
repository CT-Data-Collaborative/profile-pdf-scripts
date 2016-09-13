var fs = require('fs')


fs.readdir('pdfs', (err, data) => {
    data.forEach(function(p) {
        rename(p);
    });
});

slug = function(city) {
    var $slug = city.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return $slug.toLowerCase();
}

rename = function(filename) {
    var root = filename.split('.');
    var nameSlug = slug(root[0]);
    var oldPath = 'pdfs/' + filename;
    var newPath = './' + nameSlug + '.pdf';
    fs.rename(oldPath, newPath);
}
