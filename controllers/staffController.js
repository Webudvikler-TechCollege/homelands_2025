import express from 'express';
import { errorResponse, successResponse } from '../utils/responseUtils.js';
import { getQueryAttributes, getQueryLimit, getQueryOrder } from '../utils/apiUtils.js';
import { staffModel as model } from '../models/staffModel.js';

export const staffController = express.Router();
// Base-URL for alle ruter i denne controller
const url = 'staff';

// GET: Henter alle records fra databasen
staffController.get(`/${url}`, async (req, res) => {
    try {
        // Henter liste af records fra modellen
        const list = await model.findAll({
            // Begrænser felter
            attributes: getQueryAttributes(req.query, 'id, firstname, lastname, position, email, phone, image'),
            // Begrænser antal records
            limit: getQueryLimit(req.query),
            // Sorterer resultat stigende efter felt 
            order: getQueryOrder(req.query),
        });
        if (!list || list.length === 0) {
            return errorResponse(res, `No records found`, 404); // Returnerer fejl hvis ingen poster findes
        }
        successResponse(res, list); // Returnerer succesrespons med listen
    } catch (error) {
        errorResponse(res, `Error fetching records: ${error.message}`); // Håndterer fejl
    }
});

// GET: Henter en enkelt record baseret på ID
staffController.get(`/${url}/:id([0-9]+)`, async (req, res) => {
    try {
        // Læser ID fra URL
        const id = parseInt(req.params.id, 10);
        // Finder en enkelt record baseret på ID
        let details = await model.findByPk(id);
        // Fejlhåndtering hvis ingen record matcher
        if (!details) return errorResponse(res, `Record not found`, 404);
        // Returnerer matchende record
        successResponse(res, details);
    } catch (error) {
        errorResponse(res, `Error fetching record details: ${error.message}`); // Håndterer fejl
    }
});