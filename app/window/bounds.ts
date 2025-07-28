import yaml from 'js-yaml';
import { screen } from 'electron';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { boundsPath } from 'app/settings/constants';

function getBounds(
  center?: boolean,
): Partial<Electron.Rectangle> & { center?: boolean } {
  let bounds = <Electron.Rectangle>{};

  try {
    const content = readFileSync(boundsPath, 'utf-8');

    bounds = yaml.load(content) as typeof bounds;
  } catch (error) {
    console.error(error);

    return bounds;
  }

  const { workAreaSize } = screen.getPrimaryDisplay();

  if (
    bounds.width > workAreaSize.width ||
    bounds.height > workAreaSize.height ||
    bounds.x + bounds.width > workAreaSize.width ||
    bounds.y + bounds.height > workAreaSize.height
  ) {
    return {};
  }

  return center
    ? { width: bounds.width, height: bounds.height, center }
    : bounds;
}

function saveBounds(bounds: Partial<Electron.Rectangle>): void {
  try {
    const content = yaml.dump(bounds, { indent: 2 });

    writeFileSync(boundsPath, content, 'utf-8');
  } catch (error) {
    console.error(error);
  }
}

if (!existsSync(boundsPath)) saveBounds({});

export { getBounds, saveBounds };
