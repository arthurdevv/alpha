const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  if (process.platform !== 'darwin' || !process.env.APPLE_ID || !process.env.APPLE_PASSWORD) return;

  const { appOutDir, packager } = context;

  const appName = packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'alpha.app',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_PASSWORD,
  });
};
