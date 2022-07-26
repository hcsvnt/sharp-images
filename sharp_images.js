const sharp = require('sharp');
const fs = require('fs');
const path = require('path')
const inputDir = './input';
const outputDir = '/output';

const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

async function JPG(inputPath) {
  const imageFileName = path.basename(inputPath);

  await sharp(inputPath)
    .jpeg({ mozjpeg: true })
    .toFile(__dirname + outputDir + '/' + imageFileName, (err, info) => {
      if (err) {
        console.error({err})
      }
      console.error({info})
    });
}

const allFiles = getAllFiles(inputDir)
allFiles.forEach(image => JPG(image))