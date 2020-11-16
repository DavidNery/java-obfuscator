import { JavaClassFile } from "java-class-tools";
import Class from "../interfaces/Class";
import { methodTransform } from "./methodTransform";

export const classTransform = {
  transform: (className: string, classFile: JavaClassFile): Class => {
    const methods = classFile.methods.map(method => {
      return methodTransform.transform(
        classFile,
        method,
        ['methodFieldTransform']
      );
    });

    return { name: className, methods };
  }
}