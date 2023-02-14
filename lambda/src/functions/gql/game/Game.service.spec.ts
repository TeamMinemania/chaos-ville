import {Container} from "typedi";
import {GameService} from "./Game.service";
import {CropSpecies, CropSpeciesCreateInput, CropSpeciesUpdateInput} from "./Game";
import {Field} from "type-graphql/dist/decorators/Field";

describe('CropSpeciesService', () => {
    let service: GameService;
    beforeEach(() => {
        // service = Container.get('GameService');
    });
    it('should exist', () => {
        expect(service).toBeTruthy();
    });
    describe('GameService.list', () => {


        it('should list users', async () => {
            const entity = new CropSpeciesUpdateInput();
            const metadataKey = 'typegoose:properties'; // Symbol("Field");
            const metaDataResults  = Reflect.getMetadata(metadataKey, CropSpeciesUpdateInput);

            metaDataResults.forEach((r) => {

            });
        });

    });
})