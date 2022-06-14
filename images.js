const Image = require('@11ty/eleventy-img')
const { readdir } = require('fs/promises')
const { parse } = require('path')


// BE AWARE: 16x16px IS THE MINIMAL SIZE FOR AVIF PROCESSING!!!


const inputDir = './input/';
const outputDir = './output';



async function optimizePNG(file) {
  const stats = await Image(inputDir + file, {
        widths: [null],
        // array, eg: [600, 1000, 1400] / null keeps original sizing
        formats: ['png', 'webp', 'avif'],
        sharpPngOptions: {
            quality: 70,
            compressionLevel: 9,
            effort: 10 // default: 7
        },
        sharpAvifOptions: {
            quality: 70,
            chromaSubsampling: '4:2:0',
            effort: 6 // default: 4
        },
        outputDir: outputDir,
        filenameFormat: (id, src, width, format) => {
            return `${parse(file).name}.${format}`
            // [original file name] . [file format]
        },
    })
    console.log(stats)
}

async function optimizeJPG(file) {
    const stats = await Image(inputDir + file, {
        widths: [null],
        // array, eg: [600, 1000, 1400] / null keeps original sizing
        formats: ['jpg', 'webp', 'avif'],
        sharpAvifOptions: {
            quality: 70,
            chromaSubsampling: '4:2:0',
            effort: 6 // default: 4
        },
        outputDir: outputDir,
        filenameFormat: (id, src, width, format) => {
            if (format.toLocaleLowerCase() === 'jpeg') return `${parse(file).name}.jpg`
            // override the default '.jpeg' file extension
            return `${parse(file).name}.${format}`
            // [original file name] . [file format]
        },
    })
    console.log(stats)
}


(async () => {
    const files = await readdir(inputDir)
    for (const file of files) {
        const fileExtension = parse(file).ext.toLowerCase();
        if (fileExtension === '.png') await optimizePNG(file);
        if (fileExtension === '.jpg' || fileExtension === '.jpeg') await optimizeJPG(file);
    }
})()
