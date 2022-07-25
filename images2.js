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


let currentPath = inputDir;


async function findPaths(dir) {
    console.log('dir to scan', dir)
    let entries = await readdir(dir, { withFileTypes: true });

    // const paths = entries.map(entry => dir + parse(entry.name).base);
    // console.log(paths);
    const paths = [];

    entries.forEach(entry => {
        if (!entry.isDirectory()) {
            paths.push(dir + '/' + parse(entry.name).base);
        } else {
            currentPath += `/${entry.name}`;
            findPaths(currentPath);
        }
    });
    return paths;
}


async function imagesSharp(path) {
    const pathsToProcess = await findPaths(path);
    console.log(pathsToProcess)
}

imagesSharp(inputDir);
