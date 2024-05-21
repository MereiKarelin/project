import axios from 'axios';

export const extractTemplatePage = async (link: string) => {
  const page = await axios.get(link);
  const htmlString = page.data;
  return htmlString;
};

export const extractImgSourcesHTML = (htmlString: string) => {
  // Regular expression to find src attribute values in img tags
  const srcRegex = /<img[^>]+src="([^">]+)"/g;

  // Array to store src attribute values
  const srcValues = [];

  let match;
  // Execute regex and iterate over matches
  while ((match = srcRegex.exec(htmlString)) !== null) {
    srcValues.push(match[1]);
  }

  const bgImagesRegex = /background-image: url\((.*?)\)/g;

  while ((match = bgImagesRegex.exec(htmlString)) !== null) {
    const str = match[1].replace(/&quot;/g, '');
    srcValues.push(str);
  }

  return srcValues;
};

export function extractDivContent(id?: string, className?: string) {
  if (className) {
    const div = document.getElementsByClassName(className)[0];

    if (div) {
      const contentHTML = div.outerHTML;
      const styles = Array.from(div.querySelectorAll('style'))
        .map((style) => style.innerHTML)
        .join('\n');
      const scripts = Array.from(div.querySelectorAll('script'))
        .map((script) => script.innerHTML)
        .join('\n');

      return { contentHTML, styles, scripts };
    }
  } else if (id) {
    const div = document.getElementById(id);

    if (div) {
      const contentHTML = div.innerHTML;

      const styles = Array.from(div.querySelectorAll('style'))
        .map((style) => style.innerHTML)
        .join('\n');
      const scripts = Array.from(div.querySelectorAll('script'))
        .map((script) => script.innerHTML)
        .join('\n');

      return { contentHTML, styles, scripts };
    }
  }
  return null;
}
