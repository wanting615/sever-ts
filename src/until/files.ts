import fs from "fs";
import path from "path";

export function readfile<T>(filePath: string): Promise<T | null>{
  const file =  path.resolve(__dirname, filePath);
  return new Promise((resolve) => {
    fs.readFile(file, (error, buffer) => {
      if(error) {
        resolve(null);
        return;
      }
      let d =  JSON.parse(buffer.toString());
      resolve(d);
    })
  })
}