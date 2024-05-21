import React from 'react';

interface IProps {
  video: File | null;
  setVideo: React.Dispatch<React.SetStateAction<File | null>>;
}

const VideoUpload = ({ setVideo, video }: IProps) => {
  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files ? e.target.files[0] : null)}
      />
      {video ? <video src={URL.createObjectURL(video)} controls /> : null}
    </div>
  );
};

export default VideoUpload;
