App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets
    $.getJSON('../pets.json', function (data) {
      const petsRow = $('#petsRow');
      const petTemplate = $('#petTemplate');

      for (let i = 0; i < data.length; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log("User denied account access");
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Adoption.json', function (data) {
      const AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      App.contracts.Adoption.setProvider(App.web3Provider);
      App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function () {
    App.contracts.Adoption.deployed().then(function (instance) {
      return instance.getAdopters.call();
    }).then(function (adopters) {
      for (let i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Adopted').attr('disabled', true);
        }
      }
    }).catch(function (error) {
      console.log(error.message);
    });
  },

  handleAdopt: function (event) {
    event.preventDefault();

    const petId = parseInt($(event.target).data('id'));
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
        return;
      }

      const account = accounts[0];
      App.contracts.Adoption.deployed().then(function (instance) {
        return instance.adopt(petId, { from: account });
      }).then(function () {
        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
