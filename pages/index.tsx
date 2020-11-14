import React, { useCallback, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import {
  JavaClassFileReader,
  JavaClassFileWriter
} from 'java-class-tools';

import Class from '../src/interfaces/Class';
import { classTransform } from '../src/transformers/classTransform';

const classReader = new JavaClassFileReader();
const classWriter = new JavaClassFileWriter();

const Index: React.FC = () => {
  const [files, setFiles] = useState<Class[]>([]);
  const [jarClasses, setJarClasses] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleJarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles([]);

    const jarFile = e.target.files[0];
    JSZip.loadAsync(jarFile).then(jar => {

      const classes = jar.filter(path => path.endsWith('.class'));
      const lastClass = classes[classes.length - 1];
      
      setJarClasses(classes.length);
      
      classes.forEach(file => {

        const classBuffer = file.async("uint8array");
        classBuffer.then(classFileArray => {
          const classFile = classReader.read(classFileArray);
          const transformedClass = classTransform.transform(file.name, classFile);

          jar.file(file.name, classWriter.write(classFile).buffer);

          setProgress(oldProgress => oldProgress + 1);
          setFiles(oldFiles => [...oldFiles, transformedClass]);

          if (file.name === lastClass.name) {
            alert('Generating...');
            jar.generateAsync({
              mimeType: 'application/java-archive ',
              type: 'blob',
              compression: 'DEFLATE'
            }).then(generatedJar => 
              saveAs(generatedJar, jarFile.name.replace('.jar', ' obfuscated.jar'))
            );
          }
        });

      });
    });
  }, []);

  return (<>
    <input
      type="file"
      name="jar"
      id="jar"
      accept=".jar"
      onChange={handleJarUpload}
    />

    <div style={{
      width: '200px',
      height: '20px',
      backgroundColor: 'gray',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${progress/(jarClasses || 1)*100}%`,
        height: '20px',
        backgroundColor: 'green',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: 'white'
      }}>
        {Math.floor(progress/(jarClasses || 1)*100)}%
      </div>
    </div>

    <ul>
      {
        files.map((file, index) => {
          return (
            <li key={index}>
              {file.name}
              <ul>
                <li>
                  Métodos (<strong>{file.methods.length}</strong>)
                  <ul>
                    {
                      file.methods.map((method, index) => (
                        <li key={index}>
                          {method.name}
                          <ul>
                            <li>
                              Variáveis internas (<strong>{method.fields.length}</strong>)
                              <ul>
                                {
                                  method.fields.map((field, index) => (
                                    <li key={index}>{field.oldName} -&gt; {field.newName}</li>
                                  ))
                                }
                              </ul>
                            </li>
                          </ul>
                        </li>
                      ))
                    }
                  </ul>
                </li>
              </ul>
            </li>
          );
        })
      }
    </ul>
  </>);
}

export default Index;