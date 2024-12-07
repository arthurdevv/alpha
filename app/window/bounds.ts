import yaml from 'js-yaml';
import { screen } from 'electron';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { boundsPath } from 'app/settings/constants';

function getBounds(): Partial<Electron.Rectangle> {
  let bounds = <Electron.Rectangle>{};

  try {
    const content = readFileSync(boundsPath, 'utf-8');

    bounds = yaml.load(content) as typeof bounds;
  } catch (error) {
    console.error(error);
  }

  return getAdjustedBounds(bounds);
}

function saveBounds(
  bounds: Electron.Rectangle | Partial<Electron.Rectangle>,
): void {
  try {
    const content = yaml.dump(bounds, { indent: 2 });

    writeFileSync(boundsPath, content, 'utf-8');
  } catch (error) {
    console.log(error);
  }
}

function getAdjustedBounds(bounds: Electron.Rectangle): Partial<typeof bounds> {
  const { workAreaSize } = screen.getPrimaryDisplay();

  if (
    bounds.width > workAreaSize.width ||
    bounds.height > workAreaSize.height ||
    bounds.x + bounds.width > workAreaSize.width ||
    bounds.y + bounds.height > workAreaSize.height
  ) {
    return {};
  }

  return bounds;
}

if (!existsSync(boundsPath)) {
  saveBounds({});
}

export { getBounds, saveBounds };
