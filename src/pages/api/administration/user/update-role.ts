import { NextApiRequest, NextApiResponse } from "next";
import { addUserRoleWithEmail, moveRoleWithKnownUsers, moveRoleWithUnknownUser, updateUserRoles } from "../../../../database/operations/user";
import { includesAdminRole, verifyUser } from "../../../../utils/auth";

export default verifyUser(async function UpdateRole(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method.'})
    }

    try {

        if (!includesAdminRole(req.body.jwtUser.roles)) {
            return res.status(403).json({msg: 'Permission to update role denied.'})
        }

        if (req.body.prevUserId && !req.body.prevUserUpdatedRoles) {
            return res.status(400).json({msg: 'Must have previous user updated \
                roles if passing prev user id.'})
        }

        if (req.body.prevUserId && req.body.prevUserUpdatedRoles 
            && req.body.newUserId && req.body.newUserUpdatedRoles) {
            const data = await moveRoleWithKnownUsers(req.body.prevUserId,
                req.body.prevUserUpdatedRoles, req.body.newUserId, 
                req.body.newUserUpdatedRoles)
            return res.status(200).json(data)
        }

        if (req.body.role && req.body.prevUserId && req.body.prevUserUpdatedRoles 
            && req.body.newUserEmail) {
            const data = await moveRoleWithUnknownUser(req.body.role, 
                req.body.prevUserId, req.body.prevUserUpdatedRoles,
                req.body.newUserEmail)
            return res.status(200).json(data)
        }

        if (req.body.prevUserId && req.body.prevUserUpdatedRoles) {
            const data = await updateUserRoles(req.body.prevUserId, 
                req.body.prevUserUpdatedRoles) 
            return res.status(200).json(data)
        }

        if (req.body.newUserId && req.body.newUserUpdatedRoles) {
            const data = await updateUserRoles(req.body.newUserId,
                req.body.newUserUpdatedRoles)
            return res.status(200).json(data)
        }

        if (req.body.newUserEmail && req.body.role) {
            const data = await addUserRoleWithEmail(req.body.newUserEmail,
                req.body.role)
            return res.status(200).json(data)
        }
        
        return res.status(400).json({msg: 'Invalid combination.'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})