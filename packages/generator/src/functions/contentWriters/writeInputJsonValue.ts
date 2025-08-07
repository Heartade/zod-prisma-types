import { type ContentWriterOptions } from '../../types';

export const writeInputJsonValue = ({
  fileWriter: { writer, writeImports },
  dmmf,
  getSingleFileContent = false,
}: ContentWriterOptions) => {
  const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;

  if (useMultipleFiles && !getSingleFileContent) {
    writeImports([
      { name: 'z', path: 'zod/v4' },
      { name: 'Prisma', path: prismaClientPath },
      { name: 'CreateFunctionSchema', path: './CreateFunctionSchema' },
    ]);
  }

  writer
    .blankLine()
    .writeLine(
      `export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>`,
    )
    .withIndentationLevel(1, () => {
      writer
        .writeLine('z.union([')
        .withIndentationLevel(2, () => {
          writer
            .writeLine(`z.string(),`)
            .writeLine(`z.number(),`)
            .writeLine(`z.boolean(),`)
            .writeLine(
              `z.object({ toJSON: CreateFunctionSchema(z.tuple([]), z.any()) }),`,
            )
            .writeLine(
              `z.record(z.union([z.string(), z.number()]), z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),`,
            )
            .writeLine(
              `z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),`,
            );
        })
        .writeLine(`])`);
    })
    .writeLine(`);`);
  writer
    .blankLine()
    .writeLine(
      `export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;`,
    );

  if (useMultipleFiles && !getSingleFileContent) {
    writer.blankLine().writeLine(`export default InputJsonValueSchema;`);
  }
};
