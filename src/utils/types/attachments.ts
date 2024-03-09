import { string } from 'prop-types';

export type TResponseLoadFile = {
  id: string;
  name: string;
  fileName: string;
  mimeType: string;
  url: string;
  createdAt: string;
};

export type TResponseLoadFiles = {
  files: TResponseLoadFile[];
};
