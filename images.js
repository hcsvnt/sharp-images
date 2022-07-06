const fs = require('fs');
const Image = require('@11ty/eleventy-img')
const { readdir } = require('fs/promises')
const { parse } = require('path')


const inputDir = './input/';
const outputDir = './output/';


async function optimizePNG(filePath) {
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
let currentOutputPath = outputDir;


async function iterateRecursively(dir) {
    let entries = await readdir(dir, { withFileTypes: true });
    entries.forEach(entry => {
        if (!entry.isDirectory()) {
            const fileExtension = parse(entry.name).ext.toLowerCase();
            if (fileExtension === '.png') optimizePNG(currentPath + entry.name);
        } else {
            if (!fs.existsSync(`${currentOutputPath}/${entry.name}`)) fs.mkdirSync(`${currentOutputPath}/${entry.name}`);
            currentPath += `${entry.name}/`;
            currentOutputPath += `${entry.name}/`;
            iterateRecursively(currentPath);
        }
    })
}

iterateRecursively(inputDir);
