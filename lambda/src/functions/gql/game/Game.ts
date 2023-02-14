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

  @Field(() => GraphQLJSONObject, { nullable: true })
  @prop({ type: () => Object })
  public prompts?: any;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @prop({ type: () => Object })
  public history?: any;

}

// 3. Create a Model.
export const GameModel = getModelForClass(Game);
Container.set("GameModel", GameModel);

@InputType()
export class GameCreateInput implements Partial<Game> {
  @Field(() => GraphQLJSONObject, { nullable: true })
  public prompts?: any;
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

