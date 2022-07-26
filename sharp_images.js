const sharp = require('sharp');
const { readdirSync, statSync } = require('fs');
const { join, basename, extname } = require('path')
const inputDir = './input';
const outputDir = '/output';
const possibleFormats = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

function isImage(file) {
  return possibleFormats.includes(extname(file))
}

function getAllImageFiles(dirPath, arrayOfFiles) {
  files = readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllImageFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (!isImage(file)) {
        return
      }
      arrayOfFiles.push(join(__dirname, dirPath, "/", file));
    }
  })

  return arrayOfFiles
}

async function handleImage(inputPath) {

  if (!isImage(inputPath)) {
    return
  }

  const imageBaseName = basename(inputPath);
  const imageOutputPath = __dirname + outputDir + '/' + imageBaseName;

  await sharp(inputPath)
    .jpeg({ 
        mozjpeg: true,
        quality: 60,
    })
    .png({
      quality: 60,
      compressionLevel: 9,
      effort: 10,
    })
    .webp({
      quality: 70,
    })
    .avif({
      quality: 60,
      chromaSubsampling: '4:2:0',
      effort: 6
    })
    .toFile(imageOutputPath, (err, info) => {
      if (err) {
        console.error({err})
      }
    });
}

const allFiles = getAllImageFiles(inputDir);
allFiles.forEach(image => handleImage(image));
