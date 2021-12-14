import * as shell from "shelljs";

shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("-R", "src/public/files", "dist/public/");
shell.cp("-R", "src/public/static", "dist/public/");