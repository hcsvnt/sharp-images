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
        outputDir: outputDir,
        filenameFormat: (id, src, width, format) => {
            return `${parse(filePath).name}.${format}`
        },
    })
}

let currentPath = inputDir;
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
            // iterateRecursively(`${inputDir}/${entry.name}`)
        }
    })
}

iterateRecursively(inputDir);
