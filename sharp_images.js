const sharp = require('sharp');
const { readdirSync, statSync } = require('fs');
const { join, basename } = require('path')
const inputDir = './input';
const outputDir = '/output';

function getAllFiles(dirPath, arrayOfFiles) {
  files = readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(join(__dirname, dirPath, "/", file));
    }
  })

  return arrayOfFiles
}

async function JPG(inputPath) {
  const imageFileName = basename(inputPath);

  await sharp(inputPath)
    .jpeg({ mozjpeg: true })
    .toFile(__dirname + outputDir + '/' + imageFileName, (err, info) => {
      if (err) {
        console.error({err})
      }
      console.error({info})
    });
}

const allFiles = getAllFiles(inputDir);
allFiles.forEach(image => JPG(image));
