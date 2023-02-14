import "reflect-metadata";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseEntity } from "../../../libs/Base.entity";
import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { Container } from "typedi";
import { FilterQuery, Schema } from "mongoose";
import { GraphQLJSONObject } from "graphql-type-json";
// 1. Create an interface representing a document in MongoDB.
@ObjectType()
export class Game extends BaseEntity {
  @prop({ type: () => String })
  @Field(() => String)
  importId?: string;

  @prop({ type: () => String })
  @Field(() => String)
  name: string;

  @prop({ type: () => String })
  @Field(() => String)
  tmp: string;


  @prop({ type: () => [String] })
  @Field(() => [String], { nullable: true })
  otherNames?: string[];

  @prop({ type: () => [String] })
  @Field(() => [String], { nullable: true })
  sewingMethods?: string[];

  @prop({ type: () => Number })
  @Field(() => Number, { nullable: true })
  lowTemp?: number;

  @prop({ type: () => Number })
  @Field(() => Number, { nullable: true })
  highTemp?: number;

  @prop({ type: () => Number })
  @Field(() => Number, { nullable: true })
  minSpacingInCM?: number;

  @prop({ type: () => Number })
  @Field(() => Number, { nullable: true })
  maxSpacingInCM?: number;

  @prop({ type: () => Number })
  @Field(() => Number, { nullable: true })
  harvestDayMin?: number;

  @prop({ type: () => Number })
  @Field(() => Number, { nullable: true })
  harvestDayMax?: number;

  @prop({ type: () => Number })
  @Field(() => Number, { nullable: true })
  fdcId?: number;

  @prop({ type: () => [Number] })
  @Field(() => [Number], { nullable: true })
  fdcIds?: [number];

  @Field(() => GraphQLJSONObject, { nullable: true })
  @prop({ type: () => Object })
  public attributes?: any;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @prop({ type: () => Object })
  public fdc?: any;
}

// 3. Create a Model.
export const GameModel = getModelForClass(Game);
Container.set("GameModel", GameModel);

@InputType()
export class GameCreateInput implements Partial<Game> {
  @Field(() => String)
  name: string;
}
@InputType()
export class GameUpdateInput
  extends GameCreateInput
  implements Partial<Game>
{
  @Field(() => ID, { nullable: true })
  _id: Schema.Types.ObjectId;
}
@InputType()
export class GameFilterInput implements FilterQuery<Game> {
  @Field(() => String, { nullable: true })
  name?: string;
}

