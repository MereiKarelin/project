export const scrollShadowTop = (hidden: boolean) => (
  <div
    style={{
      background: '#FFFFFF',
      width: '100%',
      position: 'sticky',
      display: hidden ? 'none' : 'unset',
      pointerEvents: 'none',
      transition: 'all 7s ease 0s',
      zIndex: '90',
      top: '-20px',
      boxShadow: '2px 5px 5px 0px #091e421f',
      minHeight: '20px',
    }}
  />
);

export const scrollShadowBottom = (hidden: boolean) => (
  <div
    style={{
      background: '#FFFFFF',
      width: '100%',
      position: 'sticky',
      display: hidden ? 'none' : 'unset',
      pointerEvents: 'none',
      transition: 'all 7s ease 0s',
      zIndex: '90',
      bottom: '-20px',
      boxShadow: '-2px -5px 5px 0px #091e421f',
      minHeight: '20px',
    }}
  />
);
