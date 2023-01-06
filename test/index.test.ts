import { createHash } from 'crypto';
import { TarWriter } from '../src';

const mtime = 1666666666666;

describe('TarWriter', () => {
  test('write', async () => {
    const writer = new TarWriter();
    writer.addFile('a.txt', 'hello', { mtime });
    writer.addFile('b.txt', new Blob(['world']), { mtime });
    writer.addFile('c.txt', '', { mtime });
    const blob = await writer.write();
    const hash = hashdigest(new Uint8Array(await blob.arrayBuffer()));
    expect(hash).toEqual('acf0c99ba8727993dfab7339a1ff120083ca44ea');
  });
});

function hashdigest(input: Uint8Array) {
  const hash = createHash('sha1');
  hash.update(input);
  return hash.digest('hex');
}
