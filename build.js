import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/login-modal.tsx"], // o login-modal.tsx
  outfile: "dist/login-modal.js",
  bundle: true,
  minify: true,
  loader: {
    '.css': 'text',
  },
  target: ["es2020"],
  sourcemap: false,
  format: "iife",
  globalName: "LoginModalComponent",
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
