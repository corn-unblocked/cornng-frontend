import shell from "shelljs";
import * as esbuild from "esbuild";

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
    "Building CornNG Frontend with build options " +
        JSON.stringify(buildOptions),
);

shell.cp(
    "node_modules/@mercuryworkshop/libcurl-transport/dist/*",
    buildOptions.targetPath + "/libcurl",
);
shell.cp(
    "node_modules/@mercuryworkshop/bare-as-module3/dist/*",
    buildOptions.targetPath + "/baremod",
);
shell.cp(
    "node_modules/@mercuryworkshop/bare-mux/dist/*",
    buildOptions.targetPath + "/baremux",
);
shell.cp(
    "node_modules/@titaniumnetwork-dev/ultraviolet/dist/*",
    buildOptions.targetPath + "/uv",
);

shell.cp("-rf", "www/*", buildOptions.targetPath);
shell.cp("LICENSE", buildOptions.targetPath);

let jsTargets = ["index", "manager"];
for (const target of jsTargets) {
    await esbuild.build({
        entryPoints: ["src/" + target + ".ts"],
        bundle: true,
        outfile: buildOptions.targetPath + "/" + target + ".js",
        format: "esm"
    });    
}