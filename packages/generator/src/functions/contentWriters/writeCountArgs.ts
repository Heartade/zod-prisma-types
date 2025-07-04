import {
  ExtendedDMMFOutputType,
  writeImportStatementOptions,
} from '../../classes';
import { type ContentWriterOptions } from '../../types';

export const writeCountArgs = (
  {
    fileWriter: { writer, writeImports },
    dmmf,
    getSingleFileContent = false,
  }: ContentWriterOptions,
  model: ExtendedDMMFOutputType,
) => {
  const { useMultipleFiles, prismaClientPath, prismaVersion } =
    dmmf.generatorConfig;

  if (useMultipleFiles && !getSingleFileContent) {
    const imports: writeImportStatementOptions[] = [];
    imports.push({ name: 'z', path: 'zod' });
    imports.push({ name: 'Prisma', path: prismaClientPath, isTypeOnly: true });
    imports.push({
      name: `${model.name}CountOutputTypeSelectSchema`,
      path: `./${model.name}CountOutputTypeSelectSchema`,
    });
    writeImports(imports);
  }

  writer
    .blankLine()
    .write(`export const ${model.name}CountOutputTypeArgsSchema: `)
    .conditionalWrite(
      (prismaVersion?.major === 5 && prismaVersion?.minor >= 1) ||
        (prismaVersion?.major && prismaVersion?.major >= 6) ||
        // fallback to newest version of client version cannot be determined
        prismaVersion === undefined,
      `z.ZodType<Prisma.${model.name}CountOutputTypeDefaultArgs> = `,
    )
    .conditionalWrite(
      (prismaVersion?.major === 5 && prismaVersion?.minor === 0) ||
        prismaVersion?.major === 4,
      `z.ZodType<Prisma.${model.name}CountOutputTypeArgs> = `,
    )
    .write('z.object(')
    .inlineBlock(() => {
      writer.writeLine(
        `select: z.lazy(() => ${model.name}CountOutputTypeSelectSchema).nullish(),`,
      );
    })
    .write(`).strict();`);

  if (useMultipleFiles && !getSingleFileContent) {
    writer
      .blankLine()
      .writeLine(`export default ${model.name}CountOutputTypeSelectSchema;`);
  }
};
