import "reflect-metadata";
import { Container, Inject, Service } from "typedi";
import * as fs from "fs";
import { BaseService } from "../../../libs/Base.service";
import pluralize from "pluralize";
import _ from "lodash";
import DataLoader from "dataloader";
import {Game} from "@functions/gql/game/Game";
@Service("GameService")
export class GameService extends BaseService(Game) {
  @Inject("GameModel")
  private GameModel;

  constructor() {
    super();
  }
}
