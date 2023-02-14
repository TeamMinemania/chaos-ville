import "reflect-metadata";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
// import _ from "underscore";
import { Inject, Service } from "typedi";
import {
  Game,
  GameCreateInput,
  GameFilterInput,
  GameUpdateInput,
} from "./Game";
import { GameService } from "./Game.service";

// import DataLoader from "dataloader";
import { HydratedDocument } from "mongoose";
import { BaseResolver } from "../../../libs/Base.resolver";

import { GraphQLJSONObject } from "graphql-type-json";
@Service()
@Resolver(() => Game)
export class GameResolver extends BaseResolver(
  Game,
  GameService,
  GameFilterInput,
  GameCreateInput,
  GameUpdateInput
) {
  @Inject("GameService")
  private GameService: GameService;
  constructor() {
    super();
  }

  @Query(
    () => {
      return [Game];
    },
    {
      name: "list" + Game.name,
    }
  )
  list(
    @Ctx() ctx,
    @Arg(
      "input",
      () => {
        return GameFilterInput;
      },
      { nullable: true }
    )
    input
  ) {
    let query: any = input || {};
    if (query.name) {
      query.name = { $regex: new RegExp(`^${query.name}`, "i") };
    } else {
      delete query.name;
    }
    console.log(query);
    return this.GameService.find(query);
  }


}
