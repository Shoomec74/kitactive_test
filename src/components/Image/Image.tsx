import { FC } from 'react';

interface IProps {
  file: File;
}
const Image: FC<IProps> = ({ file }) => {
  return (
    <img
      loading="lazy"
      src={file.preview}
      alt={file.name}
      width="100"
      height="100"
      onLoad={() => {
        URL.revokeObjectURL(file.preview);
      }}
      style={{
        height: '100%',
        width: '100%',
        objectFit: 'contain',
        borderRadius: '0.375rem',
      }}
    />
  );
};

export default Image;
