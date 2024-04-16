const express = require("express");
const {
  getJobfairs,
  getJobfair,
  createJobfair,
  updateJobfair,
  deleteJobfair,
  getVacCenters,
} = require("../controllers/jobfairs");

/**
 * @swagger
 * components:
 *   schemas:
 *     Jobfair:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the jobfair
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         ลำดับ:
 *           type: string
 *           description: Ordinal number
 *         name:
 *           type: string
 *           description: Jobfair name
 *         address:
 *           type: string
 *           description: House No., Street, Road
 *         district:
 *           type: string
 *           description: District
 *         province:
 *           type: string
 *           description: province
 *         postalcode:
 *           type: string
 *           description: 5-digit postal code
 *         tel:
 *           type: string
 *           description: telephone number
 *         region:
 *           type: string
 *           description: region
 *       example:
 *         id: 609bda561452242d88d36e37
 *         ลำดับ: 121
 *         name: Happy Jobfair
 *         address: 121 ถ.สุขุมวิท
 *         district: บางนา
 *         province: กรุงเทพมหานคร
 *         postalcode: 10110
 *         tel: 02-2187000
 *         region: กรุงเทพมหานคร(Bangkok)
 */

/**
 * @swagger
 * tags:
 *   name: Jobfairs
 *   description: The jobfairs managing API
 */

/**
 * @swagger
 * /jobfairs:
 *   get:
 *     summary: Returns the list of all the jobfairs
 *     tags: [Jobfairs]
 *     responses:
 *       200:
 *         description: The list of the jobfairs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Jobfair'
 */

/**
 * @swagger
 * /jobfairs/{id}:
 *   get:
 *     summary: Get the jobfair by id
 *     tags: [Jobfairs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The jobfair id
 *     responses:
 *       200:
 *         description: The jobfair description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Jobfair'
 *       404:
 *         description: The jobfair was not found
 */

/**
 * @swagger
 * /jobfairs:
 *   post:
 *     summary: Create a new jobfair
 *     tags: [Jobfairs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Jobfair'
 *     responses:
 *       201:
 *         description: The jobfair was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Jobfair'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /jobfairs/{id}:
 *   put:
 *     summary: Update the jobfair by id
 *     tags: [Jobfairs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The jobfair id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Jobfair'
 *     responses:
 *       200:
 *         description: The jobfair was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Jobfair'
 *       404:
 *         description: The jobfair was not found
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /jobfairs/{id}:
 *   delete:
 *     summary: Remove the jobfair by id
 *     tags: [Jobfairs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The jobfair id
 *     responses:
 *       200:
 *         description: The jobfair was deleted
 *       404:
 *         description: The jobfair was not found
 */

//Include other resource routers
const appointmentRouter = require("./appointments");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:jobfairId/appointments/", appointmentRouter);
router.route("/vacCenters").get(getVacCenters);
router
  .route("/")
  .get(getJobfairs)
  .post(protect, authorize("admin"), createJobfair);
router
  .route("/:id")
  .get(getJobfair)
  .put(protect, authorize("admin"), updateJobfair)
  .delete(protect, authorize("admin"), deleteJobfair);

module.exports = router;
