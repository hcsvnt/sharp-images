const fs = require('fs');
const Image = require('@11ty/eleventy-img')
const { readdir } = require('fs/promises')
const { parse } = require('path')


// BE AWARE: 16x16px IS THE MINIMAL SIZE FOR AVIF PROCESSING!!!


const inputDir = './input/';
const outputDir = './output';


async function optimizePNG(file, subDir) {
  const stats = await Image(inputDir + file, {
        widths: [null],
        formats: ['webp', 'png'],
        sharpJpegOptions: {
            quality: 60
        },
        sharpWebpOptions: {
            quality: 60
        },
        sharpPngOptions: {
            quality: 50,
            compressionLevel: 9,
            effort: 10 // default: 7
        },
        sharpAvifOptions: {
            quality: 70,
            chromaSubsampling: '4:2:0',
            effort: 6 // default: 4
        },
        outputDir: subDir ? outputDir + '/' + subDir : outputDir,
        filenameFormat: (id, src, width, format) => {
            if (format.toLocaleLowerCase() === 'jpeg') return `${parse(file).name}.jpg`
            // override the default '.jpeg' file extension
            return `${parse(file).name}.${format}`
        },
    })
    // console.log(stats)
}

async function optimizeJPG(file, subDir) {
    const stats = await Image(inputDir + file, {
        widths: [null],
        formats: ['jpg', 'webp'],
        sharpJpegOptions: {
            quality: 60
        },
        sharpWebpOptions: {
            quality: 60
        },
        sharpAvifOptions: {
            quality: 70,
            chromaSubsampling: '4:2:0',
            effort: 6 // default: 4
        },
        outputDir: subDir ? outputDir + '/' + subDir : outputDir,
        filenameFormat: (id, src, width, format) => {
            if (format.toLocaleLowerCase() === 'jpeg') return `${parse(file).name}.jpg`
            // override the default '.jpeg' file extension
            return `${parse(file).name}.${format}`
        }
    })
    // console.log(stats)
}


async function iterateRecursively(dir, subDir) {
    let entries = await readdir(dir, { withFileTypes: true });
    entries.forEach(entry => {
        if (!entry.isDirectory()) {
            console.log('this', entry, parse(entry.name))
            const fileExtension = parse(entry.name).ext.toLowerCase();

            console.log(entry.name, subDir);
            if (fileExtension === '.png') optimizePNG(entry.name, subDir);
            if (fileExtension === '.jpg' || fileExtension === '.jpeg') optimizeJPG(entry.name, subDir);

        } else {
            if (!fs.existsSync(`${outputDir}/${entry.name}`)) {
                fs.mkdirSync(`${outputDir}/${entry.name}`);
            }
            console.log(`${inputDir}${entry.name}`, entry.name);
            // jak to odkomentujesz, to się spierdoli, ale właśnie próbuję dojsc dlaczego
            // iterateRecursively(`${inputDir}${entry.name}`, entry.name);
        }
    })
}

iterateRecursively(inputDir, null);

// to działało bez subfolderów
// (async () => {
//     const files = await readdir(inputDir, {withFileTypes: true})
//     for (const file of files) {

//         console.log(file.isDirectory(), file.name);
//         // const fileExtension = parse(file).ext.toLowerCase();
//         // if (fileExtension === '.png') await optimizePNG(file);
//         // if (fileExtension === '.jpg' || fileExtension === '.jpeg') await optimizeJPG(file);
//     }
// })()
