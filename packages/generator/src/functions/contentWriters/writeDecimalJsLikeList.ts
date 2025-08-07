import { type ContentWriterOptions } from '../../types';

export const writeDecimalJsLikeList = ({
  fileWriter: { writer, writeImports },
  dmmf,
  getSingleFileContent = false,
}: ContentWriterOptions) => {
  const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;

  if (useMultipleFiles && !getSingleFileContent) {
    writeImports([
      { name: 'z', path: 'zod/v4' },
      { name: 'Prisma', path: prismaClientPath, isTypeOnly: true },
      { name: 'DecimalJsLikeSchema', path: './DecimalJsLikeSchema' },
    ]);
  }

  writer
    .blankLine()
    .writeLine(
      `export const DecimalJsLikeListSchema: z.ZodType<Prisma.DecimalJsLike[]> = z.array(DecimalJsLikeSchema)`,
    );

  if (useMultipleFiles && !getSingleFileContent) {
    writer.blankLine().writeLine(`export default DecimalJsLikeListSchema;`);
  }
};
