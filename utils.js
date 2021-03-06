import { promises as fs } from 'fs';

export async function getLinesFromFile(filePath) {
    const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' })
    return fileContent.split('\r\n').filter(x => x !== '');
}
