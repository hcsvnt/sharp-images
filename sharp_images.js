const sharp = require('sharp');
const { readdirSync, statSync, mkdirSync, existsSync } = require('fs');
const { join, basename, extname, parse, relative, dirname, sep } = require('path')
const inputDir = 'input';
const outputDir = 'output';
const possibleFormats = ['.jpg', '.jpeg', '.png']
const outputs = {
  jpeg: ['jpg', 'webp', 'avif'],
  png: ['png', 'webp', 'avif']
}

function inspectImage(file) {
  const extName = extname(file);
  const isImage = possibleFormats.includes(extName);
  return { isImage, extName }
}

function getAllImageFiles(dirPath, arrayOfFiles) {
  files = readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllImageFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (!inspectImage(file).isImage) {
        return
      }
      arrayOfFiles.push(join(__dirname, dirPath, "/", file));
    }
  })

  return arrayOfFiles
}

async function handleImage(inputPath) {
  // console.log({inputPath: parse(inputPath)})
  
  const relativeOutputPath = relative(__dirname, inputPath);
  const parsedPath = relativeOutputPath.split(sep)
  parsedPath[0] = outputDir;
  const finalOutputPath = parsedPath.join(sep);
  const finalDirName = dirname(finalOutputPath);
  const fileDetails = inspectImage(inputPath);
  const asdf = __dirname + '/' + finalDirName;


  if (!fileDetails.isImage) {
    return
  }

  if (!existsSync(asdf)){
    mkdirSync(asdf);
  }


  const imageBaseName = basename(inputPath, fileDetails.extName);
  const outputType = fileDetails.extName === '.jpg' || fileDetails.extName === '.jpeg' ? 'jpeg' :  fileDetails.extName === '.png' ? 'png' : null;
  
  if (!outputType) {
    return 
  }

  const outputsByExtType = outputs[outputType];

  outputsByExtType.forEach(async (ext) => {
  // const imageOutputPath = __dirname + '/' + outputDir + '/' + imageBaseName + '.' + ext;
  const imageOutputPath = __dirname + '/' + finalDirName + '/' + imageBaseName + '.' + ext;
  
    await sharp(inputPath)
      .toFormat(outputType)
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

  })

}

const allFiles = getAllImageFiles('./' + inputDir);
// console.log({allFiles, dir: __dirname})
allFiles.forEach(image => handleImage(image));
