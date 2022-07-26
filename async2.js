const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { parse } = require('path');

const inputDir = './input';
const outputDir = './output';
const acceptedFormats = ['.jpg', '.png'];


const getPaths = (dirPath, imagePaths) => {

    imagePaths = imagePaths || [];
    const paths = fs.readdirSync(dirPath, { withFileTypes: true });

    paths.forEach(path => {

        const fileName = parse(path.name).base;
        const fileExt = parse(path.name).ext;

        if (path.isDirectory()) {
            const outputPath = dirPath.replace(inputDir, outputDir) + '/' + fileName;
            if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);
            imagePaths = getPaths(dirPath + '/' + fileName, imagePaths);
        } else if (acceptedFormats.includes(fileExt)) {
            imagePaths.push(dirPath + '/' + fileName);
        } else {
            console.log(fileName, ' is not an image, pal!');
        }
    })
    return imagePaths;
}


async function jpg(filePath, outputPath) {
    const startTime = Date.now();
    await sharp(filePath)
        .jpeg({
            mozjpeg: true,
            quality: 60,
        })
        .toFile(outputPath)
        .then(() => {
            const endTime = Date.now();
            console.log(`${filePath} processed in ${endTime - startTime}ms`);
        })
}


async function runJPG(filePath) {
    const outputPath = filePath.replace(inputDir, outputDir);
    await jpg(filePath, outputPath)
    console.log('jpg done')
}


async function processImages(filePaths) {
    const startTime = Date.now();
    for (const filePath of filePaths) await runJPG('./image.jpg');
    const endTime = Date.now();
    return endTime - startTime;
}

function makeSafe(fn, errorHandler) {
    return function() {
      fn().catch(errorHandler);
    }
}

function handleError(error) {
    console.log(error);
}

const pathsToProcess = getPaths(inputDir);
const withTimer = async () => processImages(pathsToProcess).then((time) => console.log(`all images processed in ${time}ms`))

const safeImages = makeSafe(withTimer, handleError);

// withTimer();
safeImages();
