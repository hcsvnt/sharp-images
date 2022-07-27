const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { parse } = require('path');

const inputDir = './input';
const outputDir = './output';
const acceptedFormats = ['.jpg', '.png'];


const compressionSettings = {
    jpg : {
        mozjpeg: true,
        quality: 60,
    },
    png: {
        quality: 60,
        compressionLevel: 9,
        effort: 10,
    },
    webp: {
        quality: 70,
    },
    avif : {
        quality: 60,
        chromaSubsampling: '4:2:0',
        effort: 7
    }
}


const logError = (error) => console.log(error);

function handleErrorHOF(fn, errorHandler) {
    return function() {
      fn().catch(errorHandler);
    }
}


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


const jpg = async(filePath, outputPath) => {
    // const startTime = Date.now();
    await sharp(filePath)
        .jpeg(compressionSettings.jpg)
        .toFile(outputPath)
        // .then(() => {
        //     const endTime = Date.now();
        //     console.log(`${filePath} processed in ${endTime - startTime}ms`);
        // })
}

const png = async(filePath, outputPath) => {
    await sharp(filePath)
        .png(compressionSettings.png)
        .toFile(outputPath)
}

const webp = async(filePath, extension, outputPath) => {
    await sharp(filePath)
        .toFormat('webp')
        .webp(compressionSettings.webp)
        .toFile(outputPath.replace(extension, '.webp'))
}

const avif = async(filePath, extension, outputPath) => {
    await sharp(filePath)
        .toFormat('avif')
        .avif(compressionSettings.avif)
        .toFile(outputPath.replace(extension, '.avif'))
}


async function runJPG(filePath) {
    const outputPath = filePath.replace(inputDir, outputDir);
    await jpg(filePath, outputPath);
    await webp(filePath, '.jpg', outputPath);
    await avif(filePath, '.jpg', outputPath);
}


async function runPNG(filePath) {
    const outputPath = filePath.replace(inputDir, outputDir);
    await png(filePath, outputPath);
    await webp(filePath, '.png', outputPath);
    await avif(filePath, '.png', outputPath);
}


async function processImages(filePaths) {
    await filePaths.forEach(filePath => {
        const extension = path.extname(filePath)

        if (extension === '.jpg') {
            runJPG(filePath);
        } else {
            runPNG(filePath);
        }
    })
}


const pathsToProcess = getPaths(inputDir);

async function processImages(filePaths) {
    console.log('Starting image processing!')
    const startTime = Date.now();
    // for (const filePath of filePaths) await runJPG(filePath);
    for (const filePath of filePaths) {
        const extension = path.extname(filePath)

        if (extension === '.jpg') {
            await runJPG(filePath);
        } else {
            await runPNG(filePath);
        }
    }
    const endTime = Date.now();
    return endTime - startTime;
}


processImages(pathsToProcess).then((time) => console.log(`All images processed in ${time}ms`));
