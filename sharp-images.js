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


const jpg = async(filePath, outputPath) => {
    const image = await sharp(filePath)
        .jpeg({
            mozjpeg: true,
            quality: 60,
        })
        .toFile(outputPath, (error, info) => console.log(info))
        // .stats()
        // .then(stats => console.log(stats))
}

const png = (filePath, outputPath) => {
    sharp(filePath)
        .png({
            quality: 60,
            compressionLevel: 9,
            effort: 10,
        })
        .toFile(outputPath, (error, info) => console.log(info))
}

const webp = (filePath, extension, outputPath) => {
    sharp(filePath)
        .toFormat('webp')
        .webp({
            quality: 70,
        })
        .toFile(outputPath.replace(extension, '.webp'), (error, info) => console.log(info))
}

const avif = (filePath, extension, outputPath) => {
    sharp(filePath)
        .toFormat('avif')
        .avif({
            quality: 60,
            chromaSubsampling: '4:2:0',
            effort: 7
        })
        .toFile(outputPath.replace(extension, '.avif'), (error, info) => console.log(info))
}


function runJPG(filePath) {
    const outputPath = filePath.replace(inputDir, outputDir);
    jpg(filePath, outputPath);
    // webp(filePath, '.jpg', outputPath);
    // avif(filePath, '.jpg', outputPath);
}


function runPNG(filePath) {
    const outputPath = filePath.replace(inputDir, outputDir);
    png(filePath, outputPath);
    webp(filePath, '.png', outputPath);
    avif(filePath, '.png', outputPath);
}


const pathsToProcess = getPaths(inputDir);


async function processImages(filePaths) {
    await filePaths.forEach(filePath => {
        const extension = path.extname(filePath)

        if (extension === '.jpg') {
            runJPG(filePath);
        } else {
            // runPNG(filePath);
        }
    })
}

// processImages(pathsToProcess);

function imagesSharp(paths) {
    processImages(paths)
    console.log('finished processing images!')
}

imagesSharp(pathsToProcess)
