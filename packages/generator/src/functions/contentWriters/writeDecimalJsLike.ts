import { type ContentWriterOptions } from '../../types';

export const writeDecimalJsLike = ({
  fileWriter: { writer, writeImports },
  dmmf,
  getSingleFileContent = false,
}: ContentWriterOptions) => {
  const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;

  if (useMultipleFiles && !getSingleFileContent) {
    writeImports([
      { name: 'z', path: 'zod/v4' },
      { name: 'Prisma', path: prismaClientPath, isTypeOnly: true },
      { name: 'CreateFunctionSchema', path: './CreateFunctionSchema' },
    ]);
  }

  writer
    .blankLine()
    .writeLine(
      `export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({`,
    )
    .withIndentationLevel(1, () => {
      writer
        .writeLine(`d: z.array(z.number()),`)
        .writeLine(`e: z.number(),`)
        .writeLine(`s: z.number(),`)
        .writeLine(`toFixed: CreateFunctionSchema(z.tuple([]), z.string()),`);
    })
    .writeLine(`})`);

  if (useMultipleFiles && !getSingleFileContent) {
    writer.blankLine().writeLine(`export default DecimalJsLikeSchema;`);
  }
};
