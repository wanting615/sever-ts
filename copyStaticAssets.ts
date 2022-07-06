import * as shell from "shelljs";

shell.cp("-R", "webContent/images", "dist/webContent/");
shell.cp("-R", "webContent/files", "dist/webContent/");
shell.cp("-R", "webContent/static", "dist/webContent/");
shell.cp("-R", "webContent/dist", "dist/webContent/");