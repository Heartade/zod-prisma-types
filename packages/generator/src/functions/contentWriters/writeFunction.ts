import { type ContentWriterOptions } from '../../types';

export const writeFunction = ({
  fileWriter: { writer, writeImports },
  dmmf,
  getSingleFileContent = false,
}: ContentWriterOptions) => {
  const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;

  if (useMultipleFiles && !getSingleFileContent) {
    writeImports([
      { name: 'z', path: 'zod/v4' },
      { name: 'Prisma', path: prismaClientPath, isTypeOnly: true },
    ]);
  }

  writer
    .blankLine()
    .writeLine(`export const CreateFunctionSchema = <`)
    .setIndentationLevel(1)
    .writeLine(`In extends z.ZodTuple,`)
    .writeLine(`Out extends z.ZodType`)
    .setIndentationLevel(0)
    .writeLine(`>(`)
    .setIndentationLevel(1)
    .writeLine(`i: In,`)
    .writeLine(`o: Out`)
    .setIndentationLevel(0)
    .writeLine(`) => `)
    .setIndentationLevel(1)
    .writeLine(`z.custom<(...args: z.infer<In>) => z.infer<Out>>(`)
    .setIndentationLevel(2)
    .writeLine(`fn => typeof fn === 'function' && fn.length === i.array.length`)
    .setIndentationLevel(1)
    .writeLine(`);`)
    .setIndentationLevel(0);

  if (useMultipleFiles && !getSingleFileContent) {
    writer.blankLine().writeLine(`export default CreateFunctionSchema;`);
  }
};
