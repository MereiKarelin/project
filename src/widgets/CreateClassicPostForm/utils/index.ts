import { UploadedFile, UploadedReaction } from '@/shared/types';

export const getUniqueFilesFromReactions = (uploadedReactions: UploadedReaction[] | undefined) => {
  const uniqueFileNamesSet = new Set<string>();

  const newReactionImages: UploadedFile[] | undefined = uploadedReactions
    ?.map((reaction) => {
      //convert array of reactions to array of image files
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, ...newImage } = reaction;
      return { ...newImage, type: 'image' } as UploadedFile;
    })
    .filter((reaction) => {
      if (!reaction.file) {
        //reaction is not assigned an image
        return false;
      }

      if (!uniqueFileNamesSet.has(reaction.file.name)) {
        uniqueFileNamesSet.add(reaction.file.name);
        return true;
      }
      return false;
    });

  if (!newReactionImages) {
    return undefined;
  }

  return newReactionImages;
};
