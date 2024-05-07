import yaml from 'js-yaml';
import { isEqual } from 'lodash';
import { readFileSync, writeFileSync } from 'fs';
import { boundsPath } from 'app/settings/constants';

let local = <Electron.Rectangle>{};

function getBounds(): Partial<Electron.Rectangle> {
  let bounds = <Electron.Rectangle>{};

  try {
    const content = readFileSync(boundsPath, 'utf-8');

    bounds = yaml.load(content) as typeof bounds;
  } catch (error) {
    console.error(error);
  }

  return bounds;
}

function saveBounds(): void {
  const { screenX, screenY, innerWidth, innerHeight } = window;

  const bounds: Electron.Rectangle = {
    height: innerHeight,
    width: innerWidth,
    x: screenX,
    y: screenY,
  };

  const changed = !isEqual(local, bounds);

  if (changed) {
    local = bounds;

    try {
      const content = yaml.dump(bounds, { indent: 2 });

      writeFileSync(boundsPath, content, 'utf-8');
    } catch (error) {
      console.log(error);
    }
  }
}

export { getBounds, saveBounds };
