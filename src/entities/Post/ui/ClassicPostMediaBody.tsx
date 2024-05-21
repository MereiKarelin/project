import { IPost, IReply } from '@/entities/Post/model/types';
import VideoPlayer from '@/widgets/VideoPlayer/VideoPlayer';
import Image from 'next/image';

interface IProps {
  post: IPost | IReply;
  openPopupImage: (image: string) => void;
  setPostViewed: (postReference: string) => void;
}

export const ClassicPostMediaBody = ({ post, openPopupImage, setPostViewed }: IProps) => {
  const setVideoViewed = () => {
    setPostViewed(post.reference);
  };
  return (
    <>
      {post?.body.image_url && post?.body.video_url ? (
        <div className="flex justify-center gap-3 p-2 items-center">
          {post?.body.image_url && (
            <Image
              src={post?.body.image_url}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '250px', height: '100%', maxHeight: '800px' }}
              className="rounded-3xl cursor-pointer"
              onClick={() => {
                openPopupImage(post?.body.image_url as string);
                setPostViewed(post.reference);
              }}
            />
          )}
          {post.body.video_url && (
            <div className="flex justify-center w-[250px] h-[100%] max-h-[800px]">
              <VideoPlayer src={post.body.video_url} setVideoViewed={setVideoViewed} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center gap-3 p-2 items-center">
          {post?.body.image_url && (
            <Image
              src={post?.body.image_url}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 'auto', height: '100%', maxHeight: '600px' }}
              className="rounded-3xl cursor-pointer"
              onClick={() => {
                openPopupImage(post?.body.image_url as string);
                setPostViewed(post.reference);
              }}
            />
          )}
          {post.body.video_url && (
            <div className="flex justify-center w-auto h-[100%] max-h-[600px]">
              <VideoPlayer src={post.body.video_url} setVideoViewed={setVideoViewed} />
            </div>
          )}
        </div>
      )}
    </>
  );
};
