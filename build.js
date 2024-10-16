import shell from "shelljs";

let buildOptions = {
  targetPath: "public",
};

shell.rm("-rf", buildOptions.targetPath);
shell.mkdir(buildOptions.targetPath);
shell.mkdir(buildOptions.targetPath + "/libcurl");
shell.mkdir(buildOptions.targetPath + "/baremux");
shell.mkdir(buildOptions.targetPath + "/baremod");
shell.mkdir(buildOptions.targetPath + "/uv");

shell.echo(
  "Building CornNG Frontend with build options " + JSON.stringify(buildOptions),
);

// should work in ci
shell.exec("git submodule update --remote --init");

for (let m of [
  "@mercuryworkshop/libcurl-transport",
  "@titaniumnetwork-dev/ultraviolet",
]) {
  shell.echo("Building module " + m);
  shell.exec("npm explore " + m + ' -- "npm install && npm run build"');
}
shell.cp(
  "submodule/curltransport/dist/*",
  buildOptions.targetPath + "/libcurl",
);
shell.cp("submodule/ultraviolet/dist/*", buildOptions.targetPath + "/uv");

shell.cp(
  "node_modules/@mercuryworkshop/bare-as-module3/dist/*",
  buildOptions.targetPath + "/baremod",
);
shell.cp(
  "node_modules/@mercuryworkshop/bare-mux/dist/*",
  buildOptions.targetPath + "/baremux",
);

shell.cp("-rf", "src/*", buildOptions.targetPath);
shell.cp("LICENSE", buildOptions.targetPath);
