import { selectAllGroups } from "../models/Groups.js";
import { emptyOrRows } from "../helpers/emptyOrRows.js";

const getGroups = async (req, res, next) => {
    try {
        const result = await selectAllGroups()
        return res.status(200).json(emptyOrRows(result))
    } catch (error) {
        return next(error)
    }
}

export { getGroups }