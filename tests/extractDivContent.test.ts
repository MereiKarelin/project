import { extractDivContent } from '@/entities/Customization/utils/utils';
import { beforeEach, describe, expect, it } from 'vitest';

function setupDOM() {
  document.body.innerHTML = `
    <div id="testId">
      <style>.example { color: red; }</style>
      <script>console.log('test');</script>
      <p>Test content</p>
    </div>
    <div class="testClass">
      <style>.another { color: blue; }</style>
      <script>console.log('another test');</script>
      <p>Another test content</p>
    </div>
  `;
}

describe('extractDivContent', () => {
  beforeEach(() => {
    setupDOM();
  });

  it('extracts content by class name', () => {
    // @ts-ignore
    const { contentHTML, styles, scripts } = extractDivContent(undefined, 'testClass');

    expect(contentHTML).toContain('Another test content');
    expect(styles).toContain('.another { color: blue; }');
    expect(scripts).toContain("console.log('another test');");
  });

  it('extracts content by id', () => {
    // @ts-ignore
    const { contentHTML, styles, scripts } = extractDivContent('testId');

    expect(contentHTML).toContain('Test content');
    expect(styles).toContain('.example { color: red; }');
    expect(scripts).toContain("console.log('test');");
  });

  it('returns null if no element is found', () => {
    const result = extractDivContent('nonexistentId');
    expect(result).toBeNull();
  });
});
