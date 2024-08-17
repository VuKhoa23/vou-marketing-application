const NextArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{ ...style,  background: 'black',  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', borderRadius: '50%' }} // Thay đổi màu sắc và background
    onClick={onClick}
  />
);

const PrevArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{ ...style,  background: 'black',  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', borderRadius: '50%' }} // Thay đổi màu sắc và background
    onClick={onClick}
  />
);

export { NextArrow, PrevArrow };
