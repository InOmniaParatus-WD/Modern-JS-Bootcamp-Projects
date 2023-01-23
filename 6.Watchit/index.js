#!/usr/bin/env node
//enter command in Git Bash to make the app executable: chmod +x index.js

import chokidar from "chokidar";
import debounce from "lodash.debounce";
import program from "caporal";
import fs from "fs";
import { spawn } from "child_process";
import chalk from "chalk";
chalk.enabled = true;
chalk.level = 3;


program
  .version("1.0.0")
  .argument("[filename]", "Name of a file to execute")
  .action(async ({ filename }) => {
    const name = filename || "index.js";
    try {
      await fs.promises.access(name);
    } catch (err) {
      throw new Error(`Could not find the file ${name}`);
    }

    let proc;
    const start = debounce(() => {
      if (proc) {
        proc.kill();
      }
      console.log(chalk.cyan(">>>>>>Starting process..."));
      proc = spawn("node", [name], { stdio: "inherit" });
    }, 100);

    chokidar
      .watch(".")
      .on("add", start)
      .on("change", start)
      .on("unlink", start);
  });

program.parse(process.argv);
