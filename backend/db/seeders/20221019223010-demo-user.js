'use strict';

/* @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize")
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Dex',
        lastName: 'Asssfg',
        email: 'demo@user.io',
        username: 'Dorkster',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Jacob',
        lastName: 'Lauxman',
        email: 'user1@user.co',
        username: 'Jauxman',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Mike',
        lastName: 'Miller',
        email: 'somewher@else.com',
        username: 'MMMCMM',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Arko',
        lastName: 'chakman',
        email: 'user12@user.net',
        username: 'RKOman',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Jado',
        lastName: 'oooooh',
        email: 'user21@user.com',
        username: 'Jmoney',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Matt',
        lastName: 'Mastersmith',
        email: 'user111@user.io',
        username: 'Ketmasta',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Trevor',
        lastName: 'Moore',
        email: 'usered111@user.io',
        username: 'MoTrev',
        hashedPassword: bcrypt.hashSync('password2')
      }
    ], {})
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: 'left',
        city: 'Bay Area',
        state: 'CA',
        country: 'murica',
        lat: 42.03,
        lng: 54.56,
        name: 'Casa De La Dexta',
        description: 'big rooms and crying babies',
        price: 100.10
      },
      {
        ownerId: 2,
        address: 'left of right',
        city: 'Tinsel Town',
        state: 'OR',
        country: 'murica',
        lat: 7.03,
        lng: 1.56,
        name: 'Jacobs Couch',
        description: 'super plush bruh',
        price: 104.10
      }, {
        ownerId: 3,
        address: '122 millsway',
        city: 'Millersville',
        state: 'KY',
        country: 'murica',
        lat: 75.03,
        lng: 13.56,
        name: 'Tent outside',
        description: 'Soft grass',
        price: 44.10
      }
    ], {})

    await queryInterface.bulkInsert('Reviews', [
      {
        spotId: 1,
        userId: 2,
        review: 'Faye is GOORRRgeous ',
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Faye is GOORRRgeous, my mommy said so ',
        stars: 5
      },
      {
        spotId: 1,
        userId: 5,
        review: 'WHAAT A DUMPSTER FIRE!!!!',
        stars: 4
      },
      {
        spotId: 2,
        userId: 4,
        review: 'Super fun, 10/10 would recommend',
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Jeeez what was that whole thinng about',
        stars: 4
      },
      {
        spotId: 2,
        userId: 6,
        review: 'The couch was unbeliable.... And breakfast! ',
        stars: 5
      }
    ], {})

    await queryInterface.bulkInsert('ReviewImages', [
      {
        reviewId: 1,
        url: 'http:/www.cl.org'
      }, {
        reviewId: 4,
        url: 'http:/www.whatsitcalled.net'
      }, {
        reviewId: 5,
        url: 'http:/www.halalulah.net'
      }, {
        reviewId: 2,
        url: 'http:/www.googz.com'
      },
      {
        reviewId: 3,
        url: 'http:/www.gosdfsfogz.com'
      }
    ], {})
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'www.ilovemywife.com',
        preview: true
      },
      {
        spotId: 2,
        url: 'www.wwf.com',
        preview: false
      },
      {
        spotId: 2,
        url: 'www.theotherwwf.com',
        preview: true
      },
      {
        spotId: 3,
        url: 'www.nottheaniimals.com',
        preview: true
      },
      {
        spotId: 1,
        url: 'www.facebawk.com',
        preview: false
      },

    ])

    await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 2,
        userId: 1,
        startDate: '2020-01-11',
        endDate: '2020-02-02'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2022-02-05',
        endDate: '2022-03-01'
      },
      {
        spotId: 1,
        userId: 2,
        startDate: '2022-04-04',
        endDate: '2022-05-01'
      },
      {
        spotId: 1,
        userId: 3,
        startDate: '2022-06-02',
        endDate: '2022-07-01'
      }

    ], {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('SpotImages', {})
    await queryInterface.bulkDelete('ReviewImages', {})
    await queryInterface.bulkDelete('Bookings', {})
    await queryInterface.bulkDelete('Reviews', {})
    await queryInterface.bulkDelete('Spots', {})
    await queryInterface.bulkDelete('Users', {});
  },
};
