#!/usr/bin/env node

import fs  from "fs"; //accesing the file system object
import util from "util";
import chalk from "chalk";
import path from "path";
chalk.enabled = true;
chalk.level = 3;

//--------- Method #1 ---------
// const lstat = (filename) => {
//   return new Promise((resolve, reject) => {
//     fs.lstat(filename, (err, stats) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(stats);
//     });
//   });
// };

//--------- Method #2 ---------
// const lstat = util.promisify(fs.lstat);

//--------- Method #3 ---------
const { lstat } = fs.promises;

const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, filenames) => {
  if (err) {
    console.log(err);
  }

  // for (let filename of filenames) {
  //   try {
  //     const stats = await lstat(filename);
  //     console.log(filename, stats.isFile());
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  const statPromises = filenames.map((filename) => {
    // return lstat(filename);
    return lstat(path.join(targetDir, filename))
  });

  const allStats = await Promise.all(statPromises);

  for (let stats of allStats) {
    const index = allStats.indexOf(stats);

    if (stats.isFile()) {
      console.log(filenames[index]);
    } else {
      console.log(chalk.green(filenames[index]))
    }
  }
});

//---------------------------------------------------
// fs.readdir(process.cwd(), (err, filenames) => {
//   if (err) {
//     console.log(err);
//   }

//   const allStats = Array(filenames.length).fill(null);

//   for (let filename of filenames) {
//     const index = filenames.indexOf(filename);

//     fs.lstat(filename, (err, stats) => {
//       if (err) {
//         console.log(err);
//       }

//       allStats[index] = stats;

//       const ready = allStats.every((stats) => {
//         return stats;
//       });

//       if (ready) {
//         allStats.forEach((stats, idx) => {
//           console.log(filenames[idx], stats.isFile());
//         });
//       }
//     });
//   }
// });
