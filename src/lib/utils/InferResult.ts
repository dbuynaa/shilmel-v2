import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from "drizzle-orm";

import type * as schema from "../../db";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export function enumToPgEnum<T extends Record<string, string>>(myEnum: T): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: string) => `${value}`) as [T[keyof T], ...T[keyof T][]];
}
export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
	"one" | "many",
	boolean,
	TSchema,
	TSchema[TableName]
>["with"];

export type InferResultType<
	TableName extends keyof TSchema,
	With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
	TSchema,
	TSchema[TableName],
	{
		with: With;
	}
>;
