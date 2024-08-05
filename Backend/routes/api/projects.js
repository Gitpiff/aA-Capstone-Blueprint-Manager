const express = require('express');
const { check } = require('express-validator');
const { Project } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();


const projectValidator = [
    check('name')
      .isLength({ min: 7, max: 30 })
      .withMessage('Project Name must have between 7 and 30 characters')
      .notEmpty()
      .withMessage('Project Name is required'),
    check('clientName')
      .isLength({ min: 7, max: 30 })
      .withMessage('Client Name must have between 7 and 30 characters')
      .notEmpty()
      .withMessage('Client Name is required'),
    check('description')
      .isLength({ min: 30, max: 2000 })
      .withMessage('Project Description must have between 30 and 2000 characters')
      .notEmpty()
      .withMessage('Project Description is required'),
    check('budget')
      .isInt({ min: 501 })
      .withMessage('Budget must be greater than 500')
      .notEmpty()
      .withMessage('Budget is required'),
    check('startDate')
      .isDate()
      .withMessage('Start Date must be a valid date')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('Start Date cannot be in the past');
        }
        return true;
      })
      .withMessage('Start Date cannot be in the past'),
    check('completionDate')
      .isDate()
      .withMessage('Completion Date must be a valid date')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error('Completion Date cannot be on or before Start Date');
        }
        return true;
      })
      .withMessage('Completion Date cannot be on or before Start Date'),
  
    handleValidationErrors
  ];

  //Get All Projects Owned by the Current User
  router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    console.log(`User: ${user}`)

    if (user) {
        const projects = await Project.findAll({
            where: {
                projectManagerId: user.id
            }
        })
        console.log(projects)
    }

  })

// Get All Projects
router.get('/', async (req, res, next) => {
    try {
        const projects = await Project.findAll();
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
});
  
// Get a Project By Id
router.get('/:projectId', requireAuth, async (req, res, next) => {
    try {
        const project = await Project.findByPk(req.params.projectId);
        if (project) {
        res.status(200).json(project);
        } else {
        res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        next(error);
    }
});

// Update Project 
router.put('/:projectId', requireAuth, async (req, res, next) => {
    const { projectManager } = req;
    try {
        const { name, clientName, description, budget, startDate, completionDate } = req.body;
        const project = await Project.findByPk(req.params.projectId);

        if (project) {
            if (project.projectManagerId !== projectManager.id) {
                return res.status(403).json({ message: "Unauthorized to update this project" });
            }
            project.name = name;
            project.clientName = clientName;
            project.description = description;
            project.budget = budget;
            project.startDate = startDate;
            project.completionDate = completionDate;
          

            await project.save();

            res.status(200).json(project);
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        next({
            message: "Bad Request",
            status: 400,
            stack: error.stack
        });
    }
});

// Delete Project
router.delete('/:projectId', requireAuth, async (req, res, next) => {
    const { projectManager } = req;
    try {
        const project = await Project.findByPk(req.params.projectId);

        if (project) {
            if (project.projectManagerId !== projectManager.id) {
                return res.status(403).json({ message: "Unauthorized to delete this project" });
            }

            await project.destroy();
            res.status(200).json({ message: "Project Successfully Deleted" });
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        next(error);
    }
});

// Post New Project
router.post('/new', requireAuth, async (req, res, next) => {
    const { projectManager } = req;
    try {
        const { name, clientName, description, budget, coverImage, commencementDate, completionDate } = req.body;

        if (projectManager) {
            const newProject = await Project.create ({
                name,
                clientName,
                description,
                budget,
                coverImage,
                projectManagerId: projectManager.id,
                commencementDate,
                completionDate
            })

            res.status(201).json(newProject);
        } else {
            res.status(403).json({ message: "Unauthorized" }); 
        }

    } catch(error) {
        error.message = "Bad Request"
        error.status = 400
        next(error)
    }

})

// Get All Projects of Current PM
router.get('/current', requireAuth, async (req, res, next) => {
    const { projectManager } = req;

    if(!projectManager) {
        return res.status(401).json({
            message: 'Authentication Required'
        })
    };

    const projects = await Project.findAll({
       include: [
            {
                model: Project
            }
       ],
       where: {
        projectManagerId: projectManager.id
       }
    })
    res.status(200).json(projects);

    if (!projects) {
        return res.status(404).json({
            message: 'Projects could not be found'
        })
    };

});


module.exports = router;