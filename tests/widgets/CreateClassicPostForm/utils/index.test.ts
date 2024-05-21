import { UploadedFile, UploadedReaction } from '@/shared/types';
import { getUniqueFilesFromReactions } from '@/widgets/CreateClassicPostForm/utils';

const blob1 = new Blob([Uint8Array.from([137, 80, 78, 71, 11, 10, 26, 1])], { type: 'image/png' });
const blob2 = new Blob([Uint8Array.from([37, 70, 78, 71, 11, 10, 26, 1])], { type: 'image/png' });
const imageFiles = [
  new File([blob1], 'image 1.jpeg', { type: 'image/png', lastModified: Date.now() }),
  new File([blob2], 'image 2.jpeg', { type: 'image/png', lastModified: Date.now() }),
];

test('getUniqueFilesFromReactions unique input generates unique output', () => {
  const uploadedReactions: UploadedReaction[] = [
    {
      name: 'Like',
      src: 'Like.jpeg',
      file: imageFiles[0],
    },
    {
      name: 'Upvote',
      src: 'Upvote.jpeg',
      file: imageFiles[1],
    },
  ];

  const uploadedFiles: UploadedFile[] = uploadedReactions.map((reaction) => ({
    src: reaction.src,
    file: reaction.file,
    type: 'image',
  }));

  expect(getUniqueFilesFromReactions(uploadedReactions)).toStrictEqual(uploadedFiles);
});

test('getUniqueFilesFromReactions duplicate images must be removed', () => {
  const uploadedReactions: UploadedReaction[] = [
    {
      name: 'Like',
      src: imageFiles[0]?.name,
      file: imageFiles[0],
    },
    {
      name: 'Like2',
      src: imageFiles[0]?.name,
      file: imageFiles[0],
    },
    {
      name: 'Upvote',
      src: 'Upvote.jpeg',
      file: imageFiles[1],
    },
  ];

  const res =
    getUniqueFilesFromReactions(uploadedReactions)?.filter(
      (img) => img?.file?.name === 'image 1.jpeg',
    ).length ?? 0;

  expect(res > 1).toBe(false);
});

test('getUniqueFilesFromReactions reactions with no images must be removed', () => {
  const uploadedReactions: UploadedReaction[] = [
    {
      name: 'Like',
      src: '',
      file: undefined,
    },
    {
      name: 'Upvote',
      src: 'Upvote.jpeg',
      file: imageFiles[1],
    },
  ];

  const uploadedFiles: UploadedFile[] = uploadedReactions.slice(1).map((reaction) => ({
    src: reaction.src,
    file: reaction.file,
    type: 'image',
  }));

  expect(getUniqueFilesFromReactions(uploadedReactions)).toStrictEqual(uploadedFiles);
});

test('getUniqueFilesFromReactions undefined reactions array returns undefined', () => {
  const uploadedReactions = undefined;

  expect(getUniqueFilesFromReactions(uploadedReactions) === uploadedReactions).toBe(true);
});
