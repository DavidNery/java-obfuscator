export default interface Method {
  name: string;
  fields: {
    oldName: string;
    newName: string;
  }[];
}