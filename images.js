const fs = require('fs');
const Image = require('@11ty/eleventy-img')
const { readdir } = require('fs/promises')
const { parse } = require('path')


const inputDir = './input/';
const outputDir = './output/';


async function optimizePNG(filePath) {
    console.log('file to optimize in 11-ty:', filePath)
  const stats = await Image( filePath, {
        widths: [null],
        formats: ['webp', 'png'],
        outputDir: currentOutputPath,
        filenameFormat: (id, src, width, format) => {
            return `${parse(filePath).name}.${format}`
        },
    })
}

let currentPath = inputDir;
let currentOutputPath = outputDir
// filePath
async function iterateRecursively(dir) {
    let entries = await readdir(dir, { withFileTypes: true });
    console.log('entries:', entries)
    entries.forEach(entry => {
        if (!entry.isDirectory()) {
            const fileExtension = parse(entry.name).ext.toLowerCase();
            console.log('file:', entry.name, 'ext:', fileExtension)

            if (fileExtension === '.png') optimizePNG(currentPath + entry.name);
        } else {
            if (!fs.existsSync(`${outputDir}/${entry.name}`)) fs.mkdirSync(`${outputDir}/${entry.name}`);
            console.log('i am a folder:', entry);
            currentPath += `${entry.name}/`;
            currentOutputPath += `${entry.name}/`;
            console.log('the new current path:', currentPath);
            // iterateRecursively(`${inputDir}/${entry.name}`)
            iterateRecursively(currentPath)
        }
    })
}

iterateRecursively(inputDir);
