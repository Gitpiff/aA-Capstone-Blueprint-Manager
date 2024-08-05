'use strict';
const bcrypt = require('bcryptjs');

let options = {};
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Employees';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Norman',
        lastname: 'Foster',
        jobTitle: 'Architect',
        hireDate: '2024-01-01',
        contactNumber: '753 456 7890',
        email: 'nfoster@navarroconstruction.com',
        salary: 70000,
        picture: 'https://cdn.rt.emap.com/wp-content/uploads/sites/4/2014/07/17115110/04.jpg',
        projectId: 1
      },
      {
        firstName: 'Zaha',
        lastname: 'Hadid',
        jobTitle: 'Designer',
        hireDate: '2024-01-01',
        contactNumber: '753 456 7890',
        email: 'zhadid@navarroconstruction.com',
        salary: 70000,
        picture: 'https://www.etoffe.com/409744/perspective-01-rug-by-zaha-hadid-architects-illulian.jpg',
        projectId: 1
      },
      {
        firstName: 'John',
        lastname: 'Doe',
        jobTitle: 'Iron Worker',
        hireDate: '2024-01-01',
        contactNumber: '753 456 7890',
        email: 'victorn@navarroconstruction.com',
        salary: 70000,
        picture: 'https://images.unsplash.com/photo-1582489852031-9a1ad48ed893?q=80&w=4740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        projectId: 1
      }, 
      {
        firstName: 'Andres',
        lastname: 'Perez',
        jobTitle: 'Framer',
        hireDate: '2024-01-01',
        contactNumber: '753 456 7890',
        email: 'aperez@navarroconstruction.com',
        salary: 70000,
        picture: 'https://images.unsplash.com/photo-1672748341520-6a839e6c05bb?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        projectId: 1
      },
      {
        firstName: 'Samuel',
        lastname: 'Cruz',
        jobTitle: 'Electrician',
        hireDate: '2024-01-01',
        contactNumber: '753 456 7890',
        email: 'scruz@navarroconstruction.com',
        salary: 70000,
        picture: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        projectId: 1
      },
      {
        firstName: 'Amanda',
        lastname: 'Smith',
        jobTitle: 'Electrician',
        hireDate: '2024-01-01',
        contactNumber: '753 456 7890',
        email: 'asmith@navarroconstruction.com',
        salary: 70000,
        picture: 'https://images.unsplash.com/photo-1712669622011-0634303f5b3e?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        projectId: 1
      }

    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
