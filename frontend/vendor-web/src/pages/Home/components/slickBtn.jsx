const NextArrow = ({ className, style, onClick, right }) => (
  <div
    className={className}
    style={{
      ...style,
      background: 'black',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      borderRadius: '50%',
      zIndex: 2, 
      position: 'absolute', 
      right: right, 
      top: '50%', 
      transform: 'translateY(-50%)', 
    }}
    onClick={onClick}
  />
);

const PrevArrow = ({ className, style, onClick, left }) => (
  <div
    className={className}
    style={{
      ...style,
      background: 'black',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      borderRadius: '50%',
      zIndex: 2, 
      position: 'absolute', 
      left: left,
      top: '50%', 
      transform: 'translateY(-50%)', 
    }}
    onClick={onClick}
  />
);

export { NextArrow, PrevArrow };
