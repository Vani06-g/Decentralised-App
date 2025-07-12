const Adoption = artifacts.require("Adoption");

contract("Adoption", (accounts) => {
  let adoption;
  let expectedAdopter;

  before(async () => {
    adoption = await Adoption.deployed();
  });

  describe("adopting a pet and retrieving account addresses", () => {
    before(async () => {
      await adoption.adopt(8, { from: accounts[0] });
      expectedAdopter = accounts[0];
    });

    it("can fetch the address of an owner by pet id", async () => {
      const adopter = await adoption.adopters(8);
      assert.equal(
        adopter,
        expectedAdopter,
        "Owner of adopted pet should be accounts[0]"
      );
    });

    it("can fetch the collection of all pet owners", async () => {
      const adopters = await adoption.getAdopters();
      assert.equal(
        adopters[8],
        expectedAdopter,
        "Owner at index 8 should be accounts[0]"
      );
    });
  });
});