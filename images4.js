const sharp = require('sharp');
const fs = require('fs');
const path = require('path')
const { parse } = require('path')
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


async function JPG(filePath) {

    const outputPath = filePath.replace(inputDir, outputDir);

    // try {
    //     await sharp(filePath)
    //         .jpeg({ mozjpeg: true })
    //         .toFile(outputPath, (error, info) => console.log(info))
    // } catch (error) {
    //     console.log(error);
    // }

    await sharp(filePath)
        .jpeg({ mozjpeg: true })
        .toFile(outputPath, (error, info) => console.log(info))
    await sharp(filePath)
        .toFormat('webp')
        .webp({ })
        .toFile(outputPath.replace('jpg', 'webp'), (error, info) => console.log(info))
}


async function PNG(filePath) {

    const outputPath = filePath.replace(inputDir, outputDir);

    // try {
    //     await sharp(filePath)
    //         .png({ })
    //         .toFile(outputPath, (error, info) => console.log(info))
    // } catch (error) {
    //     console.log(error);
    // }

    await sharp(filePath)
        .png({ })
        .toFile(outputPath, (error, info) => console.log(info))
    await sharp(filePath)
        .toFormat('webp')
        .webp({ })
        .toFile(outputPath.replace('png', 'webp'), (error, info) => console.log(info))
}


const pathsToProcess = getPaths(inputDir);


async function processImages(filePaths) {
    filePaths.forEach(filePath => {

        const extension = path.extname(filePath)
        console.log('extension:', extension);

        if (extension === '.jpg') {
            JPG(filePath);
        } else {
            PNG(filePath);
        }
    })
}

processImages(pathsToProcess);
