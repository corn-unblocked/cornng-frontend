import shell from "shelljs";

let buildOptions = {
    targetPath: "public"
}


shell.rm("-rf", buildOptions.targetPath);
shell.mkdir(buildOptions.targetPath);
shell.mkdir(buildOptions.targetPath + "/libcurl");
shell.mkdir(buildOptions.targetPath + "/baremux");
shell.mkdir(buildOptions.targetPath + "/uv");

shell.echo("Building CornNG Frontend with build options " + JSON.stringify(buildOptions));

shell.cp("node_modules/libcurl.js/libcurl_full.js", buildOptions.targetPath + "/libcurl");
shell.cp("node_modules/@mercuryworkshop/libcurl-transport/dist/*", buildOptions.targetPath + "/libcurl");
shell.cp("node_modules/@mercuryworkshop/bare-mux/dist/*", buildOptions.targetPath + "/baremux");
shell.cp("node_modules/@titaniumnetwork-dev/ultraviolet/dist/*", buildOptions.targetPath + "/uv");

shell.cp("-rf", "src/*", buildOptions.targetPath);
