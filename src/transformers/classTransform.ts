import { JavaClassFile } from "java-class-tools";
import Class from "../interfaces/Class";
import { methodTransform } from "./methodTransform";

export const classTransform = {
  transform: (className: string, classFile: JavaClassFile): Class => {
    const constantPool = classFile.constant_pool;

    const methods = classFile.methods.map(method => {
      return methodTransform.transform(
        constantPool,
        method,
        [ 'methodFieldTransform' ]
      );
    });

    return { name: className, methods };
  }
}