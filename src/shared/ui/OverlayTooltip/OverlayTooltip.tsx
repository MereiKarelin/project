type PropTypes = {
  children: React.ReactNode;
  text: string;
  zIndex?: '0' | '10' | '20' | '30' | '40' | '50';
};

export const OverlayTooltip = ({ children, text, zIndex = '10' }: PropTypes) => {
  return (
    <>
      <div
        className={
          'absolute top-[-10] h-full w-full opacity-0 hover:bg-black/70 hover:opacity-100 text-white'
        }
        style={{ zIndex: `${zIndex}` }}
      >
        {text}
      </div>
      {children}
    </>
  );
};

export default OverlayTooltip;
