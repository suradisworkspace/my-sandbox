// Make Sure to add this code for making it to be Module
export {}
declare global {
  type DefaultPropsType<ObjectType, SelectedKey extends keyof ObjectType> = {
    [Key in SelectedKey]-?: ObjectType[Key]
  }
}
