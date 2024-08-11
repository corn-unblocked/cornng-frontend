import shell from "shelljs";

let buildOptions = {
    targetPath: "public"
}

function copyDistFiles(loc, dest) {
    shell.mkdir("-p", buildOptions.targetPath + dest);
    shell.cp("node_modules/" + loc + "/dist/*.{js,mjs}", buildOptions.targetPath + dest);
}

shell.rm("-rf", buildOptions.targetPath);
shell.mkdir(buildOptions.targetPath);

shell.echo("Building CornNG Frontend with build options " + JSON.stringify(buildOptions));

copyDistFiles("@mercuryworkshop/epoxy-transport", "/epoxy");
copyDistFiles("@mercuryworkshop/libcurl-transport", "/libcurl");
copyDistFiles("@mercuryworkshop/bare-as-module3", "/baremod");
copyDistFiles("@mercuryworkshop/bare-mux", "/baremux");
copyDistFiles("@titaniumnetwork-dev/ultraviolet", "/uv");

shell.cp("-rf", "src/*", buildOptions.targetPath);
