import {
  CodeAttributeInfo,
  ConstantType,
  JavaClassFile,
  LocalVariableTableAttributeInfo,
  Utf8Info
} from "java-class-tools";
import { obfuscatedString, stringToUint8, uint8ToString } from "../utils/stringutils";

export const methodFieldTransform = {

  transform: (classFile: JavaClassFile, code: CodeAttributeInfo) => {
    const { constant_pool: constantPool } = classFile;

    const { local_variable_table: variableTable } = code.attributes.find(attr => 
      uint8ToString((constantPool[attr.attribute_name_index] as Utf8Info).bytes) === 'LocalVariableTable'
    ) as LocalVariableTableAttributeInfo;

    const alreadyRenamed = [];
    const transformedVariables = [];

    variableTable.forEach(variable => {
      if(alreadyRenamed.indexOf(variable.index) === -1) {
        
        alreadyRenamed.push(variable.index);

        const varUtf8 = (constantPool[variable.name_index] as Utf8Info);
        const oldName = uint8ToString(varUtf8.bytes);

        if(oldName === 'this')
          return { oldName, newName: 'this' };

        const newName = obfuscatedString(5, 5);

        const constantPoolEntry: Utf8Info = {
          tag: ConstantType.UTF8,
          bytes: stringToUint8(newName),
          length: newName.length
        };

        constantPool.push(constantPoolEntry);
        classFile.constant_pool_count += 1;

        variable.name_index = constantPool.length - 1;

        transformedVariables.push({ oldName, newName });

      }
    });

    return transformedVariables;
  }

}