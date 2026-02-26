async function terserCompressJs(source, opts = {}) {
  const {
    compress = true,
    mangleTopLevel = true,
    reserved = [],
    keepFnNames = false,
    keepClassNames = false,
  } = opts;

  if (typeof source !== "string") {
    return { code: "", error: new TypeError("source must be a string") };
  }

  const T = (typeof window !== "undefined" && window.Terser) ? window.Terser : null;
  if (!T || typeof T.minify !== "function") {
    return { code: "", error: new Error("Terser not found. Load the terser browser bundle (window.Terser).") };
  }

  const terserOptions = {
    ecma: 2020,
    compress: compress ? { defaults: true, passes: 3 } : false,
    mangle: {
      toplevel: !!mangleTopLevel,
      reserved: Array.isArray(reserved) ? reserved : [],
    },
    keep_fnames: !!keepFnNames,
    keep_classnames: !!keepClassNames,
    format: { comments: false },
  };

  try {
    const result = await T.minify(source, terserOptions);
    if (result.error) return { code: "", error: result.error };
    return { code: result.code || "" };
  } catch (e) {
    return { code: "", error: e };
  }
}
