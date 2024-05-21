import { vi } from 'vitest';

import { saveHtmlTemplate } from '@/_pages/Customizator/utils';
import { extractDivContent } from '@/entities/Customization/utils/utils';
import { createCustomizedPostHandler } from '@/shared/api/post';
import { createProfileTemplateHandler } from '@/shared/api/profile';
import { getStoredAccessToken } from '@/shared/utils';

vi.mock('@/shared/api/profile', () => ({
  createProfileTemplateHandler: vi.fn(),
}));
vi.mock('@/shared/api/post', () => ({
  createCustomizedPostHandler: vi.fn(),
}));

// Mock localStorage
// @ts-ignore
global['localStorage'] = {
  getItem: vi.fn(),
  removeItem: vi.fn(),
  // Add other methods as needed
};

vi.mock('@/entities/Customization/utils/utils', async () => {
  const actual = (await vi.importActual('@/entities/Customization/utils/utils')) as any;
  return {
    ...actual,
    // Mock other methods if necessary
  };
});

describe('saveHtmlTemplate', () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    global.window.alert = vi.fn();
    global.localStorage.getItem = vi.fn();
    global.localStorage.removeItem = vi.fn();
  });

  it('does not proceed if templateName is empty for profile type', async () => {
    const accessToken = getStoredAccessToken();
    await saveHtmlTemplate('profile', {}, accessToken || '');
    expect(createProfileTemplateHandler).not.toHaveBeenCalled();
  });

  it('calls createProfileTemplateHandler with containerId for profile type', async () => {
    const mockHtml = { contentHTML: '<div>Profile Content</div>' };
    // @ts-ignore
    vi.mocked(extractDivContent).mockReturnValue(mockHtml);
    const accessToken = getStoredAccessToken();
    await saveHtmlTemplate('profile', 'profileTemplate', accessToken, 'containerId');
    expect(createProfileTemplateHandler).toHaveBeenCalledWith(
      'profileTemplate',
      mockHtml.contentHTML,
      mockHtml.contentHTML,
      mockHtml.contentHTML,
    );
  });

  it('calls createProfileTemplateHandler with default className for profile type', async () => {
    const mockHtml = { contentHTML: '<div>Profile Content</div>' };
    // @ts-ignore
    vi.mocked(extractDivContent).mockReturnValue(mockHtml);
    const accessToken = getStoredAccessToken();
    await saveHtmlTemplate('profile', 'profileTemplate', accessToken);
    expect(createProfileTemplateHandler).toHaveBeenCalledWith(
      'profileTemplate',
      mockHtml.contentHTML,
      mockHtml.contentHTML,
      mockHtml.contentHTML,
    );
  });

  it('calls createCustomizedPostHandler with localStorage data for post type', async () => {
    const desktopContent = '<div>Desktop Content</div>';
    const tabletContent = '<div>Tablet Content</div>';
    const mobileContent = '<div>Mobile Content</div>';

    // @ts-ignore
    global.localStorage.getItem.mockReturnValueOnce(
      JSON.stringify({ customizationItem: { contentHTML: desktopContent } }),
    );
    // @ts-ignore
    global.localStorage.getItem.mockReturnValueOnce(
      JSON.stringify({ customizationItem: { contentHTML: tabletContent } }),
    );
    // @ts-ignore
    global.localStorage.getItem.mockReturnValueOnce(
      JSON.stringify({ customizationItem: { contentHTML: mobileContent } }),
    );

    const accessToken = getStoredAccessToken();
    await saveHtmlTemplate('post', {}, accessToken || '');

    expect(createCustomizedPostHandler).toHaveBeenCalledWith(
      desktopContent,
      tabletContent,
      mobileContent,
      accessToken,
    );
  });

  it('calls createCustomizedPostHandler with default content for post type', async () => {
    const defaultContent = '<div>Default Content</div>';
    // @ts-ignore
    global.localStorage.getItem.mockReturnValue(null);
    // @ts-ignore
    vi.mocked(extractDivContent).mockReturnValue({ contentHTML: defaultContent });

    const accessToken = getStoredAccessToken();
    await saveHtmlTemplate('post', {}, accessToken || '');
    expect(createCustomizedPostHandler).toHaveBeenCalledWith(
      defaultContent,
      defaultContent,
      defaultContent,
      accessToken,
    );
  });

  it('sets contenteditable to false for profile type', async () => {
    const testHtml = '<div contenteditable="true">Editable Content</div>';
    // @ts-ignore
    vi.mocked(extractDivContent).mockReturnValue({ contentHTML: testHtml });

    const accessToken = getStoredAccessToken();
    await saveHtmlTemplate('profile', 'profileTemplate', accessToken || '');

    // @ts-ignore
    const callArgs = createProfileTemplateHandler.mock.calls[0];
    expect(callArgs).toBeDefined();
    expect(callArgs[1]).toContain('<div contenteditable="false">Editable Content</div>');
  });

  it('sets contenteditable to false for post type', async () => {
    const testHtml = '<div contenteditable="true">Editable Content</div>';
    // @ts-ignore
    global.localStorage.getItem.mockReturnValue(
      JSON.stringify({ customizationItem: { contentHTML: testHtml } }),
    );

    const accessToken = getStoredAccessToken();
    await saveHtmlTemplate('post', {}, accessToken || '');

    // @ts-ignore
    const callArgs = createCustomizedPostHandler.mock.calls[0];
    expect(callArgs).toBeDefined();
    expect(callArgs[0]).toContain('<div contenteditable="false">Editable Content</div>');
  });
});
