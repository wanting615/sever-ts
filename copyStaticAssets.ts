import * as shell from "shelljs";

shell.cp("-R", "src/public/images", "dist/src/public/");
shell.cp("-R", "src/public/files", "dist/src/public/");
shell.cp("-R", "src/public/static", "dist/src/public/");
shell.cp("-R", "src/public/dist", "dist/src/public/");