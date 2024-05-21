interface PropTypes {
  className?: string;
}

export const EllipsisSpinner = ({
  className = 'relative animate-[ellipsisGray_0.5s_infinite_ease-out_alternate] w-4 h-4 rounded-[50%] bg-white',
}: PropTypes) => {
  return <span className={className} style={{ boxShadow: '32px 0 #fff, -32px 0 #fff' }}></span>;
};
