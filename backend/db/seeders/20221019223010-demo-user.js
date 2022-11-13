'use strict';

/* @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize')
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Dex',
        lastName: 'Asssfg',
        email: 'user0@user.co',
        username: 'Dorkster',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Jacob',
        lastName: 'Lauxman',
        email: 'user1@user.co',
        username: 'Jauxman',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Mike',
        lastName: 'Miller',
        email: 'user3@user.co',
        username: 'MMMCMM',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Arko',
        lastName: 'chakman',
        email: 'user12@user.net',
        username: 'RKOman',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Jado',
        lastName: 'oooooh',
        email: 'user21@user.com',
        username: 'Jmoney',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Matt',
        lastName: 'Mastersmith',
        email: 'user111@user.io',
        username: 'Ketmasta',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Trsdvevor',
        lastName: 'Moovsvre',
        email: 'usered111@user.io',
        username: 'MoTrev1',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Trevofdr',
        lastName: 'Mooffdre',
        email: 'user11111@user.io',
        username: 'MoTrev2',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Tsdrevor',
        lastName: 'Mofore',
        email: 'used111@user.io',
        username: 'MoTrev3',
        hashedPassword: bcrypt.hashSync('password')
      }, {
        firstName: 'Tsdrevor',
        lastName: 'Moasdore',
        email: 'red111@user.io',
        username: 'MoTrev4',
        hashedPassword: bcrypt.hashSync('password')
      }
    ], {})
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '100 California St',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        lat: 37.783617,
        lng: -122.411507,
        name: 'Casa De La Dexta',
        description: 'big rooms and crying babies, good wifi, clean sheets, and a sink full of dirty dishes.',
        price: 123.12
      },
      {
        ownerId: 2,
        address: '200 Sacremento St',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        lat: 37.903617,
        lng: -122.601507,
        name: 'Jacobs Couch',
        description: 'A perfect couch with up to 3 furry sleeping companions!',
        price: 210.21
      }, {
        ownerId: 3,
        address: '300 Clay St',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        lat: 37.093617,
        lng: -122.901507,
        name: 'Millers Mansion',
        description: 'A super eco-friendly, commune catering to people of all walks of life',
        price: 420.42
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
        review: 'Super stoked bruh, 10/1 luvd it ',
        stars: 5
      },
      {
        spotId: 1,
        userId: 5,
        review: 'WHAAT A DUMPSTER FIRE!!!! Did you know that babies cry at night?!?!',
        stars: 1
      },
      {
        spotId: 2,
        userId: 4,
        review: 'I thought the cats singing voices were beautiful, will be back!',
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Jeeez what was that whole thinng about, I thought it was free....',
        stars: 1
      },
      {
        spotId: 2,
        userId: 6,
        review: 'The couch was unbeliable.... And breakfast! ',
        stars: 5
      },
      {
        spotId: 2,
        userId: 5,
        review: 'I hate cats! ',
        stars: 1
      },
      {
        spotId: 3,
        userId: 6,
        review: 'Was recommended to come here by a friend... did not expect to see them there when i arrived ',
        stars: 3
      }, {
        spotId: 1,
        userId: 6,
        review: 'I mean, who could say no to that sweet little baby face',
        stars: 5
      }
    ], {})

    await queryInterface.bulkInsert('ReviewImages', [
      {
        reviewId: 1,
        url: 'https://media.istockphoto.com/id/140217119/photo/my-flatmate-hasnt-done-the-chores-again.jpg?s=1024x1024&w=is&k=20&c=bE5PP4SakTtt1d6BqG6mI8F6CV9I8-wBfQfZN7oLsAM='
      }, {
        reviewId: 4,
        url: 'http:/www.whatsitcalled.net'
      }, {
        reviewId: 5,
        url: 'http:/www.halalulah.net'
      }, {
        reviewId: 2,
        url: 'https://m.media-amazon.com/images/M/MV5BOTA3NmU1NDMtYzcxMC00ZjI5LTllZWItYWI3MmZkNTE1ZTg0XkEyXkFqcGdeQW1hcmNtYW5u._V1_.jpg'
      },
      {
        reviewId: 3,
        url: 'http:/www.gosdfsfogz.com'
      }
    ], {})
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/dd9cf0f0-57e0-42a5-aef6-b15e95ab0d40.jpg?im_w=960',
        preview: true
      },
      {
        spotId: 2,
        url: 'www.wwf.com',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-51165983/original/68d5ccb4-194c-4470-9e61-d0aa02b1c9d0.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/56467892-0d23-4ab1-8302-9c3d0d5e52cd.jpg?im_w=1200',
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
        spotId: 3,
        userId: 1,
        startDate: '2023-01-11',
        endDate: '2023-02-02'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2023-02-05',
        endDate: '2023-03-01'
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
      }, {
        spotId: 2,
        userId: 1,
        startDate: '2022-06-02',
        endDate: '2022-07-01'
      }, {
        spotId: 2,
        userId: 1,
        startDate: '2021-06-02',
        endDate: '2021-07-01'
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
