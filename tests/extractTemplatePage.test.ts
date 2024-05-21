import { extractTemplatePage } from '@/entities/Customization/utils/utils';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('@/shared/api/axiosInstance', () => ({
  get: vi.fn().mockResolvedValue({ data: '<div>Mock HTML</div>' }),
}));

vi.mock('axios');

describe('extractTemplatePage', () => {
  it('should return the HTML content from a given URL', async () => {
    const mockHtml = '<div>Test HTML</div>';
    vi.spyOn(axios, 'get').mockResolvedValue({ data: mockHtml });

    const url = 'http://test.com';
    const result = await extractTemplatePage(url);

    expect(result).toBe(mockHtml);
  });
});
