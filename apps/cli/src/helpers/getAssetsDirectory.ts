import { resolve as resolvePath } from 'path';

export function getAssetsDirectoryPath(): string {
    return resolvePath(__dirname, '..', 'assets');
}