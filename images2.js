const sharp = require('sharp');
const fs = require('fs');
const { readdir } = require('fs/promises')
const { parse } = require('path')


console.log('hejka');

//   .then( data => { ... })
//   .catch( err => { ... });

const inputDir = './input';
const outputDir = './output';


async function JPG(inputPath, outputPath) {
    console.log('paths:', inputPath, outputPath)
    await sharp(inputPath)
        .jpeg({ mozjpeg: true })
        .toFile(outputPath, (err, info) => {
            console.log(info)
        }
    );
}


// let currentPath = inputDir;
const pathsToProcess = [];


async function findPaths(dir) {
    console.log('dir to scan', dir);

    let entries = await readdir(dir, { withFileTypes: true });


    entries.forEach(entry => {
        if (!entry.isDirectory()) {
            pathsToProcess.push(dir + '/' + parse(entry.name).base);
        } else {

            return new Promise(resolve => resolve(findPaths(dir + `/${entry.name}`)))
        }
    });

    // console.log(pathsToProcess)
}


async function imagesSharp(dir) {
    await findPaths(dir)
    .then(() => {
        console.log(pathsToProcess)
    })
}

imagesSharp(inputDir);
