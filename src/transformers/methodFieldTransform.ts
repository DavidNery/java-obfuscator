import { CodeAttributeInfo, ConstantPoolInfo, LocalVariableTableAttributeInfo, Utf8Info } from "java-class-tools";
import { obfuscatedString, stringToUint8, uint8ToString } from "../utils/stringutils";

export const methodFieldTransform = {

  transform: (constantPool: ConstantPoolInfo[], code: CodeAttributeInfo) => {
    const { local_variable_table: variableTable } = (code.attributes.find(attr => 
      uint8ToString((constantPool[attr.attribute_name_index] as Utf8Info).bytes) === 'LocalVariableTable'
    ) as LocalVariableTableAttributeInfo);

    return variableTable.map(variable => {
      const varUtf8 = (constantPool[variable.name_index] as Utf8Info);
      const oldName = uint8ToString(varUtf8.bytes);

      if(oldName === 'this')
        return { oldName, newName: 'this' };

      const newName = obfuscatedString(5, 5);

      varUtf8.bytes = stringToUint8(newName);
      varUtf8.length = newName.length;

      return { oldName, newName };
    }); // transformed fields
  }

}