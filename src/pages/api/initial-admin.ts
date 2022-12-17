import { NextApiResponse, NextApiRequest } from "next";
import bcrypt from 'bcryptjs'
import { createUser } from "../../database/operations/user";

export default async function InitialAdmin(req:NextApiRequest, res:NextApiResponse) {
    return res.json({msg: 'hello world'})
}

// The following should only be uncommented for creating a new initail user/admin
// THIS SHOULD NOT BE USED IN PRODUCTION
/*
export default async function InitialAdmin(req:NextApiRequest, res:NextApiResponse) {

    const data = {
        email: 'mroglan3@gatech.edu',
        password: process.env.INITIAL_ADMIN_PASSWORD
    }

    const hashedPassword = await new Promise<string>((resolve, reject) => {
        bcrypt.hash(data.password, 10, (err, hash) => {
            if (err) reject(err)
            resolve(hash)
        })
    }).catch(err => {
        throw(err)
    })

    data.password = hashedPassword

    await createUser(data)

    return res.json({msg: 'Created initial user account'})
}
*/