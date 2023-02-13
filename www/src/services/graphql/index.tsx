const listCropSpecies = `
    query listCropSpecies($input: CropSpeciesFilterInput!){
  listCropSpecies(input:$input) {
    _id
    importId
    name
    lowTemp
    highTemp
    sewingMethods
    otherNames
    harvestDayMin
    harvestDayMax
    maxSpacingInCM
    minSpacingInCM
  }
}
`;
export { listCropSpecies };