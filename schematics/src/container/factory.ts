import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  template,
  url,
} from '@angular-devkit/schematics';

import { applyNameAndPath, determineArtifactName, findDeclaringModule, generateSelector } from '../utils/common';
import { addDeclarationToNgModule, addEntryComponentToNgModule, addExportToNgModule } from '../utils/registration';

import { PwaContainerOptionsSchema as Options } from './schema';

export function createContainer(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = applyNameAndPath('container', host, options);
    options = determineArtifactName('container', host, options);
    // tslint:disable-next-line:no-string-literal
    options['artifactName'] += 'Component';
    options = generateSelector('container', host, options);
    options = findDeclaringModule(host, options);

    const operations = [];
    if (!options.skipImport) {
      operations.push(addDeclarationToNgModule(options));
      if (options.entryComponent) {
        operations.push(addEntryComponentToNgModule(options));
      }
      if (options.export) {
        operations.push(addExportToNgModule(options));
      }
    }
    operations.push(
      mergeWith(
        apply(url('./files'), [
          options.styleFile ? noop() : filter(path => !path.endsWith('.__styleext__')),
          template({
            ...strings,
            ...options,
            'if-flat': s => (options.flat ? '' : s),
          }),
          move(options.path),
        ])
      )
    );

    return chain(operations);
  };
}
