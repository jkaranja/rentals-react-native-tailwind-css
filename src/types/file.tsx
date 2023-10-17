//for FormData interface->value must be File|Blob|string. File must contain uri, type and name
export interface IImage {
  uri: string; //hidden in web for security reasons//req
  type: string; //mobile+web//req
  name: string; //mobile+web//req
  filename?: string; //fetched file
  size?: number; //mobile+web//not req
}



export interface IFile {
  uri: string;
  type: string;
  name: string;
  path: string;
  filename: string; //fetched file
}